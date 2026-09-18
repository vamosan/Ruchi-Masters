export type MatchFormat = 'T20' | 'T10' | 'ODI_50' | 'HUNDRED' | 'BOX_CRICKET';

export type PlayerRole = 
  | 'pure_batter' 
  | 'wk_batter' 
  | 'pace_allrounder' 
  | 'spin_allrounder' 
  | 'fast_bowler' 
  | 'spin_bowler';

export type BattingStyle = 'Right-hand Bat' | 'Left-hand Bat';
export type BowlingStyle = 
  | 'Right-arm fast' 
  | 'Right-arm fast-medium' 
  | 'Right-arm medium'
  | 'Left-arm fast' 
  | 'Left-arm fast-medium' 
  | 'Left-arm medium'
  | 'Right-arm off-break' 
  | 'Right-arm leg-break' 
  | 'Left-arm orthodox' 
  | 'Left-arm unorthodox' 
  | 'None';

export interface Player {
  id: string;
  teamId: string;
  name: string;
  jerseyNumber: number;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  isWicketKeeper?: boolean;
  avatar?: string;
  photoUrl?: string;            // Real uploaded authenticated photo
  idProofNumber?: string;       // Official tournament ID / Passport / Player License
  isAuthenticated?: boolean;    // Real player verified by team manager
  authenticatedAt?: string;     // Verification timestamp
  authenticatedBy?: string;     // Manager who verified
  matchesPlayed: number;
  runsScored: number;
  wicketsTaken: number;
  highestScore: number;
  bestBowling?: string;
  fifties?: number;
  hundreds?: number;
  strikeRate?: number;
  economy?: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  captainId?: string;
  viceCaptainId?: string;
  coach?: string;
  managerName?: string;
  managerContact?: string;
  managerEmail?: string;
  managerPhone?: string;
  homeGround: string;
  group?: 'Group A' | 'Group B' | string;
  slogan?: string;
  description?: string;
  bannerUrl?: string;
  teamPhotoUrl?: string;
  establishedYear?: number;
  address?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  supportStaff?: { role: string; name: string }[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
    facebook?: string;
  };
  passcode?: string;
  isPinSet?: boolean;
  players: Player[];
}

export type ExtraType = 'none' | 'wide' | 'no_ball' | 'bye' | 'leg_bye' | 'penalty';

export type WicketType = 
  | 'bowled' 
  | 'caught' 
  | 'lbw' 
  | 'run_out' 
  | 'stumped' 
  | 'hit_wicket' 
  | 'retired_hurt' 
  | 'retired_out' 
  | 'hit_ball_twice' 
  | 'obstructing_field';

export interface BallRecord {
  id: string;
  ballNumberStr: string;
  overIndex: number;
  ballInOver: number;
  bowlerId: string;
  strikerId: string;
  nonStrikerId: string;
  runsBat: number;
  extraType: ExtraType;
  extraRuns: number;
  isWicket: boolean;
  wicketType?: WicketType;
  dismissedPlayerId?: string;
  fielderId?: string;
  commentary: string;
  isFour: boolean;
  isSix: boolean;
  isLegalBall: boolean;
  isFreeHit: boolean;
  timestamp: number;
}

export interface BattingStats {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalInfo?: string;
  battingPosition: number;
}

export interface BowlingStats {
  playerId: string;
  overs: number;
  ballsLegal: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  dots: number;
  wides: number;
  noBalls: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  teamScore: number;
  oversStr: string;
  playerId: string;
  playerName: string;
}

export interface ExtrasSummary {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  penalty: number;
  total: number;
}

export interface Innings {
  inningsNumber: 1 | 2;
  battingTeamId: string;
  bowlingTeamId: string;
  totalRuns: number;
  totalWickets: number;
  oversCompletedStr: string;
  legalBallsBowled: number;
  extras: ExtrasSummary;
  battingScorecard: BattingStats[];
  bowlingScorecard: BowlingStats[];
  fallOfWickets: FallOfWicket[];
  ballsHistory: BallRecord[];
  isCompleted: boolean;
  target?: number;
}

export type MatchStatus = 'scheduled' | 'toss' | 'live' | 'innings_break' | 'completed' | 'abandoned';

export type MatchStage = 
  | 'Group Stage' 
  | 'Super 8' 
  | 'Quarter Final' 
  | 'Semi Final 1' 
  | 'Semi Final 2' 
  | '3rd Place Playoff' 
  | 'Grand Final';

export interface Match {
  id: string;
  matchNumber: number;
  title: string;
  stage: MatchStage;
  group?: string;
  teamAId: string;
  teamBId: string;
  date: string;
  time: string;
  venue: string;
  pitchCondition?: string;
  weather?: string;
  status: MatchStatus;
  statusNote?: string;
  tossWinnerId?: string;
  tossDecision?: 'bat' | 'bowl';
  currentInningsNumber: 1 | 2;
  innings1?: Innings;
  innings2?: Innings;
  winnerTeamId?: string;
  winMargin?: string;
  playerOfTheMatchId?: string;
  liveStrikerId?: string;
  liveNonStrikerId?: string;
  liveBowlerId?: string;
  isFreeHitActive?: boolean;
  playingXI_TeamA?: string[];
  playingXI_TeamB?: string[];
  notes?: string;
}

export interface TournamentRules {
  oversPerInnings: number;
  maxOversPerBowler: number;
  powerplayOvers: number;
  pointsForWin: number;
  pointsForTie: number;
  pointsForNR: number;
  pointsForLoss: number;
  superOverForTies: boolean;
  freeHitOnNoBall: boolean;
  dlsMethodEnabled: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'Title' | 'Platinum' | 'Gold' | 'Powered By' | 'Beverage';
  link?: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Schedule' | 'Rule' | 'Venue' | 'Important' | 'Ceremony';
  content: string;
  author: string;
  pinned?: boolean;
  imageUrl?: string;
}

export interface NewsStory {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  category: string;
  author: string;
  hasVideo?: boolean;
}

export interface PredictionPoll {
  id: string;
  question: string;
  totalVotes: number;
  options: {
    teamId: string;
    teamName: string;
    flag: string;
    votes: number;
    percentage: number;
  }[];
}

export interface Tournament {
  id: string;
  name: string;
  tagline: string;
  edition: string;
  season: string;
  format: MatchFormat;
  status: 'registration' | 'group_stage' | 'playoffs' | 'completed';
  startDate: string;
  endDate: string;
  location: string;
  bannerImage: string;
  trophyImage: string;
  description: string;
  organizerName: string;
  organizerContact: string;
  organizerEmail: string;
  rules: TournamentRules;
  sponsors: Sponsor[];
  announcements: Announcement[];
}

export interface PointsTableEntry {
  teamId: string;
  teamName: string;
  teamCode: string;
  teamLogo: string;
  group?: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  nrr: number;
  runsScored: number;
  legalOversFaced: number;
  runsConceded: number;
  legalOversBowled: number;
  form: ('W' | 'L' | 'T' | 'NR')[];
  rank: number;
  isQualified?: boolean;
  isEliminated?: boolean;
}

export interface HallOfFameMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  caption?: string;
}

export interface HallOfFameEntry {
  id: string;
  year: number;
  editionName: string;
  championTeamId: string;
  championTeamName: string;
  championLogo: string;
  runnerUpTeamName: string;
  secondRunnerUpTeamName?: string;
  finalScore: string;
  margin: string;
  venue: string;
  captainName: string;
  captainBio?: string;
  cricHeroesMatchUrl?: string;
  cricHeroesMatchId?: string;
  playerOfTheTournament?: string;
  highestRunScorer?: string;
  highestWicketTaker?: string;
  bestWicketKeeper?: string;
  bestFielder?: string;
  trophyPhotoUrl: string;
  celebrationBannerUrl: string;
  story: string;
  media: HallOfFameMedia[];
}
