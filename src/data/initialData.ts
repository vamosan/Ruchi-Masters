import { Tournament, Team, Match, Announcement, Sponsor, NewsStory, PredictionPoll } from '../types/cricket';
import { OFFICIAL_40_TEAMS } from './official40TeamsData';

export const INITIAL_SPONSORS: Sponsor[] = [
  { id: 'sp-1', name: 'Ruchi Global Group', tier: 'Title', logo: '⚡' },
  { id: 'sp-2', name: 'Kookaburra Pro Sports', tier: 'Platinum', logo: '🏏' },
  { id: 'sp-3', name: 'HydraTech Drinks', tier: 'Beverage', logo: '💧' },
  { id: 'sp-4', name: 'Apex FinTrust', tier: 'Powered By', logo: '🏦' },
  { id: 'sp-5', name: 'AeroSky Airways', tier: 'Gold', logo: '✈️' },
];

export const INITIAL_NEWS_STORIES: NewsStory[] = [
  {
    id: 'news-1',
    title: "Ruchi Masters T20 2026: 40 Franchises Ready for Epic Championship",
    summary: 'A record 40 franchise squads have submitted their verified team rosters for the biggest tournament edition yet.',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    date: 'Today',
    category: 'Tournament Exclusive',
    author: 'Tournament Press Desk',
    hasVideo: true
  },
  {
    id: 'news-2',
    title: 'Captains Portal Activated: Secure Squad Management & PIN Access Live',
    summary: 'Team captains across all 40 franchises can now authenticate and manage their verified playing squads with their team PIN.',
    image: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=800&q=80',
    date: 'Today',
    category: 'Roster Verification',
    author: 'Chief Governance Officer',
    hasVideo: true
  },
  {
    id: 'news-3',
    title: 'Smart LED Zing bails and laser direct-hit tracking illuminate the championship',
    summary: 'High-speed 150 km/h deliveries and lightning stumpings highlight precision tech in action at Ruchi Masters T20 2026.',
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
    date: 'Today',
    category: 'Tech & Umpiring',
    author: 'Tech Desk',
    hasVideo: true
  }
];

export const INITIAL_PREDICTION_POLL: PredictionPoll = {
  id: 'poll-ruchi-2026',
  question: 'Predict who will lift the Ruchi Masters T20 2026 Trophy!',
  totalVotes: 98450,
  options: [
    { teamId: 'team-achievers-x1', teamName: 'Acheivers X1', flag: '🏆', votes: 41250, percentage: 42 },
    { teamId: 'team-spvgg-dragons', teamName: 'SpVgg Dragons', flag: '🐉', votes: 30510, percentage: 31 },
    { teamId: 'team-royal-strikers', teamName: 'Royal Strikers', flag: '🦁', votes: 17720, percentage: 18 },
    { teamId: 'team-tgs-royal-challengers', teamName: 'TGS ROYAL CHALLENGERS', flag: '👑', votes: 8970, percentage: 9 }
  ]
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🏆 Ruchi Masters T20 2026 Official Squad Rosters Published',
    date: '2026-09-18',
    category: 'Schedule',
    pinned: true,
    author: 'Tournament Director',
    content: 'Welcome to Ruchi Masters T20 2026! 40 elite franchise teams battle for ultimate supremacy at Apex Oval Complex. All team squads are now published.'
  },
  {
    id: 'ann-2',
    title: '🔐 Team Captain Portal & PIN Guidelines',
    date: '2026-09-18',
    category: 'Rule',
    pinned: true,
    author: 'Technical Committee',
    content: 'Team captains can log in using their franchise PIN  to update player details, add new squad members, and change their PIN.'
  },
  {
    id: 'ann-3',
    title: '🎟️ Grand Finals Day Presentation Gala & Trophy Honors',
    date: '2026-09-18',
    category: 'Ceremony',
    pinned: false,
    author: 'Event Organizing Body',
    content: 'Finals day awards include the Champions Trophy, Orange Cap (Most Runs), Purple Cap (Most Wickets), Maximum Sixes, and Player of the Tournament.'
  }
];

export const INITIAL_TOURNAMENT: Tournament = {
  id: 'ruchi-masters-t20-2026',
  name: 'Ruchi Masters T20',
  tagline: 'The Ultimate Championship of 40 T20 Champions',
  edition: '2026 Edition',
  season: '2026',
  format: 'T20',
  status: 'group_stage',
  startDate: '2026-09-10',
  endDate: '2026-10-15',
  location: 'Apex Oval Complex & Eden Gardens Park',
  bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
  trophyImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
  description: 'The premier professional T20 cricket championship featuring 40 verified franchise squads, real-time ball-by-ball scoring, ICC Net Run Rate standings, and player cap leaderboards.',
  organizerName: 'Ruchi Sports Management Council',
  organizerContact: '+1 (555) 782-4420',
  organizerEmail: 'operations@ruchimasterst20.com',
  rules: {
    oversPerInnings: 20,
    maxOversPerBowler: 4,
    powerplayOvers: 6,
    pointsForWin: 2,
    pointsForTie: 1,
    pointsForNR: 1,
    pointsForLoss: 0,
    superOverForTies: true,
    freeHitOnNoBall: true,
    dlsMethodEnabled: true,
  },
  sponsors: INITIAL_SPONSORS,
  announcements: INITIAL_ANNOUNCEMENTS
};

export const INITIAL_TEAMS: Team[] = OFFICIAL_40_TEAMS;

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm-101',
    matchNumber: 1,
    title: 'Match 1 • Group A • Opening Clash',
    stage: 'Group Stage',
    group: 'Group A',
    teamAId: 'team-achievers-x1',
    teamBId: 'team-spvgg-dragons',
    date: '2026-09-10',
    time: '19:30',
    venue: 'Apex Oval Complex - Pitch 1',
    status: 'completed',
    statusNote: 'Result',
    tossWinnerId: 'team-achievers-x1',
    tossDecision: 'bat',
    currentInningsNumber: 2,
    winnerTeamId: 'team-achievers-x1',
    winMargin: 'Acheivers X1 won by 14 runs',
    playerOfTheMatchId: 'p-team-achievers-x1-1',
    innings1: {
      inningsNumber: 1,
      battingTeamId: 'team-achievers-x1',
      bowlingTeamId: 'team-spvgg-dragons',
      totalRuns: 188,
      totalWickets: 5,
      oversCompletedStr: '20.0',
      legalBallsBowled: 120,
      extras: { wides: 6, noBalls: 1, byes: 0, legByes: 2, penalty: 0, total: 9 },
      battingScorecard: [
        { playerId: 'p-team-achievers-x1-1', runs: 84, balls: 48, fours: 8, sixes: 4, strikeRate: 175.0, isOut: true, dismissalInfo: 'c Vinit b Manoj', battingPosition: 1 },
        { playerId: 'p-team-achievers-x1-2', runs: 42, balls: 28, fours: 4, sixes: 2, strikeRate: 150.0, isOut: true, dismissalInfo: 'c Subbu b Vijay', battingPosition: 2 },
        { playerId: 'p-team-achievers-x1-4', runs: 35, balls: 22, fours: 3, sixes: 1, strikeRate: 159.1, isOut: false, battingPosition: 3 },
      ],
      bowlingScorecard: [
        { playerId: 'p-team-spvgg-dragons-3', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 34, wickets: 2, economy: 8.5, dots: 10, wides: 2, noBalls: 0 },
        { playerId: 'p-team-spvgg-dragons-9', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 38, wickets: 1, economy: 9.5, dots: 8, wides: 1, noBalls: 1 },
        { playerId: 'p-team-spvgg-dragons-6', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 26, wickets: 2, economy: 6.5, dots: 12, wides: 1, noBalls: 0 },
      ],
      fallOfWickets: [
        { wicketNumber: 1, teamScore: 78, oversStr: '8.2', playerId: 'p-team-achievers-x1-2', playerName: 'Alok Ranjan' },
        { wicketNumber: 2, teamScore: 145, oversStr: '15.4', playerId: 'p-team-achievers-x1-1', playerName: 'Sai Prathap Reddy Narla' }
      ],
      ballsHistory: [],
      isCompleted: true,
    },
    innings2: {
      inningsNumber: 2,
      battingTeamId: 'team-spvgg-dragons',
      bowlingTeamId: 'team-achievers-x1',
      totalRuns: 174,
      totalWickets: 8,
      oversCompletedStr: '20.0',
      legalBallsBowled: 120,
      target: 189,
      extras: { wides: 5, noBalls: 0, byes: 1, legByes: 2, penalty: 0, total: 8 },
      battingScorecard: [
        { playerId: 'p-team-spvgg-dragons-1', runs: 62, balls: 41, fours: 6, sixes: 3, strikeRate: 151.2, isOut: true, dismissalInfo: 'c Sarathi b Kailash', battingPosition: 1 },
        { playerId: 'p-team-spvgg-dragons-2', runs: 38, balls: 26, fours: 4, sixes: 1, strikeRate: 146.2, isOut: true, dismissalInfo: 'b Saheb', battingPosition: 2 },
      ],
      bowlingScorecard: [
        { playerId: 'p-team-achievers-x1-5', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 31, wickets: 3, economy: 7.75, dots: 11, wides: 1, noBalls: 0 },
        { playerId: 'p-team-achievers-x1-7', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 29, wickets: 2, economy: 7.25, dots: 12, wides: 1, noBalls: 0 },
      ],
      fallOfWickets: [],
      ballsHistory: [],
      isCompleted: true,
    }
  },
  {
    id: 'm-102',
    matchNumber: 2,
    title: 'Match 2 • Group A • Blockbuster',
    stage: 'Group Stage',
    group: 'Group A',
    teamAId: 'team-tgs-royal-challengers',
    teamBId: 'team-royal-strikers',
    date: '2026-09-11',
    time: '19:30',
    venue: 'Apex Oval Complex - Pitch 2',
    status: 'completed',
    statusNote: 'Result',
    tossWinnerId: 'team-royal-strikers',
    tossDecision: 'bowl',
    currentInningsNumber: 2,
    winnerTeamId: 'team-royal-strikers',
    winMargin: 'Royal Strikers won by 5 wickets',
    playerOfTheMatchId: 'p-team-royal-strikers-1',
    innings1: {
      inningsNumber: 1,
      battingTeamId: 'team-tgs-royal-challengers',
      bowlingTeamId: 'team-royal-strikers',
      totalRuns: 165,
      totalWickets: 7,
      oversCompletedStr: '20.0',
      legalBallsBowled: 120,
      extras: { wides: 4, noBalls: 1, byes: 0, legByes: 2, penalty: 0, total: 7 },
      battingScorecard: [
        { playerId: 'p-team-tgs-royal-challengers-1', runs: 58, balls: 39, fours: 6, sixes: 2, strikeRate: 148.7, isOut: true, dismissalInfo: 'c Dhinesh b Rakesh', battingPosition: 1 },
        { playerId: 'p-team-tgs-royal-challengers-2', runs: 44, balls: 31, fours: 4, sixes: 1, strikeRate: 141.9, isOut: true, dismissalInfo: 'c Nirmal b Samuel', battingPosition: 2 },
      ],
      bowlingScorecard: [
        { playerId: 'p-team-royal-strikers-3', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 28, wickets: 2, economy: 7.0, dots: 11, wides: 1, noBalls: 0 },
        { playerId: 'p-team-royal-strikers-9', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 32, wickets: 3, economy: 8.0, dots: 10, wides: 2, noBalls: 1 },
      ],
      fallOfWickets: [],
      ballsHistory: [],
      isCompleted: true
    },
    innings2: {
      inningsNumber: 2,
      battingTeamId: 'team-royal-strikers',
      bowlingTeamId: 'team-tgs-royal-challengers',
      totalRuns: 169,
      totalWickets: 5,
      oversCompletedStr: '18.3',
      legalBallsBowled: 111,
      target: 166,
      extras: { wides: 3, noBalls: 0, byes: 1, legByes: 1, penalty: 0, total: 5 },
      battingScorecard: [
        { playerId: 'p-team-royal-strikers-1', runs: 72, balls: 44, fours: 7, sixes: 3, strikeRate: 163.6, isOut: false, battingPosition: 1 },
        { playerId: 'p-team-royal-strikers-2', runs: 45, balls: 30, fours: 5, sixes: 1, strikeRate: 150.0, isOut: true, dismissalInfo: 'b Suriya Prakash', battingPosition: 2 },
      ],
      bowlingScorecard: [
        { playerId: 'p-team-tgs-royal-challengers-3', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 36, wickets: 2, economy: 9.0, dots: 8, wides: 1, noBalls: 0 },
        { playerId: 'p-team-tgs-royal-challengers-6', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 29, wickets: 2, economy: 7.25, dots: 12, wides: 1, noBalls: 0 },
      ],
      fallOfWickets: [],
      ballsHistory: [],
      isCompleted: true
    }
  },
  {
    id: 'm-103',
    matchNumber: 3,
    title: 'Match 3 • Group B • LIVE THRILLER',
    stage: 'Group Stage',
    group: 'Group B',
    teamAId: 'team-svs-frankurt-eagels',
    teamBId: 'team-sulzbach-xi',
    date: '2026-09-18',
    time: '19:30',
    venue: 'Apex Oval Complex - Main Arena',
    status: 'live',
    statusNote: 'Innings 2 • Over 18.2',
    tossWinnerId: 'team-svs-frankurt-eagels',
    tossDecision: 'bat',
    currentInningsNumber: 2,
    liveStrikerId: 'p-team-sulzbach-xi-1',
    liveNonStrikerId: 'p-team-sulzbach-xi-2',
    liveBowlerId: 'p-team-svs-frankurt-eagels-3',
    innings1: {
      inningsNumber: 1,
      battingTeamId: 'team-svs-frankurt-eagels',
      bowlingTeamId: 'team-sulzbach-xi',
      totalRuns: 194,
      totalWickets: 6,
      oversCompletedStr: '20.0',
      legalBallsBowled: 120,
      extras: { wides: 5, noBalls: 1, byes: 1, legByes: 2, penalty: 0, total: 9 },
      battingScorecard: [
        { playerId: 'p-team-svs-frankurt-eagels-1', runs: 76, balls: 46, fours: 7, sixes: 4, strikeRate: 165.2, isOut: true, dismissalInfo: 'c Raghavendra b Roshan', battingPosition: 1 },
        { playerId: 'p-team-svs-frankurt-eagels-2', runs: 54, balls: 32, fours: 5, sixes: 3, strikeRate: 168.8, isOut: true, dismissalInfo: 'c Essaki b Hari Prasath', battingPosition: 2 },
        { playerId: 'p-team-svs-frankurt-eagels-5', runs: 32, balls: 18, fours: 3, sixes: 1, strikeRate: 177.8, isOut: false, battingPosition: 3 },
      ],
      bowlingScorecard: [
        { playerId: 'p-team-sulzbach-xi-3', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 38, wickets: 2, economy: 9.5, dots: 8, wides: 2, noBalls: 0 },
        { playerId: 'p-team-sulzbach-xi-2', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 35, wickets: 2, economy: 8.75, dots: 9, wides: 1, noBalls: 1 },
        { playerId: 'p-team-sulzbach-xi-6', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 28, wickets: 1, economy: 7.0, dots: 11, wides: 0, noBalls: 0 },
      ],
      fallOfWickets: [
        { wicketNumber: 1, teamScore: 92, oversStr: '9.4', playerId: 'p-team-svs-frankurt-eagels-2', playerName: 'Adithyan Mundakkal Sudheer' },
        { wicketNumber: 2, teamScore: 156, oversStr: '16.1', playerId: 'p-team-svs-frankurt-eagels-1', playerName: 'Aby George' }
      ],
      ballsHistory: [],
      isCompleted: true,
    },
    innings2: {
      inningsNumber: 2,
      battingTeamId: 'team-sulzbach-xi',
      bowlingTeamId: 'team-svs-frankurt-eagels',
      totalRuns: 178,
      totalWickets: 4,
      oversCompletedStr: '18.2',
      legalBallsBowled: 110,
      target: 195,
      extras: { wides: 6, noBalls: 0, byes: 0, legByes: 2, penalty: 0, total: 8 },
      battingScorecard: [
        { playerId: 'p-team-sulzbach-xi-1', runs: 82, balls: 49, fours: 8, sixes: 4, strikeRate: 167.3, isOut: false, battingPosition: 1 },
        { playerId: 'p-team-sulzbach-xi-2', runs: 48, balls: 32, fours: 5, sixes: 1, strikeRate: 150.0, isOut: false, battingPosition: 2 },
        { playerId: 'p-team-sulzbach-xi-5', runs: 28, balls: 16, fours: 2, sixes: 1, strikeRate: 175.0, isOut: true, dismissalInfo: 'c Akhilmon b Akhil', battingPosition: 3 },
      ],
      bowlingScorecard: [
        { playerId: 'p-team-svs-frankurt-eagels-3', overs: 3.2, ballsLegal: 20, maidens: 0, runsConceded: 33, wickets: 2, economy: 9.9, dots: 7, wides: 2, noBalls: 0 },
        { playerId: 'p-team-svs-frankurt-eagels-7', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 36, wickets: 1, economy: 9.0, dots: 8, wides: 1, noBalls: 0 },
        { playerId: 'p-team-svs-frankurt-eagels-6', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 30, wickets: 1, economy: 7.5, dots: 10, wides: 1, noBalls: 0 },
      ],
      fallOfWickets: [],
      ballsHistory: [],
      isCompleted: false,
    }
  }
];
