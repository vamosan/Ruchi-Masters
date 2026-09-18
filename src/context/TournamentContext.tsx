import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Tournament, 
  Team, 
  Match, 
  Announcement, 
  Player, 
  ExtraType, 
  WicketType, 
  BallRecord, 
  Innings,
  BattingStats,
  BowlingStats
} from '../types/cricket';
import { 
  INITIAL_TOURNAMENT, 
  INITIAL_TEAMS, 
  INITIAL_MATCHES 
} from '../data/initialData';
import { ballsToOversStr, generateCommentary } from '../utils/cricketEngine';
import { AuthUser, AuthRole } from '../types/auth';
import { HallOfFameEntry, HallOfFameMedia } from '../types/cricket';
import { INITIAL_HALL_OF_FAME } from '../data/hallOfFameData';

interface ScoreBallPayload {
  runs: number;
  extraType: ExtraType;
  extraRuns: number;
  isWicket: boolean;
  wicketType?: WicketType;
  dismissedPlayerId?: string;
  fielderId?: string;
  customCommentary?: string;
}

interface TournamentContextType {
  tournament: Tournament;
  teams: Team[];
  matches: Match[];
  activeMatchId: string;
  viewMode: 'spectator' | 'organizer';
  activeTab: string;
  setActiveMatchId: (id: string) => void;
  setViewMode: (mode: 'spectator' | 'organizer') => void;
  setActiveTab: (tab: string) => void;
  updateTournament: (updated: Tournament) => void;
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
  addPlayer: (teamId: string, player: Player) => void;
  updatePlayer: (teamId: string, player: Player) => void;
  deletePlayer: (teamId: string, playerId: string) => void;
  scheduleMatch: (match: Match) => void;
  updateMatch: (match: Match) => void;
  deleteMatch: (matchId: string) => void;
  startMatchToss: (
    matchId: string, 
    tossWinnerId: string, 
    tossDecision: 'bat' | 'bowl',
    strikerId: string,
    nonStrikerId: string,
    bowlerId: string
  ) => void;
  scoreBall: (matchId: string, payload: ScoreBallPayload) => void;
  undoLastBall: (matchId: string) => void;
  changeBowler: (matchId: string, newBowlerId: string) => void;
  setNewBatter: (matchId: string, newBatterId: string, isStriker: boolean) => void;
  endInnings: (matchId: string, newStrikerId: string, newNonStrikerId: string, newBowlerId: string) => void;
  finishMatch: (matchId: string, winnerTeamId?: string, margin?: string, potmId?: string) => void;
  autoGenerateRoundRobinFixtures: () => void;
  resetToDemoData: () => void;
  exportTournamentJson: () => string;
  importTournamentJson: (jsonStr: string) => boolean;
  hallOfFame: HallOfFameEntry[];
  addHallOfFameEntry: (entry: HallOfFameEntry) => void;
  addMediaToHallOfFame: (year: number, media: HallOfFameMedia) => void;
  currentUser: AuthUser;
  canEditTeam: (teamId: string) => boolean;
  isAdmin: () => boolean;
  loginAsAdmin: (passcode?: string) => boolean;
  loginAsTeam: (teamId: string, passcode?: string) => boolean;
  setTeamPasscode: (teamId: string, newPasscode: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalTeamId: string | null;
  openAuthModal: (teamId?: string) => void;
  closeAuthModal: () => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOURNAMENT: 'cricmaster_tournament_v3',
  TEAMS: 'cricmaster_teams_v3',
  MATCHES: 'cricmaster_matches_v3',
  VIEW_MODE: 'cricmaster_view_mode_v3',
  AUTH_USER: 'cricmaster_auth_user_v3',
};

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournament, setTournament] = useState<Tournament>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOURNAMENT);
    return saved ? JSON.parse(saved) : INITIAL_TOURNAMENT;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 40) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_TEAMS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [activeMatchId, setActiveMatchId] = useState<string>('m-103');
  const [viewMode, setViewMode] = useState<'spectator' | 'organizer'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return (saved as 'spectator' | 'organizer') || 'spectator';
  });
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Authentication State
    const [hallOfFame, setHallOfFame] = useState<HallOfFameEntry[]>(() => {
    const saved = localStorage.getItem('cricmaster_hall_of_fame_v1');
    return saved ? JSON.parse(saved) : INITIAL_HALL_OF_FAME;
  });

  useEffect(() => {
    localStorage.setItem('cricmaster_hall_of_fame_v1', JSON.stringify(hallOfFame));
  }, [hallOfFame]);

  const addHallOfFameEntry = (entry: HallOfFameEntry) => {
    setHallOfFame(prev => {
      const exists = prev.some(e => e.year === entry.year);
      if (exists) {
        return prev.map(e => e.year === entry.year ? entry : e);
      }
      return [entry, ...prev].sort((a, b) => b.year - a.year);
    });
  };

  const addMediaToHallOfFame = (year: number, media: HallOfFameMedia) => {
    setHallOfFame(prev => prev.map(e => {
      if (e.year === year) {
        return {
          ...e,
          media: [media, ...(e.media || [])]
        };
      }
      return e;
    }));
  };

  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { role: 'spectator', name: 'Spectator' };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTeamId, setAuthModalTeamId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const openAuthModal = (teamId?: string) => {
    setAuthModalTeamId(teamId || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalTeamId(null);
  };

  const canEditTeam = (teamId: string): boolean => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'team' && currentUser.teamId === teamId) return true;
    return false;
  };

  const isAdmin = (): boolean => {
    return currentUser.role === 'admin';
  };

  const loginAsAdmin = (passcode?: string): boolean => {
    // Demo passcode validation
    if (!passcode || passcode === 'admin123' || passcode.trim() === '') {
      const adminUser: AuthUser = {
        role: 'admin',
        name: 'Tournament Super Admin'
      };
      setCurrentUser(adminUser);
      setViewMode('organizer');
      return true;
    }
    return false;
  };

    const setTeamPasscode = (teamId: string, newPasscode: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          passcode: newPasscode,
          isPinSet: true
        };
      }
      return t;
    }));
  };

  const loginAsTeam = (teamId: string, passcode?: string): boolean => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return false;

    // Default tournament passcode is 2026
    const expectedPasscode = team.passcode || '2026';
    const isMatch = passcode === expectedPasscode || passcode === '2026';

    if (isMatch) {
      const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
      const teamUser: AuthUser = {
        role: 'team',
        teamId: team.id,
        teamName: team.name,
        teamLogo: team.logo,
        teamCode: team.code,
        name: captain?.name || team.managerName || (team.name + ' Captain')
      };
      setCurrentUser(teamUser);
      setViewMode('organizer');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser({ role: 'spectator', name: 'Spectator' });
    setViewMode('spectator');
  };


  // Local storage persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOURNAMENT, JSON.stringify(tournament));
  }, [tournament]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  const updateTournament = (updated: Tournament) => {
    setTournament(updated);
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`
    };
    setTournament(prev => ({
      ...prev,
      announcements: [newAnn, ...prev.announcements]
    }));
  };

  const deleteAnnouncement = (id: string) => {
    setTournament(prev => ({
      ...prev,
      announcements: prev.announcements.filter(a => a.id !== id)
    }));
  };

  const addTeam = (team: Team) => {
    setTeams(prev => [...prev, team]);
  };

  const updateTeam = (team: Team) => {
    setTeams(prev => prev.map(t => t.id === team.id ? team : t));
  };

  const deleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  const addPlayer = (teamId: string, player: Player) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          players: [...t.players, player]
        };
      }
      return t;
    }));
  };

  const updatePlayer = (teamId: string, player: Player) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          players: t.players.map(p => p.id === player.id ? player : p)
        };
      }
      return t;
    }));
  };

  const deletePlayer = (teamId: string, playerId: string) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          players: t.players.filter(p => p.id !== playerId)
        };
      }
      return t;
    }));
  };

  const scheduleMatch = (match: Match) => {
    setMatches(prev => [...prev, match]);
  };

  const updateMatch = (match: Match) => {
    setMatches(prev => prev.map(m => m.id === match.id ? match : m));
  };

  const deleteMatch = (matchId: string) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const startMatchToss = (
    matchId: string, 
    tossWinnerId: string, 
    tossDecision: 'bat' | 'bowl',
    strikerId: string,
    nonStrikerId: string,
    bowlerId: string
  ) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;

      const battingTeamId = (tossDecision === 'bat') ? tossWinnerId : (m.teamAId === tossWinnerId ? m.teamBId : m.teamAId);
      const bowlingTeamId = (battingTeamId === m.teamAId) ? m.teamBId : m.teamAId;

      const newInnings1: Innings = {
        inningsNumber: 1,
        battingTeamId,
        bowlingTeamId,
        totalRuns: 0,
        totalWickets: 0,
        oversCompletedStr: '0.0',
        legalBallsBowled: 0,
        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0, total: 0 },
        battingScorecard: [
          { playerId: strikerId, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissalInfo: 'batting', battingPosition: 1 },
          { playerId: nonStrikerId, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissalInfo: 'batting', battingPosition: 2 }
        ],
        bowlingScorecard: [
          { playerId: bowlerId, overs: 0, ballsLegal: 0, maidens: 0, runsConceded: 0, wickets: 0, economy: 0, dots: 0, wides: 0, noBalls: 0 }
        ],
        fallOfWickets: [],
        ballsHistory: [],
        isCompleted: false
      };

      return {
        ...m,
        status: 'live',
        tossWinnerId,
        tossDecision,
        currentInningsNumber: 1,
        liveStrikerId: strikerId,
        liveNonStrikerId: nonStrikerId,
        liveBowlerId: bowlerId,
        isFreeHitActive: false,
        innings1: newInnings1
      };
    }));
  };

  const scoreBall = (matchId: string, payload: ScoreBallPayload) => {
    setMatches(prev => prev.map(match => {
      if (match.id !== matchId || match.status !== 'live') return match;

      const curInnNum = match.currentInningsNumber;
      const innings = curInnNum === 1 ? match.innings1 : match.innings2;
      if (!innings) return match;

      const strikerId = match.liveStrikerId;
      const nonStrikerId = match.liveNonStrikerId;
      const bowlerId = match.liveBowlerId;

      if (!strikerId || !nonStrikerId || !bowlerId) return match;

      // Find player objects for commentary
      const allPlayers = teams.flatMap(t => t.players);
      const striker = allPlayers.find(p => p.id === strikerId);
      const bowler = allPlayers.find(p => p.id === bowlerId);
      const fielder = payload.fielderId ? allPlayers.find(p => p.id === payload.fielderId) : undefined;

      const isLegal = payload.extraType !== 'wide' && payload.extraType !== 'no_ball';
      const runsOffBat = (payload.extraType === 'wide' || payload.extraType === 'bye' || payload.extraType === 'leg_bye') ? 0 : payload.runs;
      const totalRunsThisBall = runsOffBat + payload.extraRuns;
      
      const newLegalBalls = innings.legalBallsBowled + (isLegal ? 1 : 0);
      const newTotalRuns = innings.totalRuns + totalRunsThisBall;
      const isWicket = payload.isWicket;
      const newTotalWickets = innings.totalWickets + (isWicket ? 1 : 0);
      const overIndex = Math.floor(innings.legalBallsBowled / 6);
      const ballInOver = (innings.legalBallsBowled % 6) + (isLegal ? 1 : 0);
      const ballNumberStr = `${overIndex}.${isLegal ? ballInOver : ((innings.legalBallsBowled % 6) || 0)}`;

      const commText = payload.customCommentary || generateCommentary(
        ballNumberStr,
        striker?.name || 'Striker',
        bowler?.name || 'Bowler',
        payload.runs,
        payload.extraType,
        payload.isWicket,
        payload.wicketType,
        fielder?.name
      );

      const ballRecord: BallRecord = {
        id: `ball-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        ballNumberStr,
        overIndex,
        ballInOver: isLegal ? ballInOver : (innings.legalBallsBowled % 6),
        bowlerId,
        strikerId,
        nonStrikerId,
        runsBat: runsOffBat,
        extraType: payload.extraType,
        extraRuns: payload.extraRuns,
        isWicket: payload.isWicket,
        wicketType: payload.wicketType,
        dismissedPlayerId: payload.dismissedPlayerId || (payload.isWicket ? strikerId : undefined),
        fielderId: payload.fielderId,
        commentary: commText,
        isFour: payload.runs === 4,
        isSix: payload.runs === 6,
        isLegalBall: isLegal,
        isFreeHit: match.isFreeHitActive || false,
        timestamp: Date.now()
      };

      // Update Batting Scorecard
      const battingScorecard = [...innings.battingScorecard];
      let strikerStats = battingScorecard.find(b => b.playerId === strikerId);
      if (!strikerStats) {
        strikerStats = {
          playerId: strikerId,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          strikeRate: 0,
          isOut: false,
          dismissalInfo: 'batting',
          battingPosition: battingScorecard.length + 1
        };
        battingScorecard.push(strikerStats);
      }

      if (payload.extraType !== 'wide') {
        strikerStats.balls += 1;
      }
      strikerStats.runs += runsOffBat;
      if (payload.runs === 4) strikerStats.fours += 1;
      if (payload.runs === 6) strikerStats.sixes += 1;
      strikerStats.strikeRate = strikerStats.balls > 0 ? Number(((strikerStats.runs / strikerStats.balls) * 100).toFixed(1)) : 0;

      if (isWicket) {
        const outPlayerId = payload.dismissedPlayerId || strikerId;
        const outPlayerStats = battingScorecard.find(b => b.playerId === outPlayerId);
        if (outPlayerStats) {
          outPlayerStats.isOut = true;
          let disText = 'out';
          if (payload.wicketType === 'bowled') disText = `b ${bowler?.name}`;
          else if (payload.wicketType === 'caught') disText = fielder ? `c ${fielder.name} b ${bowler?.name}` : `c & b ${bowler?.name}`;
          else if (payload.wicketType === 'lbw') disText = `lbw b ${bowler?.name}`;
          else if (payload.wicketType === 'run_out') disText = fielder ? `run out (${fielder.name})` : 'run out';
          else if (payload.wicketType === 'stumped') disText = fielder ? `st ${fielder.name} b ${bowler?.name}` : `stumped b ${bowler?.name}`;
          else if (payload.wicketType === 'hit_wicket') disText = `hit wicket b ${bowler?.name}`;
          outPlayerStats.dismissalInfo = disText;
        }
      }

      // Update Bowling Scorecard
      const bowlingScorecard = [...innings.bowlingScorecard];
      let bowlerStats = bowlingScorecard.find(b => b.playerId === bowlerId);
      if (!bowlerStats) {
        bowlerStats = {
          playerId: bowlerId,
          overs: 0,
          ballsLegal: 0,
          maidens: 0,
          runsConceded: 0,
          wickets: 0,
          economy: 0,
          dots: 0,
          wides: 0,
          noBalls: 0
        };
        bowlingScorecard.push(bowlerStats);
      }

      if (isLegal) {
        bowlerStats.ballsLegal += 1;
      }
      if (payload.extraType === 'wide') bowlerStats.wides += 1;
      if (payload.extraType === 'no_ball') bowlerStats.noBalls += 1;

      // Runs charged to bowler (runs off bat + wides + no ball extras; byes/leg-byes not charged to bowler)
      const runsToBowler = (payload.extraType === 'bye' || payload.extraType === 'leg_bye') ? 0 : totalRunsThisBall;
      bowlerStats.runsConceded += runsToBowler;

      if (isWicket && payload.wicketType !== 'run_out' && payload.wicketType !== 'retired_hurt') {
        bowlerStats.wickets += 1;
      }

      if (totalRunsThisBall === 0) {
        bowlerStats.dots += 1;
      }

      bowlerStats.overs = Number(ballsToOversStr(bowlerStats.ballsLegal));
      const bowlerOversDec = bowlerStats.ballsLegal / 6;
      bowlerStats.economy = bowlerOversDec > 0 ? Number((bowlerStats.runsConceded / bowlerOversDec).toFixed(2)) : 0;

      // Fall of Wickets
      const fallOfWickets = [...innings.fallOfWickets];
      if (isWicket) {
        const outPlayerId = payload.dismissedPlayerId || strikerId;
        const outPlayer = allPlayers.find(p => p.id === outPlayerId);
        fallOfWickets.push({
          wicketNumber: newTotalWickets,
          teamScore: newTotalRuns,
          oversStr: ballNumberStr,
          playerId: outPlayerId,
          playerName: outPlayer?.name || 'Batsman'
        });
      }

      // Extras summary
      const extras = { ...innings.extras };
      if (payload.extraType === 'wide') extras.wides += payload.extraRuns;
      if (payload.extraType === 'no_ball') extras.noBalls += payload.extraRuns;
      if (payload.extraType === 'bye') extras.byes += payload.extraRuns;
      if (payload.extraType === 'leg_bye') extras.legByes += payload.extraRuns;
      if (payload.extraType === 'penalty') extras.penalty += payload.extraRuns;
      extras.total = extras.wides + extras.noBalls + extras.byes + extras.legByes + extras.penalty;

      // Strike rotation logic:
      // If odd runs scored (1, 3, 5), rotate strike.
      // If end of legal over (ball 6), rotate strike again!
      let nextStrikerId = strikerId;
      let nextNonStrikerId = nonStrikerId;

      const physicalRuns = payload.runs;
      if (physicalRuns % 2 === 1) {
        // odd runs -> swap
        nextStrikerId = nonStrikerId;
        nextNonStrikerId = strikerId;
      }

      const isOverComplete = isLegal && (newLegalBalls % 6 === 0);
      if (isOverComplete) {
        // End of over: swap strikers
        const temp = nextStrikerId;
        nextStrikerId = nextNonStrikerId;
        nextNonStrikerId = temp;
      }

      const updatedInnings: Innings = {
        ...innings,
        totalRuns: newTotalRuns,
        totalWickets: newTotalWickets,
        legalBallsBowled: newLegalBalls,
        oversCompletedStr: ballsToOversStr(newLegalBalls),
        extras,
        battingScorecard,
        bowlingScorecard,
        fallOfWickets,
        ballsHistory: [ballRecord, ...innings.ballsHistory],
      };

      // Check for Innings 2 Chasing Win / Target Reached
      let isMatchFinished = false;
      let winnerId: string | undefined = undefined;
      let winMarginStr: string | undefined = undefined;

      const maxQuotaOvers = tournament.rules.oversPerInnings;
      const maxBallsInInnings = maxQuotaOvers * 6;

      if (curInnNum === 2 && innings.target) {
        if (newTotalRuns >= innings.target) {
          // Chasing team won!
          isMatchFinished = true;
          winnerId = innings.battingTeamId;
          const wicketsRemaining = 10 - newTotalWickets;
          const battingTeam = teams.find(t => t.id === innings.battingTeamId);
          winMarginStr = `${battingTeam?.name || 'Batting Team'} won by ${wicketsRemaining} wicket${wicketsRemaining === 1 ? '' : 's'}`;
        } else if (newTotalWickets >= 10 || newLegalBalls >= maxBallsInInnings) {
          // Defending team won or tied!
          isMatchFinished = true;
          const runDiff = (innings.target - 1) - newTotalRuns;
          if (runDiff > 0) {
            winnerId = innings.bowlingTeamId;
            const bowlingTeam = teams.find(t => t.id === innings.bowlingTeamId);
            winMarginStr = `${bowlingTeam?.name || 'Bowling Team'} won by ${runDiff} run${runDiff === 1 ? '' : 's'}`;
          } else {
            winMarginStr = 'Match Tied! (Super Over Available)';
          }
        }
      } else if (curInnNum === 1) {
        if (newTotalWickets >= 10 || newLegalBalls >= maxBallsInInnings) {
          updatedInnings.isCompleted = true;
        }
      }

      const nextFreeHit = payload.extraType === 'no_ball';

      return {
        ...match,
        innings1: curInnNum === 1 ? updatedInnings : match.innings1,
        innings2: curInnNum === 2 ? updatedInnings : match.innings2,
        liveStrikerId: isWicket && (payload.dismissedPlayerId === strikerId || !payload.dismissedPlayerId) ? undefined : nextStrikerId,
        liveNonStrikerId: isWicket && payload.dismissedPlayerId === nonStrikerId ? undefined : nextNonStrikerId,
        isFreeHitActive: nextFreeHit,
        status: isMatchFinished ? 'completed' : (updatedInnings.isCompleted && curInnNum === 1 ? 'innings_break' : 'live'),
        winnerTeamId: winnerId || match.winnerTeamId,
        winMargin: winMarginStr || match.winMargin
      };
    }));
  };

  const undoLastBall = (matchId: string) => {
    setMatches(prev => prev.map(match => {
      if (match.id !== matchId) return match;
      const curInnNum = match.currentInningsNumber;
      const innings = curInnNum === 1 ? match.innings1 : match.innings2;
      if (!innings || innings.ballsHistory.length === 0) return match;

      const [lastBall, ...remainingHistory] = innings.ballsHistory;
      
      const isLegal = lastBall.isLegalBall;
      const totalRunsThisBall = lastBall.runsBat + lastBall.extraRuns;
      const newTotalRuns = Math.max(0, innings.totalRuns - totalRunsThisBall);
      const newLegalBalls = Math.max(0, innings.legalBallsBowled - (isLegal ? 1 : 0));
      const newTotalWickets = Math.max(0, innings.totalWickets - (lastBall.isWicket ? 1 : 0));

      // Revert Batting
      const battingScorecard = innings.battingScorecard.map(b => {
        if (b.playerId === lastBall.strikerId) {
          const balls = Math.max(0, b.balls - (lastBall.extraType !== 'wide' ? 1 : 0));
          const runs = Math.max(0, b.runs - lastBall.runsBat);
          const fours = Math.max(0, b.fours - (lastBall.isFour ? 1 : 0));
          const sixes = Math.max(0, b.sixes - (lastBall.isSix ? 1 : 0));
          return {
            ...b,
            runs,
            balls,
            fours,
            sixes,
            strikeRate: balls > 0 ? Number(((runs / balls) * 100).toFixed(1)) : 0,
            isOut: lastBall.isWicket && (lastBall.dismissedPlayerId === b.playerId || !lastBall.dismissedPlayerId) ? false : b.isOut,
            dismissalInfo: lastBall.isWicket && (lastBall.dismissedPlayerId === b.playerId || !lastBall.dismissedPlayerId) ? 'batting' : b.dismissalInfo
          };
        }
        return b;
      });

      // Revert Bowling
      const bowlingScorecard = innings.bowlingScorecard.map(b => {
        if (b.playerId === lastBall.bowlerId) {
          const ballsLegal = Math.max(0, b.ballsLegal - (isLegal ? 1 : 0));
          const runsToBowler = (lastBall.extraType === 'bye' || lastBall.extraType === 'leg_bye') ? 0 : totalRunsThisBall;
          const runsConceded = Math.max(0, b.runsConceded - runsToBowler);
          const wickets = Math.max(0, b.wickets - (lastBall.isWicket && lastBall.wicketType !== 'run_out' ? 1 : 0));
          const wides = Math.max(0, b.wides - (lastBall.extraType === 'wide' ? 1 : 0));
          const noBalls = Math.max(0, b.noBalls - (lastBall.extraType === 'no_ball' ? 1 : 0));
          const oversDec = ballsLegal / 6;
          return {
            ...b,
            ballsLegal,
            runsConceded,
            wickets,
            wides,
            noBalls,
            overs: Number(ballsToOversStr(ballsLegal)),
            economy: oversDec > 0 ? Number((runsConceded / oversDec).toFixed(2)) : 0
          };
        }
        return b;
      });

      // Revert Fall of Wickets
      const fallOfWickets = lastBall.isWicket ? innings.fallOfWickets.slice(0, -1) : innings.fallOfWickets;

      // Revert Extras
      const extras = { ...innings.extras };
      if (lastBall.extraType === 'wide') extras.wides -= lastBall.extraRuns;
      if (lastBall.extraType === 'no_ball') extras.noBalls -= lastBall.extraRuns;
      if (lastBall.extraType === 'bye') extras.byes -= lastBall.extraRuns;
      if (lastBall.extraType === 'leg_bye') extras.legByes -= lastBall.extraRuns;
      extras.total = extras.wides + extras.noBalls + extras.byes + extras.legByes + extras.penalty;

      const updatedInnings: Innings = {
        ...innings,
        totalRuns: newTotalRuns,
        totalWickets: newTotalWickets,
        legalBallsBowled: newLegalBalls,
        oversCompletedStr: ballsToOversStr(newLegalBalls),
        extras,
        battingScorecard,
        bowlingScorecard,
        fallOfWickets,
        ballsHistory: remainingHistory,
        isCompleted: false
      };

      return {
        ...match,
        status: 'live',
        innings1: curInnNum === 1 ? updatedInnings : match.innings1,
        innings2: curInnNum === 2 ? updatedInnings : match.innings2,
        liveStrikerId: lastBall.strikerId,
        liveNonStrikerId: lastBall.nonStrikerId,
        liveBowlerId: lastBall.bowlerId,
        isFreeHitActive: lastBall.isFreeHit
      };
    }));
  };

  const changeBowler = (matchId: string, newBowlerId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const curInn = m.currentInningsNumber === 1 ? m.innings1 : m.innings2;
      if (!curInn) return m;

      // Check if already in bowling scorecard, else add
      const exists = curInn.bowlingScorecard.some(b => b.playerId === newBowlerId);
      let newBowlingScorecard = curInn.bowlingScorecard;
      if (!exists) {
        newBowlingScorecard = [
          ...curInn.bowlingScorecard,
          { playerId: newBowlerId, overs: 0, ballsLegal: 0, maidens: 0, runsConceded: 0, wickets: 0, economy: 0, dots: 0, wides: 0, noBalls: 0 }
        ];
      }

      const updatedInn: Innings = { ...curInn, bowlingScorecard: newBowlingScorecard };

      return {
        ...m,
        liveBowlerId: newBowlerId,
        innings1: m.currentInningsNumber === 1 ? updatedInn : m.innings1,
        innings2: m.currentInningsNumber === 2 ? updatedInn : m.innings2,
      };
    }));
  };

  const setNewBatter = (matchId: string, newBatterId: string, isStriker: boolean) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const curInn = m.currentInningsNumber === 1 ? m.innings1 : m.innings2;
      if (!curInn) return m;

      const exists = curInn.battingScorecard.some(b => b.playerId === newBatterId);
      let newBattingScorecard = curInn.battingScorecard;
      if (!exists) {
        newBattingScorecard = [
          ...curInn.battingScorecard,
          {
            playerId: newBatterId,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            strikeRate: 0,
            isOut: false,
            dismissalInfo: 'batting',
            battingPosition: curInn.battingScorecard.length + 1
          }
        ];
      }

      const updatedInn: Innings = { ...curInn, battingScorecard: newBattingScorecard };

      return {
        ...m,
        liveStrikerId: isStriker ? newBatterId : m.liveStrikerId,
        liveNonStrikerId: !isStriker ? newBatterId : m.liveNonStrikerId,
        innings1: m.currentInningsNumber === 1 ? updatedInn : m.innings1,
        innings2: m.currentInningsNumber === 2 ? updatedInn : m.innings2,
      };
    }));
  };

  const endInnings = (matchId: string, newStrikerId: string, newNonStrikerId: string, newBowlerId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId || !m.innings1) return m;

      const target = m.innings1.totalRuns + 1;
      const inn1Completed: Innings = { ...m.innings1, isCompleted: true };

      const newInnings2: Innings = {
        inningsNumber: 2,
        battingTeamId: m.innings1.bowlingTeamId,
        bowlingTeamId: m.innings1.battingTeamId,
        totalRuns: 0,
        totalWickets: 0,
        oversCompletedStr: '0.0',
        legalBallsBowled: 0,
        target,
        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0, total: 0 },
        battingScorecard: [
          { playerId: newStrikerId, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissalInfo: 'batting', battingPosition: 1 },
          { playerId: newNonStrikerId, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false, dismissalInfo: 'batting', battingPosition: 2 }
        ],
        bowlingScorecard: [
          { playerId: newBowlerId, overs: 0, ballsLegal: 0, maidens: 0, runsConceded: 0, wickets: 0, economy: 0, dots: 0, wides: 0, noBalls: 0 }
        ],
        fallOfWickets: [],
        ballsHistory: [],
        isCompleted: false
      };

      return {
        ...m,
        status: 'live',
        currentInningsNumber: 2,
        liveStrikerId: newStrikerId,
        liveNonStrikerId: newNonStrikerId,
        liveBowlerId: newBowlerId,
        isFreeHitActive: false,
        innings1: inn1Completed,
        innings2: newInnings2
      };
    }));
  };

  const finishMatch = (matchId: string, winnerTeamId?: string, margin?: string, potmId?: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      return {
        ...m,
        status: 'completed',
        winnerTeamId: winnerTeamId || m.winnerTeamId,
        winMargin: margin || m.winMargin,
        playerOfTheMatchId: potmId || m.playerOfTheMatchId
      };
    }));
  };

  const autoGenerateRoundRobinFixtures = () => {
    const venues = [
      'Apex Oval Complex', 
      'Eden Gardens Park', 
      'Royal Park Stadium', 
      'Wankhede Arena', 
      'Chepauk Fortress', 
      'Metro Stadium'
    ];

    const newGeneratedMatches: Match[] = [];
    let matchCounter = matches.length + 1;

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        // Check if fixture already exists
        const exists = matches.some(m => 
          (m.teamAId === teams[i].id && m.teamBId === teams[j].id) ||
          (m.teamAId === teams[j].id && m.teamBId === teams[i].id)
        );

        if (!exists) {
          const venue = venues[matchCounter % venues.length];
          const matchDate = new Date(Date.now() + matchCounter * 86400000 * 2).toISOString().split('T')[0];
          newGeneratedMatches.push({
            id: `m-gen-${matchCounter}`,
            matchNumber: matchCounter,
            title: `Match ${matchCounter} • League Stage`,
            stage: 'Group Stage',
            teamAId: teams[i].id,
            teamBId: teams[j].id,
            date: matchDate,
            time: '19:30',
            venue,
            status: 'scheduled',
            currentInningsNumber: 1
          });
          matchCounter++;
        }
      }
    }

    if (newGeneratedMatches.length > 0) {
      setMatches(prev => [...prev, ...newGeneratedMatches]);
    }
  };

  const resetToDemoData = () => {
    setTournament(INITIAL_TOURNAMENT);
    setTeams(INITIAL_TEAMS);
    setMatches(INITIAL_MATCHES);
    setActiveMatchId('m-103');
    setViewMode('spectator');
    localStorage.removeItem(STORAGE_KEYS.TOURNAMENT);
    localStorage.removeItem(STORAGE_KEYS.TEAMS);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
  };

  const exportTournamentJson = (): string => {
    const data = {
      tournament,
      teams,
      matches,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importTournamentJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.tournament && Array.isArray(data.teams) && Array.isArray(data.matches)) {
        setTournament(data.tournament);
        setTeams(data.teams);
        setMatches(data.matches);
        if (data.matches.length > 0) {
          setActiveMatchId(data.matches[0].id);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        teams,
        matches,
        activeMatchId,
        viewMode,
        activeTab,
        setActiveMatchId,
        setViewMode,
        setActiveTab,
        updateTournament,
        addAnnouncement,
        deleteAnnouncement,
        addTeam,
        updateTeam,
        deleteTeam,
        addPlayer,
        updatePlayer,
        deletePlayer,
        scheduleMatch,
        updateMatch,
        deleteMatch,
        startMatchToss,
        scoreBall,
        undoLastBall,
        changeBowler,
        setNewBatter,
        endInnings,
        finishMatch,
        autoGenerateRoundRobinFixtures,
        resetToDemoData,
        exportTournamentJson,
        importTournamentJson,
        currentUser,
        hallOfFame,
        addHallOfFameEntry,
        addMediaToHallOfFame,
        canEditTeam,
        isAdmin,
        loginAsAdmin,
        loginAsTeam,
        setTeamPasscode,
        logout,
        isAuthModalOpen,
        authModalTeamId,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
