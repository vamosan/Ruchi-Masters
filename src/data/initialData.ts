import { Tournament, Team, Match, Announcement, Sponsor, NewsStory, PredictionPoll, Player } from '../types/cricket';

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
    title: "Ruchi Masters T20 Opening Night: Sixes fly under Apex Oval floodlights",
    summary: 'A record 34 sixes were dispatched on opening night as the tournament kicked off with intense rivalry between Royal Strikers and Chennai Champions.',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    date: '2 hours ago',
    category: 'Tournament Exclusive',
    author: 'Tournament Press Desk',
    hasVideo: true
  },
  {
    id: 'news-2',
    title: 'Managers complete 25-player roster photo authentication ahead of Super 8s',
    summary: 'All six franchises have submitted certified player photo IDs and verified playing squads to the tournament technical committee.',
    image: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=800&q=80',
    date: '4 hours ago',
    category: 'Roster Verification',
    author: 'Chief Governance Officer',
    hasVideo: true
  },
  {
    id: 'news-3',
    title: 'Smart LED Zing bails and laser direct-hit tracking illuminate the championship',
    summary: 'High-speed 150 km/h deliveries and lightning stumpings highlight precision tech in action at Ruchi Masters T20 2026.',
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
    date: '6 hours ago',
    category: 'Tech & Umpiring',
    author: 'Tech Desk',
    hasVideo: true
  }
];

export const INITIAL_PREDICTION_POLL: PredictionPoll = {
  id: 'poll-ruchi-2026',
  question: 'Time is running out! Predict who will lift the Ruchi Masters T20 Trophy',
  totalVotes: 98450,
  options: [
    { teamId: 'team-rs', teamName: 'Royal Strikers', flag: '🦁', votes: 41250, percentage: 42 },
    { teamId: 'team-mm', teamName: 'Mumbai Mavericks', flag: '🌊', votes: 30510, percentage: 31 },
    { teamId: 'team-cc', teamName: 'Chennai Champions', flag: '👑', votes: 17720, percentage: 18 },
    { teamId: 'team-kk', teamName: 'Kolkata Knights', flag: '⚔️', votes: 8970, percentage: 9 }
  ]
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🏆 Ruchi Masters T20 2026 Grand Opening & Certified Schedule',
    date: '2026-09-10',
    category: 'Schedule',
    pinned: true,
    author: 'Tournament Director',
    content: 'Welcome to Ruchi Masters T20 2026! 6 elite franchise teams battle over 18 matches leading to the Grand Final under floodlights on September 28 at Apex Oval Stadium.'
  },
  {
    id: 'ann-2',
    title: '⚠️ Mandatory 25-Player Squad & Photo ID Authentication Directive',
    date: '2026-09-11',
    category: 'Rule',
    pinned: true,
    author: 'Technical Committee',
    content: 'All franchise managers must verify their complete 25-player squad roster with certified headshot photo authentication and player license IDs before match day.'
  },
  {
    id: 'ann-3',
    title: '🎟️ Grand Finals Day Presentation Gala & Cap Honors',
    date: '2026-09-12',
    category: 'Ceremony',
    pinned: false,
    author: 'Event Organizing Body',
    content: 'Finals day awards include the Champions Trophy, Orange Cap (Most Runs), Purple Cap (Most Wickets), Maximum Sixes, and $50,000 Player of the Tournament award.'
  }
];

export const INITIAL_TOURNAMENT: Tournament = {
  id: 'ruchi-masters-t20-2026',
  name: 'Ruchi Masters T20',
  tagline: 'The Ultimate Championship of T20 Champions',
  edition: '2026 Edition',
  season: '2026',
  format: 'T20',
  status: 'group_stage',
  startDate: '2026-09-10',
  endDate: '2026-09-28',
  location: 'Apex Oval Complex & Eden Gardens',
  bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
  trophyImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
  description: 'The premier professional T20 cricket tournament. Featuring full 25-player verified squads, real-time ball-by-ball scoring, automated ICC Net Run Rate standings, and player cap leaderboards.',
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

// Helper to generate 25 realistic players per team
function create25PlayersForTeam(
  teamId: string,
  prefix: string,
  keyPlayers: Partial<Player>[]
): Player[] {
  const fullRoster: Player[] = [];

  keyPlayers.forEach((p, index) => {
    fullRoster.push({
      id: p.id || `p-${teamId}-${index + 1}`,
      teamId,
      name: p.name || `Player ${index + 1}`,
      jerseyNumber: p.jerseyNumber || (index + 1),
      role: p.role || 'pure_batter',
      battingStyle: p.battingStyle || 'Right-hand Bat',
      bowlingStyle: p.bowlingStyle || 'None',
      isCaptain: p.isCaptain || false,
      isViceCaptain: p.isViceCaptain || false,
      isWicketKeeper: p.isWicketKeeper || false,
      avatar: p.avatar,
      photoUrl: p.photoUrl || `https://images.unsplash.com/photo-${1500000000000 + (index * 123456789) % 500000000}?auto=format&fit=crop&w=200&h=200&q=80`,
      idProofNumber: `RUCHI-T20-${teamId.toUpperCase().slice(-2)}-${1000 + index}`,
      isAuthenticated: true,
      authenticatedAt: '2026-09-08T10:00:00Z',
      authenticatedBy: 'Team Manager',
      matchesPlayed: p.matchesPlayed ?? 4,
      runsScored: p.runsScored ?? (p.role?.includes('batter') ? Math.floor(Math.random() * 150) + 50 : Math.floor(Math.random() * 40)),
      wicketsTaken: p.wicketsTaken ?? (p.role?.includes('bowler') || p.role?.includes('allrounder') ? Math.floor(Math.random() * 8) + 1 : 0),
      highestScore: p.highestScore ?? (p.role?.includes('batter') ? Math.floor(Math.random() * 60) + 30 : 15),
      bestBowling: p.bestBowling || (p.role?.includes('bowler') ? '3/24' : '0/0'),
      strikeRate: p.strikeRate ?? 142.5,
      economy: p.economy ?? (p.role?.includes('bowler') ? 7.8 : 0)
    });
  });

  const dummyNames = [
    'Rohan Kulkarni', 'Aakash Chopra', 'Saurabh Netravalkar', 'Karan Sharma', 
    'Anuj Rawat', 'Vyshak Vijaykumar', 'Himanshu Sharma', 'Swapnil Singh',
    'Manoj Bhandage', 'Suyash Prabhudessai', 'Tom Curran', 'Reece Topley',
    'Will Jacks', 'Alzarri Joseph', 'Rajangad Bawa', 'Siddarth Kaul', 'Abhishek Sharma'
  ];

  while (fullRoster.length < 25) {
    const idx = fullRoster.length;
    const name = dummyNames[idx % dummyNames.length] || `Squad Member ${idx + 1}`;
    const roles: Player['role'][] = ['pure_batter', 'fast_bowler', 'spin_bowler', 'pace_allrounder', 'wk_batter'];
    const assignedRole = roles[idx % roles.length];
    
    fullRoster.push({
      id: `p-${teamId}-${idx + 1}`,
      teamId,
      name: `${name} ${idx > dummyNames.length ? `(${idx + 1})` : ''}`,
      jerseyNumber: (idx * 3 + 7) % 99 + 1,
      role: assignedRole,
      battingStyle: idx % 3 === 0 ? 'Left-hand Bat' : 'Right-hand Bat',
      bowlingStyle: assignedRole.includes('spin') ? 'Right-arm off-break' : (assignedRole.includes('fast') ? 'Right-arm fast-medium' : 'None'),
      isCaptain: false,
      isViceCaptain: false,
      isWicketKeeper: assignedRole === 'wk_batter',
      photoUrl: `https://images.unsplash.com/photo-${1534528741775 + (idx * 9876543) % 500000000}?auto=format&fit=crop&w=200&h=200&q=80`,
      idProofNumber: `RUCHI-T20-${teamId.toUpperCase().slice(-2)}-${1000 + idx}`,
      isAuthenticated: idx % 4 !== 0,
      authenticatedAt: idx % 4 !== 0 ? '2026-09-08T10:00:00Z' : undefined,
      authenticatedBy: idx % 4 !== 0 ? 'Team Manager' : undefined,
      matchesPlayed: Math.floor(Math.random() * 3),
      runsScored: Math.floor(Math.random() * 45),
      wicketsTaken: assignedRole.includes('bowler') ? Math.floor(Math.random() * 4) : 0,
      highestScore: Math.floor(Math.random() * 35),
      bestBowling: assignedRole.includes('bowler') ? '2/18' : '0/0',
      strikeRate: 130.0,
      economy: 8.2
    });
  }

  return fullRoster;
}

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-rs',
    name: 'Royal Strikers',
    shortName: 'Strikers',
    code: 'RS',
    logo: '🦁',
    primaryColor: '#dc2626',
    secondaryColor: '#f59e0b',
    homeGround: 'Royal Park Stadium',
    group: 'Group A',
    coach: 'Brendon McCullum',
    managerName: 'Vikram Sethi',
    managerEmail: 'vikram@royalstrikers.com',
    managerPhone: '+91 98450 11223',
    slogan: 'Roar with Royal Pride',
    description: 'The powerhouse franchise of Ruchi Masters T20, famous for fearless batting lineups, passionate supporters, and relentless pace bowling.',
    establishedYear: 2021,
    teamPhotoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80',
    supportStaff: [
      { role: 'Head Coach', name: 'Brendon McCullum' },
      { role: 'Batting Consultant', name: 'Neil McKenzie' },
      { role: 'Lead Physio', name: 'Dr. Evan Thomas' }
    ],
    players: create25PlayersForTeam('team-rs', 'rs', [
      { id: 'p-rs-1', name: 'Virat Sharma', jerseyNumber: 18, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm medium', isCaptain: true, matchesPlayed: 4, runsScored: 218, wicketsTaken: 0, highestScore: 84, bestBowling: '0/12', strikeRate: 148.3 },
      { id: 'p-rs-2', name: 'Faf Du Plessis', jerseyNumber: 13, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm leg-break', matchesPlayed: 4, runsScored: 165, wicketsTaken: 0, highestScore: 68, bestBowling: '0/0', strikeRate: 142.1 },
      { id: 'p-rs-3', name: 'Glenn Maxwell', jerseyNumber: 32, role: 'spin_allrounder', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 4, runsScored: 124, wicketsTaken: 5, highestScore: 54, bestBowling: '2/18', strikeRate: 172.2, economy: 7.8 },
      { id: 'p-rs-4', name: 'Dinesh Karthik', jerseyNumber: 19, role: 'wk_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'None', isWicketKeeper: true, matchesPlayed: 4, runsScored: 92, wicketsTaken: 0, highestScore: 41, bestBowling: '0/0', strikeRate: 188.0 },
      { id: 'p-rs-5', name: 'Cameron Green', jerseyNumber: 42, role: 'pace_allrounder', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 4, runsScored: 88, wicketsTaken: 4, highestScore: 38, bestBowling: '2/24', strikeRate: 139.5, economy: 8.4 },
      { id: 'p-rs-6', name: 'Rajat Patidar', jerseyNumber: 87, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 3, runsScored: 76, wicketsTaken: 0, highestScore: 52, bestBowling: '0/0', strikeRate: 155.0 },
      { id: 'p-rs-7', name: 'Mohammed Siraj', jerseyNumber: 73, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast', isViceCaptain: true, matchesPlayed: 4, runsScored: 8, wicketsTaken: 8, highestScore: 6, bestBowling: '3/21', strikeRate: 80.0, economy: 7.2 },
      { id: 'p-rs-8', name: 'Lockie Ferguson', jerseyNumber: 69, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast', matchesPlayed: 4, runsScored: 12, wicketsTaken: 7, highestScore: 8, bestBowling: '3/19', strikeRate: 110.0, economy: 8.1 },
      { id: 'p-rs-9', name: 'Yuzvendra Chahal', jerseyNumber: 3, role: 'spin_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm leg-break', matchesPlayed: 4, runsScored: 2, wicketsTaken: 9, highestScore: 2, bestBowling: '4/17', strikeRate: 50.0, economy: 6.9 },
      { id: 'p-rs-10', name: 'Yash Dayal', jerseyNumber: 10, role: 'fast_bowler', battingStyle: 'Left-hand Bat', bowlingStyle: 'Left-arm fast-medium', matchesPlayed: 3, runsScored: 0, wicketsTaken: 4, highestScore: 0, bestBowling: '2/28', economy: 8.6 },
      { id: 'p-rs-11', name: 'Mahipal Lomror', jerseyNumber: 27, role: 'spin_allrounder', battingStyle: 'Left-hand Bat', bowlingStyle: 'Left-arm orthodox', matchesPlayed: 2, runsScored: 34, wicketsTaken: 1, highestScore: 26, bestBowling: '1/15', strikeRate: 160.0, economy: 7.5 },
    ])
  },
  {
    id: 'team-mm',
    name: 'Mumbai Mavericks',
    shortName: 'Mavericks',
    code: 'MM',
    logo: '🌊',
    primaryColor: '#0284c7',
    secondaryColor: '#facc15',
    homeGround: 'Wankhede Arena',
    group: 'Group A',
    coach: 'Mahela Jayawardene',
    managerName: 'Rahul Sanghvi',
    managerEmail: 'rahul@mumbaimavericks.in',
    managerPhone: '+91 98200 44556',
    slogan: 'Unstoppable Passion, Boundless Pride',
    description: 'Five-time tournament finalists renowned for explosive middle-order hitting, tactical grit, and world-class pace depth.',
    establishedYear: 2020,
    teamPhotoUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=1000&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
    supportStaff: [
      { role: 'Head Coach', name: 'Mahela Jayawardene' },
      { role: 'Bowling Coach', name: 'Shane Bond' },
      { role: 'Fielding Coach', name: 'Jonty Rhodes' }
    ],
    players: create25PlayersForTeam('team-mm', 'mm', [
      { id: 'p-mm-1', name: 'Rohit Verma', jerseyNumber: 45, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm off-break', isCaptain: true, matchesPlayed: 4, runsScored: 195, wicketsTaken: 0, highestScore: 78, bestBowling: '0/0', strikeRate: 152.4 },
      { id: 'p-mm-2', name: 'Ishan Kishan', jerseyNumber: 23, role: 'wk_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'None', isWicketKeeper: true, matchesPlayed: 4, runsScored: 148, wicketsTaken: 0, highestScore: 59, bestBowling: '0/0', strikeRate: 146.5 },
      { id: 'p-mm-3', name: 'Suryakumar Yadav', jerseyNumber: 63, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm medium', isViceCaptain: true, matchesPlayed: 4, runsScored: 242, wicketsTaken: 0, highestScore: 91, bestBowling: '0/0', strikeRate: 184.2 },
      { id: 'p-mm-4', name: 'Hardik Pandya', jerseyNumber: 33, role: 'pace_allrounder', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 4, runsScored: 130, wicketsTaken: 6, highestScore: 46, bestBowling: '3/26', strikeRate: 160.0, economy: 8.5 },
      { id: 'p-mm-5', name: 'Tilak Varma', jerseyNumber: 9, role: 'pure_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 4, runsScored: 110, wicketsTaken: 1, highestScore: 44, bestBowling: '1/12', strikeRate: 138.0 },
      { id: 'p-mm-6', name: 'Tim David', jerseyNumber: 8, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 4, runsScored: 98, wicketsTaken: 0, highestScore: 35, bestBowling: '0/0', strikeRate: 192.0 },
      { id: 'p-mm-7', name: 'Jasprit Bumrah', jerseyNumber: 93, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast', matchesPlayed: 4, runsScored: 6, wicketsTaken: 11, highestScore: 6, bestBowling: '4/14', strikeRate: 90.0, economy: 5.6 },
      { id: 'p-mm-8', name: 'Gerald Coetzee', jerseyNumber: 62, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast', matchesPlayed: 4, runsScored: 14, wicketsTaken: 7, highestScore: 10, bestBowling: '3/32', strikeRate: 120.0, economy: 9.1 },
      { id: 'p-mm-9', name: 'Piyush Chawla', jerseyNumber: 11, role: 'spin_bowler', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm leg-break', matchesPlayed: 4, runsScored: 4, wicketsTaken: 6, highestScore: 4, bestBowling: '2/22', economy: 7.9 },
      { id: 'p-mm-10', name: 'Nuwan Thushara', jerseyNumber: 81, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 3, runsScored: 0, wicketsTaken: 5, highestScore: 0, bestBowling: '3/18', economy: 8.3 },
      { id: 'p-mm-11', name: 'Nehal Wadhera', jerseyNumber: 28, role: 'pure_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm leg-break', matchesPlayed: 2, runsScored: 42, wicketsTaken: 0, highestScore: 28, strikeRate: 140.0 },
    ])
  },
  {
    id: 'team-cc',
    name: 'Chennai Champions',
    shortName: 'Champions',
    code: 'CC',
    logo: '👑',
    primaryColor: '#eab308',
    secondaryColor: '#1d4ed8',
    homeGround: 'Chepauk Fortress',
    group: 'Group A',
    coach: 'Stephen Fleming',
    managerName: 'Kasi Viswanathan',
    managerEmail: 'kasi@chennaichampions.com',
    managerPhone: '+91 94440 77889',
    slogan: 'Whistle with Glory',
    description: 'The masters of spin strategy and nerve-wrecking final over chases with supreme tactical composure.',
    establishedYear: 2020,
    teamPhotoUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1000&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1562077772-3b12ab86a810?auto=format&fit=crop&w=1600&q=80',
    supportStaff: [
      { role: 'Head Coach', name: 'Stephen Fleming' },
      { role: 'Batting Coach', name: 'Michael Hussey' },
      { role: 'Bowling Coach', name: 'Dwayne Bravo' }
    ],
    players: create25PlayersForTeam('team-cc', 'cc', [
      { id: 'p-cc-1', name: 'Ruturaj Gaikwad', jerseyNumber: 31, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm off-break', isCaptain: true, matchesPlayed: 4, runsScored: 204, wicketsTaken: 0, highestScore: 88, bestBowling: '0/0', strikeRate: 145.0 },
      { id: 'p-cc-2', name: 'Devon Conway', jerseyNumber: 88, role: 'wk_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm medium', matchesPlayed: 4, runsScored: 156, wicketsTaken: 0, highestScore: 64, bestBowling: '0/0', strikeRate: 136.0 },
      { id: 'p-cc-3', name: 'Shivam Dube', jerseyNumber: 25, role: 'pace_allrounder', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm medium', matchesPlayed: 4, runsScored: 178, wicketsTaken: 2, highestScore: 66, bestBowling: '1/14', strikeRate: 174.5, economy: 8.9 },
      { id: 'p-cc-4', name: 'Ravindra Jadeja', jerseyNumber: 8, role: 'spin_allrounder', battingStyle: 'Left-hand Bat', bowlingStyle: 'Left-arm orthodox', isViceCaptain: true, matchesPlayed: 4, runsScored: 94, wicketsTaken: 7, highestScore: 36, bestBowling: '3/18', strikeRate: 142.0, economy: 6.8 },
      { id: 'p-cc-5', name: 'MS Dhoni', jerseyNumber: 7, role: 'wk_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm medium', isWicketKeeper: true, matchesPlayed: 4, runsScored: 86, wicketsTaken: 0, highestScore: 37, bestBowling: '0/0', strikeRate: 215.0 },
      { id: 'p-cc-6', name: 'Daryl Mitchell', jerseyNumber: 47, role: 'pace_allrounder', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm medium', matchesPlayed: 4, runsScored: 112, wicketsTaken: 1, highestScore: 48, bestBowling: '1/18', strikeRate: 135.0 },
      { id: 'p-cc-7', name: 'Matheesha Pathirana', jerseyNumber: 99, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast', matchesPlayed: 4, runsScored: 2, wicketsTaken: 10, highestScore: 2, bestBowling: '4/28', strikeRate: 60.0, economy: 7.1 },
      { id: 'p-cc-8', name: 'Deepak Chahar', jerseyNumber: 90, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 3, runsScored: 15, wicketsTaken: 5, highestScore: 12, bestBowling: '2/22', economy: 7.9 },
      { id: 'p-cc-9', name: 'Maheesh Theekshana', jerseyNumber: 61, role: 'spin_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 4, runsScored: 4, wicketsTaken: 6, highestScore: 4, bestBowling: '2/19', economy: 7.2 },
      { id: 'p-cc-10', name: 'Tushar Deshpande', jerseyNumber: 24, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 4, runsScored: 0, wicketsTaken: 6, highestScore: 0, bestBowling: '3/24', economy: 8.8 },
      { id: 'p-cc-11', name: 'Moeen Ali', jerseyNumber: 18, role: 'spin_allrounder', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 3, runsScored: 48, wicketsTaken: 3, highestScore: 30, bestBowling: '2/23', strikeRate: 145.0, economy: 7.6 },
    ])
  },
  {
    id: 'team-tcc',
    name: 'Titans Cricket Club',
    shortName: 'Titans',
    code: 'TCC',
    logo: '⚡',
    primaryColor: '#0f766e',
    secondaryColor: '#f97316',
    homeGround: 'Apex Coliseum',
    group: 'Group B',
    coach: 'Ashish Nehra',
    managerName: 'Satyajit Parab',
    managerEmail: 'satyajit@titanscc.in',
    managerPhone: '+91 97250 33445',
    slogan: 'Aava De — Power & Precision',
    description: 'Relentless, athletic, and technically dominant, boasting top death bowling variations and lethal power all-rounders.',
    establishedYear: 2022,
    teamPhotoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=1600&q=80',
    supportStaff: [
      { role: 'Head Coach', name: 'Ashish Nehra' },
      { role: 'Director of Cricket', name: 'Vikram Solanki' },
      { role: 'Spin Coach', name: 'Aashish Kapoor' }
    ],
    players: create25PlayersForTeam('team-tcc', 'tcc', [
      { id: 'p-tc-1', name: 'Shubman Gill', jerseyNumber: 77, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm off-break', isCaptain: true, matchesPlayed: 4, runsScored: 226, wicketsTaken: 0, highestScore: 89, bestBowling: '0/0', strikeRate: 151.0 },
      { id: 'p-tc-2', name: 'Sai Sudharsan', jerseyNumber: 21, role: 'pure_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm leg-break', matchesPlayed: 4, runsScored: 188, wicketsTaken: 0, highestScore: 72, bestBowling: '0/0', strikeRate: 139.2 },
      { id: 'p-tc-3', name: 'David Miller', jerseyNumber: 10, role: 'pure_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm off-break', isViceCaptain: true, matchesPlayed: 4, runsScored: 142, wicketsTaken: 0, highestScore: 56, bestBowling: '0/0', strikeRate: 165.0 },
      { id: 'p-tc-4', name: 'Rashid Khan', jerseyNumber: 19, role: 'spin_allrounder', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm leg-break', matchesPlayed: 4, runsScored: 74, wicketsTaken: 9, highestScore: 31, bestBowling: '3/16', strikeRate: 185.0, economy: 6.4 },
      { id: 'p-tc-5', name: 'Wriddhiman Saha', jerseyNumber: 6, role: 'wk_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'None', isWicketKeeper: true, matchesPlayed: 4, runsScored: 110, wicketsTaken: 0, highestScore: 45, bestBowling: '0/0', strikeRate: 134.0 },
      { id: 'p-tc-6', name: 'Rahul Tewatia', jerseyNumber: 14, role: 'spin_allrounder', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm leg-break', matchesPlayed: 4, runsScored: 85, wicketsTaken: 2, highestScore: 39, bestBowling: '1/12', strikeRate: 175.0, economy: 8.2 },
      { id: 'p-tc-7', name: 'Mohammed Shami', jerseyNumber: 11, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast', matchesPlayed: 4, runsScored: 6, wicketsTaken: 8, highestScore: 4, bestBowling: '3/20', economy: 7.5 },
      { id: 'p-tc-8', name: 'Mohit Sharma', jerseyNumber: 17, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 4, runsScored: 2, wicketsTaken: 7, highestScore: 2, bestBowling: '3/29', economy: 8.7 },
      { id: 'p-tc-9', name: 'Noor Ahmad', jerseyNumber: 15, role: 'spin_bowler', battingStyle: 'Left-hand Bat', bowlingStyle: 'Left-arm unorthodox', matchesPlayed: 3, runsScored: 0, wicketsTaken: 5, highestScore: 0, bestBowling: '2/20', economy: 7.0 },
      { id: 'p-tc-10', name: 'Spencer Johnson', jerseyNumber: 45, role: 'fast_bowler', battingStyle: 'Left-hand Bat', bowlingStyle: 'Left-arm fast', matchesPlayed: 3, runsScored: 4, wicketsTaken: 4, highestScore: 4, bestBowling: '2/26', economy: 8.4 },
      { id: 'p-tc-11', name: 'Shahrukh Khan', jerseyNumber: 35, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 2, runsScored: 38, wicketsTaken: 0, highestScore: 24, strikeRate: 168.0 },
    ])
  },
  {
    id: 'team-kk',
    name: 'Kolkata Knights',
    shortName: 'Knights',
    code: 'KK',
    logo: '⚔️',
    primaryColor: '#6b21a8',
    secondaryColor: '#eab308',
    homeGround: 'Eden Gardens Park',
    group: 'Group B',
    coach: 'Gautam Gambhir',
    managerName: 'Venky Mysore',
    managerEmail: 'venky@kolkataknights.in',
    managerPhone: '+91 98300 99001',
    slogan: 'Korbo, Lorbo, Jeetbo',
    description: 'Fearless Caribbean style power-hitting merged with mystery spin mastery in an electrifying, high-tempo roster.',
    establishedYear: 2020,
    teamPhotoUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80',
    supportStaff: [
      { role: 'Head Coach', name: 'Gautam Gambhir' },
      { role: 'Bowling Coach', name: 'Bharat Arun' },
      { role: 'Assistant Coach', name: 'Abhishek Nayar' }
    ],
    players: create25PlayersForTeam('team-kk', 'kk', [
      { id: 'p-kk-1', name: 'Shreyas Roy', jerseyNumber: 41, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm leg-break', isCaptain: true, matchesPlayed: 4, runsScored: 170, wicketsTaken: 0, highestScore: 68, strikeRate: 140.0 },
      { id: 'p-kk-2', name: 'Phil Salt', jerseyNumber: 28, role: 'wk_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm medium', isWicketKeeper: true, matchesPlayed: 4, runsScored: 198, wicketsTaken: 0, highestScore: 75, strikeRate: 178.0 },
      { id: 'p-kk-3', name: 'Sunil Narine', jerseyNumber: 74, role: 'spin_allrounder', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 4, runsScored: 215, wicketsTaken: 8, highestScore: 85, bestBowling: '3/19', strikeRate: 182.0, economy: 6.2 },
      { id: 'p-kk-4', name: 'Andre Russell', jerseyNumber: 12, role: 'pace_allrounder', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast', isViceCaptain: true, matchesPlayed: 4, runsScored: 154, wicketsTaken: 7, highestScore: 64, bestBowling: '3/22', strikeRate: 204.0, economy: 9.0 },
      { id: 'p-kk-5', name: 'Rinku Singh', jerseyNumber: 35, role: 'pure_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 4, runsScored: 120, wicketsTaken: 0, highestScore: 48, strikeRate: 168.0 },
      { id: 'p-kk-6', name: 'Venkatesh Iyer', jerseyNumber: 25, role: 'pace_allrounder', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm medium', matchesPlayed: 4, runsScored: 115, wicketsTaken: 2, highestScore: 51, strikeRate: 144.0, economy: 8.8 },
      { id: 'p-kk-7', name: 'Mitchell Starc', jerseyNumber: 56, role: 'fast_bowler', battingStyle: 'Left-hand Bat', bowlingStyle: 'Left-arm fast', matchesPlayed: 4, runsScored: 18, wicketsTaken: 9, highestScore: 12, bestBowling: '3/24', economy: 8.3 },
      { id: 'p-kk-8', name: 'Varun Chakravarthy', jerseyNumber: 29, role: 'spin_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm leg-break', matchesPlayed: 4, runsScored: 0, wicketsTaken: 9, highestScore: 0, bestBowling: '3/16', economy: 6.8 },
      { id: 'p-kk-9', name: 'Harshit Rana', jerseyNumber: 22, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 4, runsScored: 6, wicketsTaken: 6, highestScore: 6, bestBowling: '2/25', economy: 8.9 },
      { id: 'p-kk-10', name: 'Vaibhav Arora', jerseyNumber: 16, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 3, runsScored: 2, wicketsTaken: 4, highestScore: 2, bestBowling: '2/28', economy: 9.1 },
      { id: 'p-kk-11', name: 'Ramandeep Singh', jerseyNumber: 19, role: 'pace_allrounder', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm medium', matchesPlayed: 3, runsScored: 45, wicketsTaken: 1, highestScore: 24, strikeRate: 185.0, economy: 8.0 },
    ])
  },
  {
    id: 'team-bb',
    name: 'Bengaluru Blasters',
    shortName: 'Blasters',
    code: 'BB',
    logo: '🔥',
    primaryColor: '#047857',
    secondaryColor: '#38bdf8',
    homeGround: 'Metro Stadium',
    group: 'Group B',
    coach: 'Trevor Bayliss',
    managerName: 'Anant More',
    managerEmail: 'anant@bengalurublasters.com',
    managerPhone: '+91 99800 66778',
    slogan: 'Fast, Furious, Fearless',
    description: 'Famous for record-breaking powerplay strokeplay and terrifying 150 km/h express pace bowlers.',
    establishedYear: 2022,
    teamPhotoUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
    supportStaff: [
      { role: 'Head Coach', name: 'Trevor Bayliss' },
      { role: 'Pace Bowling Coach', name: 'Morne Morkel' },
      { role: 'Strength & Conditioning', name: 'Adrian Le Roux' }
    ],
    players: create25PlayersForTeam('team-bb', 'bb', [
      { id: 'p-bb-1', name: 'KL Rahul', jerseyNumber: 1, role: 'wk_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'None', isCaptain: true, isWicketKeeper: true, matchesPlayed: 4, runsScored: 192, wicketsTaken: 0, highestScore: 76, strikeRate: 138.0 },
      { id: 'p-bb-2', name: 'Nicholas Pooran', jerseyNumber: 29, role: 'wk_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm off-break', isViceCaptain: true, matchesPlayed: 4, runsScored: 210, wicketsTaken: 0, highestScore: 82, strikeRate: 176.0 },
      { id: 'p-bb-3', name: 'Marcus Stoinis', jerseyNumber: 17, role: 'pace_allrounder', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 4, runsScored: 150, wicketsTaken: 5, highestScore: 62, bestBowling: '2/21', strikeRate: 158.0, economy: 8.7 },
      { id: 'p-bb-4', name: 'Ayush Badoni', jerseyNumber: 2, role: 'pure_batter', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 4, runsScored: 104, wicketsTaken: 0, highestScore: 42, strikeRate: 145.0 },
      { id: 'p-bb-5', name: 'Krunal Pandya', jerseyNumber: 24, role: 'spin_allrounder', battingStyle: 'Left-hand Bat', bowlingStyle: 'Left-arm orthodox', matchesPlayed: 4, runsScored: 82, wicketsTaken: 5, highestScore: 34, bestBowling: '3/18', strikeRate: 132.0, economy: 7.2 },
      { id: 'p-bb-6', name: 'Quinton de Kock', jerseyNumber: 12, role: 'wk_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'None', matchesPlayed: 3, runsScored: 95, wicketsTaken: 0, highestScore: 54, strikeRate: 142.0 },
      { id: 'p-bb-7', name: 'Ravi Bishnoi', jerseyNumber: 56, role: 'spin_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm leg-break', matchesPlayed: 4, runsScored: 4, wicketsTaken: 7, highestScore: 4, bestBowling: '3/20', economy: 7.4 },
      { id: 'p-bb-8', name: 'Naveen-ul-Haq', jerseyNumber: 78, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 4, runsScored: 6, wicketsTaken: 6, highestScore: 4, bestBowling: '2/22', economy: 8.6 },
      { id: 'p-bb-9', name: 'Mayank Yadav', jerseyNumber: 99, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast', matchesPlayed: 3, runsScored: 0, wicketsTaken: 7, highestScore: 0, bestBowling: '3/14', economy: 6.5 },
      { id: 'p-bb-10', name: 'Yash Thakur', jerseyNumber: 27, role: 'fast_bowler', battingStyle: 'Right-hand Bat', bowlingStyle: 'Right-arm fast-medium', matchesPlayed: 4, runsScored: 2, wicketsTaken: 5, highestScore: 2, bestBowling: '3/30', economy: 9.2 },
      { id: 'p-bb-11', name: 'Devdutt Padikkal', jerseyNumber: 37, role: 'pure_batter', battingStyle: 'Left-hand Bat', bowlingStyle: 'Right-arm off-break', matchesPlayed: 3, runsScored: 60, wicketsTaken: 0, highestScore: 32, strikeRate: 125.0 },
    ])
  }
];

export const INITIAL_MATCHES: Match[] = [
  // Completed Match 1
  {
    id: 'm-101',
    matchNumber: 1,
    title: 'Match 1 • Group A',
    stage: 'Group Stage',
    group: 'Group A',
    teamAId: 'team-rs',
    teamBId: 'team-cc',
    date: '2026-09-10',
    time: '19:30',
    venue: 'Royal Park Stadium',
    pitchCondition: 'Batting Friendly, Good Bounce',
    weather: 'Clear, 28°C',
    status: 'completed',
    statusNote: 'Result',
    tossWinnerId: 'team-cc',
    tossDecision: 'bowl',
    currentInningsNumber: 2,
    winnerTeamId: 'team-rs',
    winMargin: 'Royal Strikers won by 18 runs',
    playerOfTheMatchId: 'p-rs-1',
    innings1: {
      inningsNumber: 1,
      battingTeamId: 'team-rs',
      bowlingTeamId: 'team-cc',
      totalRuns: 196,
      totalWickets: 5,
      oversCompletedStr: '20.0',
      legalBallsBowled: 120,
      extras: { wides: 5, noBalls: 1, byes: 2, legByes: 4, penalty: 0, total: 12 },
      battingScorecard: [
        { playerId: 'p-rs-1', runs: 84, balls: 52, fours: 8, sixes: 4, strikeRate: 161.5, isOut: true, dismissalInfo: 'c Jadeja b Pathirana', battingPosition: 1 },
        { playerId: 'p-rs-2', runs: 42, balls: 28, fours: 4, sixes: 2, strikeRate: 150.0, isOut: true, dismissalInfo: 'b Theekshana', battingPosition: 2 },
        { playerId: 'p-rs-6', runs: 28, balls: 18, fours: 3, sixes: 1, strikeRate: 155.5, isOut: true, dismissalInfo: 'c Dhoni b Chahar', battingPosition: 3 },
        { playerId: 'p-rs-3', runs: 24, balls: 12, fours: 2, sixes: 2, strikeRate: 200.0, isOut: true, dismissalInfo: 'c Mitchell b Jadeja', battingPosition: 4 },
        { playerId: 'p-rs-4', runs: 12, balls: 7, fours: 1, sixes: 1, strikeRate: 171.4, isOut: false, battingPosition: 5 },
        { playerId: 'p-rs-5', runs: 6, balls: 3, fours: 1, sixes: 0, strikeRate: 200.0, isOut: false, battingPosition: 6 },
      ],
      bowlingScorecard: [
        { playerId: 'p-cc-8', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 36, wickets: 1, economy: 9.0, dots: 8, wides: 1, noBalls: 0 },
        { playerId: 'p-cc-10', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 44, wickets: 0, economy: 11.0, dots: 5, wides: 2, noBalls: 1 },
        { playerId: 'p-cc-9', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 32, wickets: 1, economy: 8.0, dots: 9, wides: 0, noBalls: 0 },
        { playerId: 'p-cc-4', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 28, wickets: 1, economy: 7.0, dots: 10, wides: 0, noBalls: 0 },
        { playerId: 'p-cc-7', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 50, wickets: 2, economy: 12.5, dots: 6, wides: 2, noBalls: 0 },
      ],
      fallOfWickets: [
        { wicketNumber: 1, teamScore: 78, oversStr: '7.4', playerId: 'p-rs-2', playerName: 'Faf Du Plessis' },
        { wicketNumber: 2, teamScore: 135, oversStr: '13.2', playerId: 'p-rs-6', playerName: 'Rajat Patidar' },
        { wicketNumber: 3, teamScore: 168, oversStr: '17.1', playerId: 'p-rs-1', playerName: 'Virat Sharma' },
        { wicketNumber: 4, teamScore: 184, oversStr: '18.5', playerId: 'p-rs-3', playerName: 'Glenn Maxwell' }
      ],
      ballsHistory: [],
      isCompleted: true,
    },
    innings2: {
      inningsNumber: 2,
      battingTeamId: 'team-cc',
      bowlingTeamId: 'team-rs',
      totalRuns: 178,
      totalWickets: 8,
      oversCompletedStr: '20.0',
      legalBallsBowled: 120,
      target: 197,
      extras: { wides: 6, noBalls: 0, byes: 1, legByes: 2, penalty: 0, total: 9 },
      battingScorecard: [
        { playerId: 'p-cc-1', runs: 58, balls: 38, fours: 6, sixes: 2, strikeRate: 152.6, isOut: true, dismissalInfo: 'c Karthik b Siraj', battingPosition: 1 },
        { playerId: 'p-cc-2', runs: 32, balls: 24, fours: 4, sixes: 0, strikeRate: 133.3, isOut: true, dismissalInfo: 'b Ferguson', battingPosition: 2 },
        { playerId: 'p-cc-3', runs: 44, balls: 26, fours: 2, sixes: 4, strikeRate: 169.2, isOut: true, dismissalInfo: 'c Green b Chahal', battingPosition: 3 },
        { playerId: 'p-cc-4', runs: 18, balls: 14, fours: 1, sixes: 0, strikeRate: 128.5, isOut: true, dismissalInfo: 'st Karthik b Chahal', battingPosition: 4 },
        { playerId: 'p-cc-5', runs: 16, balls: 8, fours: 1, sixes: 1, strikeRate: 200.0, isOut: false, battingPosition: 5 },
      ],
      bowlingScorecard: [
        { playerId: 'p-rs-7', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 32, wickets: 2, economy: 8.0, dots: 11, wides: 1, noBalls: 0 },
        { playerId: 'p-rs-8', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 38, wickets: 2, economy: 9.5, dots: 8, wides: 2, noBalls: 0 },
        { playerId: 'p-rs-9', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 24, wickets: 3, economy: 6.0, dots: 12, wides: 1, noBalls: 0 },
        { playerId: 'p-rs-3', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 40, wickets: 1, economy: 10.0, dots: 6, wides: 1, noBalls: 0 },
        { playerId: 'p-rs-5', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 41, wickets: 0, economy: 10.25, dots: 5, wides: 1, noBalls: 0 },
      ],
      fallOfWickets: [
        { wicketNumber: 1, teamScore: 54, oversStr: '6.1', playerId: 'p-cc-2', playerName: 'Devon Conway' },
        { wicketNumber: 2, teamScore: 112, oversStr: '12.3', playerId: 'p-cc-1', playerName: 'Ruturaj Gaikwad' },
        { wicketNumber: 3, teamScore: 144, oversStr: '15.5', playerId: 'p-cc-3', playerName: 'Shivam Dube' }
      ],
      ballsHistory: [],
      isCompleted: true,
    }
  },

  // Completed Match 2
  {
    id: 'm-102',
    matchNumber: 2,
    title: 'Match 2 • Group B',
    stage: 'Group Stage',
    group: 'Group B',
    teamAId: 'team-kk',
    teamBId: 'team-tcc',
    date: '2026-09-11',
    time: '19:30',
    venue: 'Eden Gardens Park',
    status: 'completed',
    statusNote: 'Result',
    tossWinnerId: 'team-kk',
    tossDecision: 'bat',
    currentInningsNumber: 2,
    winnerTeamId: 'team-kk',
    winMargin: 'Kolkata Knights won by 7 wickets',
    playerOfTheMatchId: 'p-kk-3',
    innings1: {
      inningsNumber: 1,
      battingTeamId: 'team-tcc',
      bowlingTeamId: 'team-kk',
      totalRuns: 168,
      totalWickets: 8,
      oversCompletedStr: '20.0',
      legalBallsBowled: 120,
      extras: { wides: 4, noBalls: 0, byes: 1, legByes: 3, penalty: 0, total: 8 },
      battingScorecard: [
        { playerId: 'p-tc-1', runs: 65, balls: 45, fours: 7, sixes: 2, strikeRate: 144.4, isOut: true, dismissalInfo: 'c Salt b Starc', battingPosition: 1 },
        { playerId: 'p-tc-2', runs: 40, balls: 32, fours: 3, sixes: 1, strikeRate: 125.0, isOut: true, dismissalInfo: 'lbw b Chakravarthy', battingPosition: 2 },
        { playerId: 'p-tc-3', runs: 28, balls: 19, fours: 2, sixes: 1, strikeRate: 147.3, isOut: true, dismissalInfo: 'c Russell b Narine', battingPosition: 3 },
      ],
      bowlingScorecard: [
        { playerId: 'p-kk-7', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 32, wickets: 2, economy: 8.0, dots: 9, wides: 1, noBalls: 0 },
        { playerId: 'p-kk-3', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 22, wickets: 3, economy: 5.5, dots: 14, wides: 0, noBalls: 0 },
        { playerId: 'p-kk-8', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 28, wickets: 2, economy: 7.0, dots: 11, wides: 1, noBalls: 0 },
        { playerId: 'p-kk-4', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 42, wickets: 1, economy: 10.5, dots: 6, wides: 2, noBalls: 0 },
        { playerId: 'p-kk-9', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 40, wickets: 0, economy: 10.0, dots: 5, wides: 0, noBalls: 0 },
      ],
      fallOfWickets: [],
      ballsHistory: [],
      isCompleted: true
    },
    innings2: {
      inningsNumber: 2,
      battingTeamId: 'team-kk',
      bowlingTeamId: 'team-tcc',
      totalRuns: 172,
      totalWickets: 3,
      oversCompletedStr: '17.4',
      legalBallsBowled: 106,
      target: 169,
      extras: { wides: 5, noBalls: 1, byes: 0, legByes: 2, penalty: 0, total: 8 },
      battingScorecard: [
        { playerId: 'p-kk-3', runs: 75, balls: 38, fours: 7, sixes: 5, strikeRate: 197.3, isOut: true, dismissalInfo: 'c Gill b Rashid', battingPosition: 1 },
        { playerId: 'p-kk-2', runs: 52, balls: 30, fours: 6, sixes: 2, strikeRate: 173.3, isOut: true, dismissalInfo: 'b Shami', battingPosition: 2 },
        { playerId: 'p-kk-1', runs: 26, balls: 22, fours: 2, sixes: 0, strikeRate: 118.1, isOut: false, battingPosition: 3 },
        { playerId: 'p-kk-4', runs: 14, balls: 6, fours: 0, sixes: 2, strikeRate: 233.3, isOut: false, battingPosition: 4 },
      ],
      bowlingScorecard: [
        { playerId: 'p-tc-7', overs: 3.4, ballsLegal: 22, maidens: 0, runsConceded: 35, wickets: 1, economy: 9.54, dots: 6, wides: 1, noBalls: 0 },
        { playerId: 'p-tc-8', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 46, wickets: 0, economy: 11.5, dots: 5, wides: 2, noBalls: 1 },
        { playerId: 'p-tc-4', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 28, wickets: 2, economy: 7.0, dots: 10, wides: 1, noBalls: 0 },
        { playerId: 'p-tc-9', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 38, wickets: 0, economy: 9.5, dots: 7, wides: 1, noBalls: 0 },
        { playerId: 'p-tc-6', overs: 2, ballsLegal: 12, maidens: 0, runsConceded: 21, wickets: 0, economy: 10.5, dots: 2, wides: 0, noBalls: 0 },
      ],
      fallOfWickets: [],
      ballsHistory: [],
      isCompleted: true
    }
  },

  // LIVE MATCH (Thrilling Climax)
  {
    id: 'm-103',
    matchNumber: 3,
    title: 'Match 3 • Group A • EL CLASICO',
    stage: 'Group Stage',
    group: 'Group A',
    teamAId: 'team-mm',
    teamBId: 'team-rs',
    date: '2026-09-13',
    time: '19:30',
    venue: 'Wankhede Arena',
    pitchCondition: 'Red Soil, True Pace and Bounce',
    weather: 'Pleasant, 26°C',
    status: 'live',
    statusNote: 'Live - Updates only',
    tossWinnerId: 'team-rs',
    tossDecision: 'bowl',
    currentInningsNumber: 2,
    liveStrikerId: 'p-rs-1',
    liveNonStrikerId: 'p-rs-4',
    liveBowlerId: 'p-mm-7',
    isFreeHitActive: false,
    innings1: {
      inningsNumber: 1,
      battingTeamId: 'team-mm',
      bowlingTeamId: 'team-rs',
      totalRuns: 185,
      totalWickets: 6,
      oversCompletedStr: '20.0',
      legalBallsBowled: 120,
      extras: { wides: 6, noBalls: 1, byes: 1, legByes: 3, penalty: 0, total: 11 },
      battingScorecard: [
        { playerId: 'p-mm-1', runs: 48, balls: 32, fours: 5, sixes: 2, strikeRate: 150.0, isOut: true, dismissalInfo: 'c Siraj b Chahal', battingPosition: 1 },
        { playerId: 'p-mm-2', runs: 28, balls: 18, fours: 4, sixes: 1, strikeRate: 155.5, isOut: true, dismissalInfo: 'b Ferguson', battingPosition: 2 },
        { playerId: 'p-mm-3', runs: 74, balls: 40, fours: 7, sixes: 4, strikeRate: 185.0, isOut: true, dismissalInfo: 'c Lomror b Green', battingPosition: 3 },
        { playerId: 'p-mm-4', runs: 22, balls: 16, fours: 1, sixes: 1, strikeRate: 137.5, isOut: true, dismissalInfo: 'c Du Plessis b Siraj', battingPosition: 4 },
        { playerId: 'p-mm-5', runs: 8, balls: 8, fours: 1, sixes: 0, strikeRate: 100.0, isOut: true, dismissalInfo: 'b Chahal', battingPosition: 5 },
        { playerId: 'p-mm-6', runs: 4, balls: 3, fours: 0, sixes: 0, strikeRate: 133.3, isOut: false, battingPosition: 6 },
      ],
      bowlingScorecard: [
        { playerId: 'p-rs-7', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 36, wickets: 1, economy: 9.0, dots: 9, wides: 1, noBalls: 0 },
        { playerId: 'p-rs-8', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 42, wickets: 1, economy: 10.5, dots: 7, wides: 2, noBalls: 1 },
        { playerId: 'p-rs-9', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 28, wickets: 2, economy: 7.0, dots: 11, wides: 1, noBalls: 0 },
        { playerId: 'p-rs-3', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 38, wickets: 0, economy: 9.5, dots: 8, wides: 1, noBalls: 0 },
        { playerId: 'p-rs-5', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 37, wickets: 1, economy: 9.25, dots: 6, wides: 1, noBalls: 0 },
      ],
      fallOfWickets: [
        { wicketNumber: 1, teamScore: 45, oversStr: '4.3', playerId: 'p-mm-2', playerName: 'Ishan Kishan' },
        { wicketNumber: 2, teamScore: 104, oversStr: '11.2', playerId: 'p-mm-1', playerName: 'Rohit Verma' },
        { wicketNumber: 3, teamScore: 156, oversStr: '16.4', playerId: 'p-mm-4', playerName: 'Hardik Pandya' },
        { wicketNumber: 4, teamScore: 172, oversStr: '18.3', playerId: 'p-mm-3', playerName: 'Suryakumar Yadav' },
        { wicketNumber: 5, teamScore: 181, oversStr: '19.2', playerId: 'p-mm-5', playerName: 'Tilak Varma' }
      ],
      ballsHistory: [],
      isCompleted: true
    },
    innings2: {
      inningsNumber: 2,
      battingTeamId: 'team-rs',
      bowlingTeamId: 'team-mm',
      totalRuns: 174,
      totalWickets: 4,
      oversCompletedStr: '18.2',
      legalBallsBowled: 110,
      target: 186,
      extras: { wides: 4, noBalls: 1, byes: 0, legByes: 3, penalty: 0, total: 8 },
      battingScorecard: [
        { playerId: 'p-rs-1', runs: 78, balls: 48, fours: 7, sixes: 3, strikeRate: 162.5, isOut: false, dismissalInfo: 'batting', battingPosition: 1 },
        { playerId: 'p-rs-2', runs: 35, balls: 22, fours: 4, sixes: 1, strikeRate: 159.0, isOut: true, dismissalInfo: 'b Bumrah', battingPosition: 2 },
        { playerId: 'p-rs-6', runs: 24, balls: 16, fours: 2, sixes: 1, strikeRate: 150.0, isOut: true, dismissalInfo: 'c Kishan b Coetzee', battingPosition: 3 },
        { playerId: 'p-rs-3', runs: 18, balls: 11, fours: 1, sixes: 1, strikeRate: 163.6, isOut: true, dismissalInfo: 'c Pandya b Chawla', battingPosition: 4 },
        { playerId: 'p-rs-5', runs: 6, balls: 4, fours: 1, sixes: 0, strikeRate: 150.0, isOut: true, dismissalInfo: 'c David b Bumrah', battingPosition: 5 },
        { playerId: 'p-rs-4', runs: 9, balls: 6, fours: 1, sixes: 0, strikeRate: 150.0, isOut: false, dismissalInfo: 'batting', battingPosition: 6 },
      ],
      bowlingScorecard: [
        { playerId: 'p-mm-7', overs: 3.2, ballsLegal: 20, maidens: 0, runsConceded: 22, wickets: 2, economy: 6.6, dots: 11, wides: 0, noBalls: 0 },
        { playerId: 'p-mm-8', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 44, wickets: 1, economy: 11.0, dots: 6, wides: 2, noBalls: 1 },
        { playerId: 'p-mm-4', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 40, wickets: 0, economy: 10.0, dots: 7, wides: 1, noBalls: 0 },
        { playerId: 'p-mm-9', overs: 4, ballsLegal: 24, maidens: 0, runsConceded: 35, wickets: 1, economy: 8.75, dots: 8, wides: 1, noBalls: 0 },
        { playerId: 'p-mm-10', overs: 3, ballsLegal: 18, maidens: 0, runsConceded: 30, wickets: 0, economy: 10.0, dots: 4, wides: 0, noBalls: 0 },
      ],
      fallOfWickets: [
        { wicketNumber: 1, teamScore: 58, oversStr: '5.4', playerId: 'p-rs-2', playerName: 'Faf Du Plessis' },
        { wicketNumber: 2, teamScore: 102, oversStr: '10.5', playerId: 'p-rs-6', playerName: 'Rajat Patidar' },
        { wicketNumber: 3, teamScore: 142, oversStr: '15.2', playerId: 'p-rs-3', playerName: 'Glenn Maxwell' },
        { wicketNumber: 4, teamScore: 159, oversStr: '17.1', playerId: 'p-rs-5', playerName: 'Cameron Green' }
      ],
      ballsHistory: [
        {
          id: 'b-110',
          ballNumberStr: '18.2',
          overIndex: 18,
          ballInOver: 2,
          bowlerId: 'p-mm-7',
          strikerId: 'p-rs-1',
          nonStrikerId: 'p-rs-4',
          runsBat: 1,
          extraType: 'none',
          extraRuns: 0,
          isWicket: false,
          commentary: '18.2 - Jasprit Bumrah to Virat Sharma, Single taken! Searing yorker dug out into the leg-side for a brisk single.',
          isFour: false,
          isSix: false,
          isLegalBall: true,
          isFreeHit: false,
          timestamp: Date.now() - 30000
        },
        {
          id: 'b-109',
          ballNumberStr: '18.1',
          overIndex: 18,
          ballInOver: 1,
          bowlerId: 'p-mm-7',
          strikerId: 'p-rs-4',
          nonStrikerId: 'p-rs-1',
          runsBat: 1,
          extraType: 'none',
          extraRuns: 0,
          isWicket: false,
          commentary: '18.1 - Jasprit Bumrah to Dinesh Karthik, 1 run. Length ball directed at the body, turned gently toward mid-wicket to rotate strike to Virat Sharma.',
          isFour: false,
          isSix: false,
          isLegalBall: true,
          isFreeHit: false,
          timestamp: Date.now() - 60000
        },
        {
          id: 'b-108',
          ballNumberStr: '17.6',
          overIndex: 17,
          ballInOver: 6,
          bowlerId: 'p-mm-8',
          strikerId: 'p-rs-4',
          nonStrikerId: 'p-rs-1',
          runsBat: 4,
          extraType: 'none',
          extraRuns: 0,
          isWicket: false,
          commentary: '17.6 - Gerald Coetzee to Dinesh Karthik, FOUR! Superb ramp shot over the wicketkeeper for a boundary!',
          isFour: true,
          isSix: false,
          isLegalBall: true,
          isFreeHit: false,
          timestamp: Date.now() - 95000
        }
      ],
      isCompleted: false
    }
  },

  // Rain Delayed Match Card
  {
    id: 'm-104',
    matchNumber: 4,
    title: 'Match 4 • Group B',
    stage: 'Group Stage',
    group: 'Group B',
    teamAId: 'team-bb',
    teamBId: 'team-tcc',
    date: '2026-09-14',
    time: '19:30',
    venue: 'Metro Stadium',
    pitchCondition: 'Even grass, Good for swing bowlers',
    weather: 'Passing Shower, 22°C',
    status: 'scheduled',
    statusNote: 'Match Delayed By Rain',
    currentInningsNumber: 1
  },

  // Scheduled Match 5
  {
    id: 'm-105',
    matchNumber: 5,
    title: 'Match 5 • Group A',
    stage: 'Group Stage',
    group: 'Group A',
    teamAId: 'team-cc',
    teamBId: 'team-mm',
    date: '2026-09-16',
    time: '19:30',
    venue: 'Chepauk Fortress',
    pitchCondition: 'Spin assisting pitch',
    weather: 'Humid, 30°C',
    status: 'scheduled',
    statusNote: 'Upcoming',
    currentInningsNumber: 1
  },

  // Semi Final 1
  {
    id: 'm-201',
    matchNumber: 6,
    title: 'Semi Final 1 • Rank 1 vs Rank 4',
    stage: 'Semi Final 1',
    teamAId: 'team-rs',
    teamBId: 'team-tcc',
    date: '2026-09-24',
    time: '19:30',
    venue: 'Apex Oval Complex',
    status: 'scheduled',
    statusNote: 'Playoffs',
    currentInningsNumber: 1
  },

  // Semi Final 2
  {
    id: 'm-202',
    matchNumber: 7,
    title: 'Semi Final 2 • Rank 2 vs Rank 3',
    stage: 'Semi Final 2',
    teamAId: 'team-kk',
    teamBId: 'team-mm',
    date: '2026-09-25',
    time: '19:30',
    venue: 'Eden Gardens Park',
    status: 'scheduled',
    statusNote: 'Playoffs',
    currentInningsNumber: 1
  },

  // Grand Final
  {
    id: 'm-301',
    matchNumber: 8,
    title: '🏆 THE GRAND FINAL',
    stage: 'Grand Final',
    teamAId: 'team-rs',
    teamBId: 'team-kk',
    date: '2026-09-28',
    time: '19:30',
    venue: 'Apex Oval Complex',
    status: 'scheduled',
    statusNote: 'Championship Night',
    currentInningsNumber: 1
  }
];
