import React, { useState } from 'react';
import { 
  Radio, 
  RotateCcw, 
  Award, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Flame, 
  Users, 
  Plus, 
  ChevronRight, 
  FileText,
  Volume2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { ExtraType, WicketType, Player } from '../../types/cricket';
import { 
  calculateRunRate, 
  calculateRequiredRunRate, 
  calculateWinProbability 
} from '../../utils/cricketEngine';
import { DetailedScorecard } from '../scorecard/DetailedScorecard';

export const LiveScoringConsole: React.FC = () => {
  const { 
    matches, 
    teams, 
    activeMatchId, 
    setActiveMatchId, 
    viewMode, 
    tournament,
    scoreBall,
    undoLastBall,
    changeBowler,
    setNewBatter,
    startMatchToss,
    endInnings,
    finishMatch
  } = useTournament();

  const match = matches.find(m => m.id === activeMatchId) || matches[0];

  // Modal States
  const [showTossModal, setShowTossModal] = useState(false);
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showBatterModal, setShowBatterModal] = useState(false);
  const [showEndInningsModal, setShowEndInningsModal] = useState(false);
  const [showFinishMatchModal, setShowFinishMatchModal] = useState(false);
  const [showScorecardModal, setShowScorecardModal] = useState(false);

  // Toss State
  const [tossWinnerId, setTossWinnerId] = useState(match?.teamAId || '');
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bat');
  const [initStrikerId, setInitStrikerId] = useState('');
  const [initNonStrikerId, setInitNonStrikerId] = useState('');
  const [initBowlerId, setInitBowlerId] = useState('');

  // Wicket Modal State
  const [wicketType, setWicketType] = useState<WicketType>('caught');
  const [outPlayerId, setOutPlayerId] = useState('');
  const [fielderId, setFielderId] = useState('');
  const [newIncomingBatterId, setNewIncomingBatterId] = useState('');

  // Batter Modal State
  const [isReplacingStriker, setIsReplacingStriker] = useState(true);
  const [selectedNewBatterId, setSelectedNewBatterId] = useState('');

  // Next Bowler State
  const [selectedNextBowlerId, setSelectedNextBowlerId] = useState('');

  // Innings 2 Start State
  const [inn2StrikerId, setInn2StrikerId] = useState('');
  const [inn2NonStrikerId, setInn2NonStrikerId] = useState('');
  const [inn2BowlerId, setInn2BowlerId] = useState('');

  // POTM State
  const [potmId, setPotmId] = useState('');

  if (!match) {
    return (
      <div className="p-12 text-center text-slate-400">
        No matches scheduled yet.
      </div>
    );
  }

  const teamA = teams.find(t => t.id === match.teamAId);
  const teamB = teams.find(t => t.id === match.teamBId);
  const allPlayers = teams.flatMap(t => t.players);

  const curInnNum = match.currentInningsNumber;
  const currentInnings = curInnNum === 1 ? match.innings1 : match.innings2;

  const battingTeam = currentInnings ? teams.find(t => t.id === currentInnings.battingTeamId) : teamA;
  const bowlingTeam = currentInnings ? teams.find(t => t.id === currentInnings.bowlingTeamId) : teamB;

  const striker = allPlayers.find(p => p.id === match.liveStrikerId);
  const nonStriker = allPlayers.find(p => p.id === match.liveNonStrikerId);
  const currentBowler = allPlayers.find(p => p.id === match.liveBowlerId);

  const strikerStats = currentInnings?.battingScorecard.find(b => b.playerId === striker?.id);
  const nonStrikerStats = currentInnings?.battingScorecard.find(b => b.playerId === nonStriker?.id);
  const bowlerStats = currentInnings?.bowlingScorecard.find(b => b.playerId === currentBowler?.id);

  const crr = currentInnings ? calculateRunRate(currentInnings.totalRuns, currentInnings.legalBallsBowled) : 0;
  const rrr = (curInnNum === 2 && currentInnings?.target) 
    ? calculateRequiredRunRate(currentInnings.target, currentInnings.totalRuns, tournament.rules.oversPerInnings, currentInnings.legalBallsBowled) 
    : 0;

  const winProb = calculateWinProbability(match, tournament.rules.oversPerInnings);

  // Available batsmen from batting team who haven't batted or are not out
  const battingSquad = battingTeam?.players || [];
  const bowlingSquad = bowlingTeam?.players || [];

  const availableIncomingBatters = battingSquad.filter(p => {
    const isAlreadyBattedAndOut = currentInnings?.battingScorecard.some(b => b.playerId === p.id && b.isOut);
    const isCurrentlyOnCrease = p.id === match.liveStrikerId || p.id === match.liveNonStrikerId;
    return !isAlreadyBattedAndOut && !isCurrentlyOnCrease;
  });

  // Handle Keypad Runs Scoring
  const handleScoreRuns = (runs: number) => {
    scoreBall(match.id, {
      runs,
      extraType: 'none',
      extraRuns: 0,
      isWicket: false
    });
  };

  const handleScoreExtra = (extraType: ExtraType, runs: number = 1) => {
    scoreBall(match.id, {
      runs: (extraType === 'wide' || extraType === 'bye' || extraType === 'leg_bye') ? 0 : runs,
      extraType,
      extraRuns: runs,
      isWicket: false
    });
  };

  const handleConfirmWicket = (e: React.FormEvent) => {
    e.preventDefault();
    const dismissedId = outPlayerId || match.liveStrikerId;

    scoreBall(match.id, {
      runs: 0,
      extraType: 'none',
      extraRuns: 0,
      isWicket: true,
      wicketType,
      dismissedPlayerId: dismissedId,
      fielderId: fielderId || undefined
    });

    if (newIncomingBatterId) {
      const isStrikerOut = dismissedId === match.liveStrikerId;
      setNewBatter(match.id, newIncomingBatterId, isStrikerOut);
    }

    setShowWicketModal(false);
    setWicketType('caught');
    setFielderId('');
    setNewIncomingBatterId('');
  };

  const handleStartToss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initStrikerId || !initNonStrikerId || !initBowlerId) {
      alert('Please select Opening Striker, Non-Striker, and Opening Bowler.');
      return;
    }
    if (initStrikerId === initNonStrikerId) {
      alert('Opening striker and non-striker must be different players.');
      return;
    }

    startMatchToss(
      match.id,
      tossWinnerId,
      tossDecision,
      initStrikerId,
      initNonStrikerId,
      initBowlerId
    );
    setShowTossModal(false);
  };

  const handleStart2ndInnings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inn2StrikerId || !inn2NonStrikerId || !inn2BowlerId) {
      alert('Please choose opening pair and bowler for 2nd innings.');
      return;
    }
    endInnings(match.id, inn2StrikerId, inn2NonStrikerId, inn2BowlerId);
    setShowEndInningsModal(false);
  };

  const handleFinishMatch = (e: React.FormEvent) => {
    e.preventDefault();
    finishMatch(match.id, undefined, undefined, potmId || undefined);
    setShowFinishMatchModal(false);
  };

  // Recent Balls display (last 12 balls)
  const recentBalls = currentInnings?.ballsHistory.slice(0, 12).reverse() || [];

  return (
    <div className="space-y-6">
      {/* Match Selector Strip with Unified Sporty Styling */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {matches.map(m => {
          const tA = teams.find(t => t.id === m.teamAId);
          const tB = teams.find(t => t.id === m.teamBId);
          const isCurrent = m.id === match.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMatchId(m.id)}
              className={'h-10 px-4 rounded-xl text-xs font-black shrink-0 flex items-center gap-2 border-2 transition-all ' + (
                isCurrent 
                  ? 'bg-[#CCFF00] text-slate-950 border-slate-950 shadow-[3px_3px_0px_#0f172a]' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-900 shadow-[1px_1px_0px_#0f172a]'
              )}
            >
              <span className="font-cabinet font-bold">{tA?.code} vs {tB?.code}</span>
              {m.status === 'live' && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* MATCH STATUS BANNER */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden space-y-6">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {match.stage}
              </span>
              <span className="text-xs text-slate-400">{match.venue} • {match.date}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {teamA?.name} vs {teamB?.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {match.status === 'scheduled' && viewMode === 'organizer' && (
              <button
                onClick={() => {
                  setTossWinnerId(match.teamAId);
                  setShowTossModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 animate-bounce-short"
              >
                🪙 Conduct Coin Toss & Start Match
              </button>
            )}

            {currentInnings && (
              <button
                onClick={() => setShowScorecardModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              >
                <FileText className="w-3.5 h-3.5" />
                Full Scorecard
              </button>
            )}
          </div>
        </div>

        {/* Live Score Display */}
        {currentInnings ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Main Runs & Overs */}
            <div className="space-y-2 lg:col-span-2">
              <div className="flex flex-wrap items-baseline gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">{battingTeam?.logo}</span>
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 block">
                      Batting: {battingTeam?.name}
                    </span>
                    <span className="text-4xl sm:text-6xl font-black text-white font-mono tracking-tight">
                      {currentInnings.totalRuns}/{currentInnings.totalWickets}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400 font-mono text-xl sm:text-2xl font-bold">
                  ({currentInnings.oversCompletedStr} / {tournament.rules.oversPerInnings} Ov)
                </div>

                {match.isFreeHitActive && (
                  <div className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-lg shadow-amber-500/30">
                    <Flame className="w-3.5 h-3.5" /> FREE HIT
                  </div>
                )}
              </div>

              {/* Rates strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-300">
                <span className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                  CRR: <strong className="text-amber-400 text-sm">{crr}</strong>
                </span>

                {curInnNum === 2 && currentInnings.target && (
                  <>
                    <span className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                      Target: <strong className="text-white text-sm">{currentInnings.target}</strong>
                    </span>
                    <span className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                      RRR: <strong className="text-emerald-400 text-sm">{rrr}</strong>
                    </span>
                    <span className="text-slate-400 font-sans">
                      Need <strong>{Math.max(0, currentInnings.target - currentInnings.totalRuns)}</strong> runs from <strong>{(tournament.rules.oversPerInnings * 6) - currentInnings.legalBallsBowled}</strong> balls
                    </span>
                  </>
                )}
              </div>

              {/* Win Probability Gauge */}
              <div className="space-y-1.5 pt-2 max-w-lg">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-sky-400">{battingTeam?.name}: {winProb.teamAPercent}%</span>
                  <span className="text-slate-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-amber-400" /> Win Probability
                  </span>
                  <span className="text-emerald-400">{bowlingTeam?.name}: {winProb.teamBPercent}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700/80">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500" 
                    style={{ width: `${winProb.teamAPercent}%` }} 
                  />
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500" 
                    style={{ width: `${winProb.teamBPercent}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Projected Score Matrix */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>Projected Score</span>
                <span className="text-slate-400 font-normal">Remaining: {(tournament.rules.oversPerInnings * 6) - currentInnings.legalBallsBowled}b</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">At Current RR ({crr})</span>
                  <span className="text-base font-bold text-white">
                    {Math.round(currentInnings.totalRuns + crr * ((tournament.rules.oversPerInnings * 6 - currentInnings.legalBallsBowled) / 6))}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">At 8.0 RPO</span>
                  <span className="text-base font-bold text-amber-400">
                    {Math.round(currentInnings.totalRuns + 8.0 * ((tournament.rules.oversPerInnings * 6 - currentInnings.legalBallsBowled) / 6))}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">At 10.0 RPO</span>
                  <span className="text-base font-bold text-emerald-400">
                    {Math.round(currentInnings.totalRuns + 10.0 * ((tournament.rules.oversPerInnings * 6 - currentInnings.legalBallsBowled) / 6))}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">At 12.0 RPO</span>
                  <span className="text-base font-bold text-rose-400">
                    {Math.round(currentInnings.totalRuns + 12.0 * ((tournament.rules.oversPerInnings * 6 - currentInnings.legalBallsBowled) / 6))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-3">
            <Radio className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
            <div className="text-lg font-bold text-white">Match Scheduled</div>
            <p className="text-xs max-w-md mx-auto">
              Toss not conducted yet. Use the Organizer mode button above to conduct toss and initialize the live ball scoring engine.
            </p>
          </div>
        )}

        {/* Recent Deliveries Carousel */}
        {currentInnings && recentBalls.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Recent:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {recentBalls.map((b) => {
                let badgeClass = 'ball-run-0';
                let label = b.runsBat.toString();
                if (b.isWicket) {
                  badgeClass = 'ball-wicket';
                  label = 'W';
                } else if (b.isSix) {
                  badgeClass = 'ball-run-6';
                  label = '6';
                } else if (b.isFour) {
                  badgeClass = 'ball-run-4';
                  label = '4';
                } else if (b.extraType === 'wide') {
                  badgeClass = 'ball-extra';
                  label = `${b.extraRuns}w`;
                } else if (b.extraType === 'no_ball') {
                  badgeClass = 'ball-extra';
                  label = `${b.runsBat + b.extraRuns}nb`;
                } else if (b.runsBat > 0) {
                  badgeClass = 'ball-run-1';
                }

                return (
                  <span 
                    key={b.id} 
                    className={`ball-dot ${badgeClass} shrink-0`} 
                    title={b.commentary}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ON-CREASE BATSMEN & CURRENT BOWLER */}
      {currentInnings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Batsmen on Crease */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Batters on Crease
              </h3>
              {viewMode === 'organizer' && (
                <button
                  onClick={() => {
                    setIsReplacingStriker(true);
                    setShowBatterModal(true);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Change / Set Batter
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {/* Striker */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="On Strike"></span>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-1">
                      <span>{striker?.name || 'Striker (TBD)'}</span>
                      <span className="text-amber-400 font-black">*</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{striker?.role.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-base font-black text-white">
                    {strikerStats?.runs || 0} <span className="text-xs text-slate-400 font-normal font-sans">({strikerStats?.balls || 0}b)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    4s: {strikerStats?.fours || 0} • 6s: {strikerStats?.sixes || 0} • SR: {strikerStats?.strikeRate.toFixed(1) || 0}
                  </div>
                </div>
              </div>

              {/* Non-Striker */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  <div>
                    <div className="font-bold text-white text-sm">
                      {nonStriker?.name || 'Non-Striker (TBD)'}
                    </div>
                    <span className="text-[11px] text-slate-400">{nonStriker?.role.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-base font-black text-white">
                    {nonStrikerStats?.runs || 0} <span className="text-xs text-slate-400 font-normal font-sans">({nonStrikerStats?.balls || 0}b)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    4s: {nonStrikerStats?.fours || 0} • 6s: {nonStrikerStats?.sixes || 0} • SR: {nonStrikerStats?.strikeRate.toFixed(1) || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Bowler */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Current Bowler
              </h3>
              {viewMode === 'organizer' && (
                <button
                  onClick={() => setShowBowlerModal(true)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Change Bowler
                </button>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white text-base">
                  {currentBowler?.name || 'Bowler (TBD)'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {currentBowler?.bowlingStyle}
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-base font-black text-emerald-400">
                  {bowlerStats?.wickets || 0}/{bowlerStats?.runsConceded || 0}
                  <span className="text-xs text-slate-400 font-normal font-sans ml-1.5">
                    ({bowlerStats?.overs || 0} ov)
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Econ: {bowlerStats?.economy.toFixed(2) || 0} • Dots: {bowlerStats?.dots || 0} • Wides: {bowlerStats?.wides || 0}
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Max Over Quota: <strong>{tournament.rules.maxOversPerBowler} overs max</strong></span>
              <span className="text-amber-400 font-bold">
                {tournament.rules.maxOversPerBowler - (bowlerStats ? Math.floor(bowlerStats.ballsLegal / 6) : 0)} overs left
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SCORER KEYPAD (Organizer Mode Only) */}
      {viewMode === 'organizer' && match.status === 'live' && currentInnings && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Live Scoring Keypad
            </h3>

            {/* Undo button */}
            <button
              onClick={() => undoLastBall(match.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Revert previous delivery and restore scores"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo Last Ball
            </button>
          </div>

          {/* Primary Scoring Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <button
              onClick={() => handleScoreRuns(0)}
              className="py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xl border border-slate-700 shadow active:scale-95 transition-all"
            >
              0 <span className="block text-[10px] font-medium text-slate-400 uppercase">Dot Ball</span>
            </button>

            <button
              onClick={() => handleScoreRuns(1)}
              className="py-4 rounded-2xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 font-black text-xl border border-blue-800 shadow active:scale-95 transition-all"
            >
              1 <span className="block text-[10px] font-medium text-blue-300 uppercase">Single</span>
            </button>

            <button
              onClick={() => handleScoreRuns(2)}
              className="py-4 rounded-2xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 font-black text-xl border border-blue-800 shadow active:scale-95 transition-all"
            >
              2 <span className="block text-[10px] font-medium text-blue-300 uppercase">Two</span>
            </button>

            <button
              onClick={() => handleScoreRuns(3)}
              className="py-4 rounded-2xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 font-black text-xl border border-blue-800 shadow active:scale-95 transition-all"
            >
              3 <span className="block text-[10px] font-medium text-blue-300 uppercase">Three</span>
            </button>

            <button
              onClick={() => handleScoreRuns(4)}
              className="py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xl border border-emerald-500 shadow-glow-emerald active:scale-95 transition-all"
            >
              4 <span className="block text-[10px] font-medium text-emerald-200 uppercase">Four!</span>
            </button>

            <button
              onClick={() => handleScoreRuns(6)}
              className="py-4 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xl border border-purple-500 shadow-lg shadow-purple-900/50 active:scale-95 transition-all"
            >
              6 <span className="block text-[10px] font-medium text-purple-200 uppercase">Sixer!</span>
            </button>
          </div>

          {/* Extras & Wicket Keypad row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <button
              onClick={() => handleScoreExtra('wide', 1)}
              className="py-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-bold text-xs border border-amber-800 active:scale-95 transition-all"
            >
              Wide (+1wd)
            </button>

            <button
              onClick={() => handleScoreExtra('no_ball', 1)}
              className="py-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-bold text-xs border border-amber-800 active:scale-95 transition-all"
            >
              No Ball (+1nb FreeHit)
            </button>

            <button
              onClick={() => handleScoreExtra('bye', 1)}
              className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 active:scale-95 transition-all"
            >
              1 Bye (1b)
            </button>

            <button
              onClick={() => handleScoreExtra('leg_bye', 1)}
              className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 active:scale-95 transition-all"
            >
              1 Leg Bye (1lb)
            </button>

            <button
              onClick={() => {
                setOutPlayerId(match.liveStrikerId || '');
                setShowWicketModal(true);
              }}
              className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs border border-rose-400 shadow-lg shadow-rose-900/50 active:scale-95 transition-all col-span-2 sm:col-span-1"
            >
              💥 OUT / WICKET
            </button>
          </div>

          {/* Innings Control row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              {curInnNum === 1 && (
                <button
                  onClick={() => setShowEndInningsModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold"
                >
                  End 1st Innings & Set Target
                </button>
              )}
              <button
                onClick={() => setShowFinishMatchModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Declare Match Finished
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              💡 Strike rotates automatically on odd runs and after 6 legal deliveries.
            </div>
          </div>
        </div>
      )}

      {/* LIVE BALL-BY-BALL COMMENTARY */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-amber-400" />
          Ball-by-Ball Live Commentary Feed
        </h3>

        {currentInnings && currentInnings.ballsHistory.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {currentInnings.ballsHistory.map((ball) => (
              <div 
                key={ball.id} 
                className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                  ball.isWicket 
                    ? 'bg-rose-950/40 border-rose-800 text-rose-200' 
                    : ball.isSix 
                      ? 'bg-purple-950/40 border-purple-800 text-purple-200' 
                      : ball.isFour 
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black font-mono text-amber-400">
                    Over {ball.ballNumberStr}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(ball.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p>{ball.commentary}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            No commentary generated yet. Deliveries will appear here as balls are scored.
          </div>
        )}
      </div>

      {/* TOSS MODAL */}
      {showTossModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🪙 Match Coin Toss & Starting Lineup
            </h3>

            <form onSubmit={handleStartToss} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Toss Winner</label>
                  <select
                    value={tossWinnerId}
                    onChange={e => setTossWinnerId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={match.teamAId}>{teamA?.name}</option>
                    <option value={match.teamBId}>{teamB?.name}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Elected To</label>
                  <select
                    value={tossDecision}
                    onChange={e => setTossDecision(e.target.value as 'bat' | 'bowl')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="bat">Bat First</option>
                    <option value="bowl">Bowl First</option>
                  </select>
                </div>
              </div>

              {/* Batting team players */}
              {(() => {
                const batTeamId = (tossDecision === 'bat') ? tossWinnerId : (match.teamAId === tossWinnerId ? match.teamBId : match.teamAId);
                const bowlTeamId = batTeamId === match.teamAId ? match.teamBId : match.teamAId;
                const bTeam = teams.find(t => t.id === batTeamId);
                const blTeam = teams.find(t => t.id === bowlTeamId);

                return (
                  <>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-bold text-amber-400">
                      Batting First: {bTeam?.name} • Bowling First: {blTeam?.name}
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Opening Striker (*)</label>
                      <select
                        required
                        value={initStrikerId}
                        onChange={e => setInitStrikerId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="">-- Choose Striker --</option>
                        {bTeam?.players.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.role.replace('_', ' ')})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Opening Non-Striker</label>
                      <select
                        required
                        value={initNonStrikerId}
                        onChange={e => setInitNonStrikerId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="">-- Choose Non-Striker --</option>
                        {bTeam?.players.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.role.replace('_', ' ')})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Opening Bowler</label>
                      <select
                        required
                        value={initBowlerId}
                        onChange={e => setInitBowlerId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="">-- Choose Bowler --</option>
                        {blTeam?.players.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.bowlingStyle})</option>
                        ))}
                      </select>
                    </div>
                  </>
                );
              })()}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTossModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
                >
                  Confirm & Begin Live Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WICKET MODAL */}
      {showWicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
              💥 Record Dismissal / Wicket
            </h3>

            <form onSubmit={handleConfirmWicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Dismissal Type</label>
                <select
                  value={wicketType}
                  onChange={e => setWicketType(e.target.value as WicketType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="caught">Caught</option>
                  <option value="bowled">Bowled</option>
                  <option value="lbw">LBW</option>
                  <option value="run_out">Run Out</option>
                  <option value="stumped">Stumped</option>
                  <option value="hit_wicket">Hit Wicket</option>
                  <option value="retired_hurt">Retired Hurt</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Batter Dismissed</label>
                <select
                  value={outPlayerId}
                  onChange={e => setOutPlayerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  {striker && <option value={striker.id}>{striker.name} (Striker)</option>}
                  {nonStriker && <option value={nonStriker.id}>{nonStriker.name} (Non-Striker)</option>}
                </select>
              </div>

              {(wicketType === 'caught' || wicketType === 'run_out' || wicketType === 'stumped') && (
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Fielder / Assistant</label>
                  <select
                    value={fielderId}
                    onChange={e => setFielderId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Select Fielder --</option>
                    {bowlingSquad.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-medium mb-1">Next Incoming Batter</label>
                <select
                  value={newIncomingBatterId}
                  onChange={e => setNewIncomingBatterId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Next Batsman --</option>
                  {availableIncomingBatters.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.role.replace('_', ' ')})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWicketModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg"
                >
                  Record Wicket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE BOWLER MODAL */}
      {showBowlerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🎯 Rotate Bowler
            </h3>

            <div className="space-y-3 text-xs">
              <label className="block text-slate-400 font-medium">Select Bowler for Next Over</label>
              <select
                value={selectedNextBowlerId}
                onChange={e => setSelectedNextBowlerId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Choose Bowler --</option>
                {bowlingSquad
                  .filter(p => p.id !== match.liveBowlerId)
                  .map(p => {
                    const stats = currentInnings?.bowlingScorecard.find(b => b.playerId === p.id);
                    const ov = stats ? stats.overs : 0;
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.bowlingStyle}) — {ov} ov bowled
                      </option>
                    );
                  })}
              </select>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBowlerModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedNextBowlerId) {
                      changeBowler(match.id, selectedNextBowlerId);
                      setShowBowlerModal(false);
                      setSelectedNextBowlerId('');
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Set Bowler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE BATTER MODAL */}
      {showBatterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🏏 Set / Replace Batter
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="batterSlot"
                    checked={isReplacingStriker}
                    onChange={() => setIsReplacingStriker(true)}
                    className="text-amber-500"
                  />
                  <span>Replace Striker (*)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="radio"
                    name="batterSlot"
                    checked={!isReplacingStriker}
                    onChange={() => setIsReplacingStriker(false)}
                    className="text-amber-500"
                  />
                  <span>Replace Non-Striker</span>
                </label>
              </div>

              <select
                value={selectedNewBatterId}
                onChange={e => setSelectedNewBatterId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Choose Batter --</option>
                {availableIncomingBatters.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.role.replace('_', ' ')})</option>
                ))}
              </select>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBatterModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedNewBatterId) {
                      setNewBatter(match.id, selectedNewBatterId, isReplacingStriker);
                      setShowBatterModal(false);
                      setSelectedNewBatterId('');
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Confirm Batter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* END 1ST INNINGS MODAL */}
      {showEndInningsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🏁 End 1st Innings & Start Run Chase
            </h3>

            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-300">
              1st Innings Total: <strong>{match.innings1?.totalRuns}/{match.innings1?.totalWickets}</strong> ({match.innings1?.oversCompletedStr} ov).<br />
              Target for <strong>{bowlingTeam?.name}</strong>: <strong>{(match.innings1?.totalRuns || 0) + 1} Runs</strong>
            </div>

            <form onSubmit={handleStart2ndInnings} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Opening Striker (*)</label>
                <select
                  required
                  value={inn2StrikerId}
                  onChange={e => setInn2StrikerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Striker --</option>
                  {bowlingSquad.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Opening Non-Striker</label>
                <select
                  required
                  value={inn2NonStrikerId}
                  onChange={e => setInn2NonStrikerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Non-Striker --</option>
                  {bowlingSquad.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Opening Bowler</label>
                <select
                  required
                  value={inn2BowlerId}
                  onChange={e => setInn2BowlerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Bowler --</option>
                  {battingSquad.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEndInningsModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
                >
                  Start 2nd Innings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FINISH MATCH MODAL */}
      {showFinishMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🏆 Conclude Match & Assign Player of Match
            </h3>

            <form onSubmit={handleFinishMatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Player of the Match (POTM)</label>
                <select
                  value={potmId}
                  onChange={e => setPotmId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Select Player --</option>
                  {allPlayers
                    .filter(p => p.teamId === match.teamAId || p.teamId === match.teamBId)
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.teamId === match.teamAId ? teamA?.code : teamB?.code})</option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFinishMatchModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm & Finalize Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL SCORECARD MODAL */}
      {showScorecardModal && (
        <DetailedScorecard
          match={match}
          onClose={() => setShowScorecardModal(false)}
        />
      )}
    </div>
  );
};
