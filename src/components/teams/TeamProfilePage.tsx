import React, { useState, useRef, useMemo } from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  Globe,
  AtSign,
  Share2,
  Link2,
  Building2, 
  Edit3, 
  Plus, 
  Shield, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Award, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  UserCheck, 
  ChevronLeft,
  ChevronRight, 
  TrendingUp, 
  Zap, 
  Users, 
  Flame,
  FileBadge,
  Upload,
  Info,
  Layers,
  ChevronDown,
  Crown,
  Lock,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  LayoutGrid,
  GalleryHorizontalEnd
} from 'lucide-react';
import { Team, Player, Match, PlayerRole, BattingStyle, BowlingStyle } from '../../types/cricket';
import { useTournament } from '../../context/TournamentContext';
import { calculatePointsTable } from '../../utils/nrrCalculator';
import { processPlayerPhoto, processBannerPhoto } from '../../utils/imageUtils';
import { EditTeamModal } from './EditTeamModal';
import { HoloTiltCard } from '../common/HoloTiltCard';
import { PlayerCertificateModal } from './PlayerCertificateModal';
import { PlayerDetailModal } from './PlayerDetailModal';

interface Props {
  team: Team;
  onBack: () => void;
  onSelectTeam: (team: Team) => void;
}

export const TeamProfilePage: React.FC<Props> = ({ team, onBack, onSelectTeam }) => {
  const { 
    tournament,
    teams, 
    matches, 
    currentUser, 
    canEditTeam, 
    isAdmin, 
    openAuthModal,
    addTeam,
    updateTeam,
    deleteTeam,
    addPlayer, 
    updatePlayer, 
    deletePlayer, 
    setActiveMatchId, 
    setActiveTab 
  } = useTournament();

  const isAuthorized = canEditTeam(team.id);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const [activeTabKey, setActiveTabKey] = useState<'squad' | 'overview' | 'matches' | 'media'>('squad');
  const [squadLayout, setSquadLayout] = useState<'carousel' | 'grid'>('carousel');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [authPlayerModal, setAuthPlayerModal] = useState<Player | null>(null);
  const [selectedCertPlayer, setSelectedCertPlayer] = useState<Player | null>(null);
  const [enlargedPlayer, setEnlargedPlayer] = useState<Player | null>(null);

  // Search & Filters for squad
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [authFilter, setAuthFilter] = useState<'all' | 'verified' | 'pending'>('all');

  // Player Form State
  const [playerName, setPlayerName] = useState('');
  const [jerseyNum, setJerseyNum] = useState(10);
  const [role, setRole] = useState<PlayerRole>('pure_batter');
  const [battingStyle, setBattingStyle] = useState<BattingStyle>('Right-hand Bat');
  const [bowlingStyle, setBowlingStyle] = useState<BowlingStyle>('Right-arm fast');
  const [isCaptain, setIsCaptain] = useState(false);
  const [isViceCaptain, setIsViceCaptain] = useState(false);
  const [isWK, setIsWK] = useState(false);
  const [playerFormPhoto, setPlayerFormPhoto] = useState<string>('');

  // Authentication State
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');
  const [idProofNum, setIdProofNum] = useState('');

  const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
  const viceCaptain = team.players.find(p => p.isViceCaptain || p.id === team.viceCaptainId);
  const [captainSignName, setCaptainSignName] = useState(captain?.name || team.managerName || 'Team Captain');

  // Standings & League Record for this club
  const allStandings = useMemo(
    () => calculatePointsTable(teams, matches, tournament.rules),
    [teams, matches, tournament.rules]
  );
  const groupStandings = useMemo(
    () => allStandings.filter(s => (team.group ? s.group === team.group : true)).slice(0, 5),
    [allStandings, team.group]
  );
  const teamStanding = allStandings.find(s => s.teamId === team.id);
  const groupPosition = Math.max(1, groupStandings.findIndex(s => s.teamId === team.id) + 1);

  // Filter matches involving this team
  const teamMatches = matches.filter(m => m.teamAId === team.id || m.teamBId === team.id);
  const completedMatches = teamMatches.filter(m => m.status === 'completed');
  const winsCount = teamStanding ? teamStanding.won : completedMatches.filter(m => m.winnerTeamId === team.id).length;
  const lossesCount = teamStanding ? teamStanding.lost : completedMatches.filter(m => m.winnerTeamId && m.winnerTeamId !== team.id).length;
  const matchesPlayedCount = teamStanding ? teamStanding.played : teamMatches.length;

  const verifiedCount = team.players.filter(p => p.isAuthenticated).length;

  // Key Team Statistics
  const totalRunsScored = team.players.reduce((sum, p) => sum + (p.runsScored || 0), 0);
  const totalWicketsTaken = team.players.reduce((sum, p) => sum + (p.wicketsTaken || 0), 0);
  const topRunScorer = [...team.players].sort((a, b) => (b.runsScored || 0) - (a.runsScored || 0))[0];
  const topWicketTaker = [...team.players].sort((a, b) => (b.wicketsTaken || 0) - (a.wicketsTaken || 0))[0];
  const topMvpPlayer = [...team.players].sort((a, b) => (b.mvpPoints || 0) - (a.mvpPoints || 0))[0];

  const scrollCarousel = (dir: 'prev' | 'next') => {
    const el = carouselRef.current;
    if (!el) return;
    const step = Math.max(320, Math.round(el.clientWidth * 0.72));
    el.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPlayerModal || !isAuthorized) return;

    updatePlayer(team.id, {
      ...authPlayerModal,
      photoUrl: uploadedPhoto || authPlayerModal.photoUrl,
      idProofNumber: idProofNum || authPlayerModal.idProofNumber || ('RUCHI-' + team.code + '-' + Date.now().toString().slice(-4)),
      isAuthenticated: true,
      authenticatedAt: new Date().toISOString(),
      authenticatedBy: captainSignName || captain?.name || 'Captain'
    });

    setAuthPlayerModal(null);
    setUploadedPhoto('');
    setIdProofNum('');
  };



  const handleDirectTeamPhoto = async (file: File) => {
    try {
      const base64 = await processBannerPhoto(file);
      updateTeam({
        ...team,
        teamPhotoUrl: base64
      });
    } catch (err) {
      console.error(err);
      alert('Could not upload team photo');
    }
  };

  const handleDirectPlayerPhoto = async (player: Player, file: File) => {
    try {
      const base64 = await processPlayerPhoto(file);
      updatePlayer(team.id, {
        ...player,
        photoUrl: base64,
        isAuthenticated: true,
        authenticatedAt: new Date().toISOString(),
        authenticatedBy: captain?.name || team.managerName || 'Team Captain'
      });
    } catch (err) {
      console.error('Failed to process player photo', err);
      alert('Could not upload image. Please choose another JPG/PNG image.');
    }
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !isAuthorized) return;

    if (editingPlayer) {
      updatePlayer(team.id, {
        ...editingPlayer,
        name: playerName,
        jerseyNumber: jerseyNum,
        role,
        battingStyle,
        bowlingStyle,
        isCaptain,
        isViceCaptain,
        isWicketKeeper: isWK,
        photoUrl: playerFormPhoto || editingPlayer.photoUrl,
        isAuthenticated: true
      });
      setEditingPlayer(null);
    } else {
      const newP: Player = {
        id: 'p-' + team.id + '-' + Date.now(),
        teamId: team.id,
        name: playerName,
        jerseyNumber: jerseyNum,
        role,
        battingStyle,
        bowlingStyle,
        isCaptain,
        isViceCaptain,
        isWicketKeeper: isWK,
        photoUrl: playerFormPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        idProofNumber: 'RUCHI-T20-' + team.code + '-' + (Math.floor(Math.random() * 9000) + 1000),
        isAuthenticated: false,
        matchesPlayed: 0,
        runsScored: 0,
        wicketsTaken: 0,
        highestScore: 0,
        bestBowling: '0/0',
        strikeRate: 0,
        economy: 0
      };
      addPlayer(team.id, newP);
    }

    setPlayerName('');
    setJerseyNum(Math.floor(Math.random() * 99) + 1);
    setIsCaptain(false);
    setIsViceCaptain(false);
    setIsWK(false);
    setShowAddPlayer(false);
    setPlayerFormPhoto('');
  };

  const startEditPlayer = (p: Player) => {
    if (!isAuthorized) {
      openAuthModal(team.id);
      return;
    }
    setEditingPlayer(p);
    setPlayerName(p.name);
    setPlayerFormPhoto(p.photoUrl || '');
    setJerseyNum(p.jerseyNumber);
    setRole(p.role);
    setBattingStyle(p.battingStyle);
    setBowlingStyle(p.bowlingStyle);
    setIsCaptain(p.isCaptain || false);
    setIsViceCaptain(p.isViceCaptain || false);
    setIsWK(p.isWicketKeeper || false);
    setShowAddPlayer(true);
  };

  const getRoleLabel = (r: PlayerRole) => {
    switch (r) {
      case 'pure_batter': return 'Pure Batter';
      case 'wk_batter': return 'Wicketkeeper Batter';
      case 'pace_allrounder': return 'Pace All-Rounder';
      case 'spin_allrounder': return 'Spin All-Rounder';
      case 'fast_bowler': return 'Fast Bowler';
      case 'spin_bowler': return 'Spin Bowler';
      default: return 'Cricketer';
    }
  };

  const getRoleShortLabel = (r: PlayerRole) => {
    switch (r) {
      case 'pure_batter': return 'BAT';
      case 'wk_batter': return 'WK';
      case 'pace_allrounder':
      case 'spin_allrounder': return 'ALL-R';
      case 'fast_bowler':
      case 'spin_bowler': return 'BOWL';
      default: return 'PRO';
    }
  };

  const filteredPlayers = team.players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.jerseyNumber.toString().includes(searchQuery) ||
                          (p.idProofNumber && p.idProofNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    const matchesAuth = authFilter === 'all' || 
                        (authFilter === 'verified' && p.isAuthenticated) || 
                        (authFilter === 'pending' && !p.isAuthenticated);

    return matchesSearch && matchesRole && matchesAuth;
  });

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Role Access Alert Strip (Compact) */}
      {isAuthorized ? (
        <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">
              {currentUser.role === 'admin'
                ? 'Super Admin Mode Active: Edit team info, photos, and all squad members.'
                : `Franchise Captain Authorized: Exclusive management access for ${team.name}.`}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-200 text-emerald-900 font-mono font-black text-[10px]">
            EDIT ACCESS GRANTED
          </span>
        </div>
      ) : null}

      {/* EDITORIAL DARK ATHLETE-STYLE TEAM PROFILE HERO (Matches Pogba Card & Rally Vibe) */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0a0a0c] text-[#f6f4f4] border border-[#1d1d22] shadow-2xl">
        {/* Dramatic Red/Rally Orange Crescent Glow Halo */}
        <div
          className="pointer-events-none select-none absolute -top-20 -right-16 w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] rounded-full opacity-35"
          style={{
            background: `radial-gradient(circle, ${team.primaryColor || '#ff6a17'}cc 0%, #ff6a1744 48%, transparent 72%)`
          }}
        />

        {/* Minimal Top Header Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-5 sm:px-8 py-4 border-b border-white/10 bg-[#0a0a0c]/75 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-[#ff6a17] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Squads</span>
            </button>
            <span className="text-white/20">·</span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#ff6a17] font-bold">
              {team.group || 'Ruchi Masters T20 2026'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={team.id}
              onChange={(e) => {
                const found = teams.find(t => t.id === e.target.value);
                if (found) onSelectTeam(found);
              }}
              aria-label="Switch Team"
              className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs outline-none cursor-pointer"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id} className="bg-[#0a0a0c] text-white">
                  {t.name}
                </option>
              ))}
            </select>

            {isAuthorized ? (
              <>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#ff6a17]" />
                  <span>Edit Team</span>
                </button>
                <label
                  htmlFor="team-direct-photo-upload"
                  className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#ff6a17] hover:bg-[#ff7f36] text-[#090909] font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Photo</span>
                  <input
                    id="team-direct-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      if (f) handleDirectTeamPhoto(f);
                    }}
                  />
                </label>
              </>
            ) : (
              <button
                onClick={() => openAuthModal(team.id)}
                className="px-3 py-1.5 rounded-lg bg-[#ff6a17] hover:bg-[#ff7f36] text-[#090909] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Captain Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Hero Split: Club Stats Ledger Left + Big Fading Team Image Right */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* LEFT COLUMN (5 Cols): Club Title + 3-Box Strip + Hairline Season Ledger */}
          <div className="lg:col-span-5 px-5 sm:px-8 py-7 sm:py-9 flex flex-col justify-between space-y-6 bg-[#0a0a0c]">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                  #{groupPosition} · EST. {team.establishedYear || 2022}
                </span>
                <span className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-xl shadow">
                  {team.logo}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl xl:text-[44px] font-black font-cabinet tracking-tight leading-[1.02] text-white">
                {team.name}
              </h1>

              {team.slogan && (
                <p className="text-xs text-slate-400">{team.slogan}</p>
              )}
            </div>

            {/* 3-Box Highlight Strip (Pogba Reference Card Style) */}
            <div className="grid grid-cols-3 border-y border-white/10 divide-x divide-white/10 text-center py-3">
              <div className="px-2">
                <div className="text-lg sm:text-xl font-black font-mono text-white">
                  {winsCount}W–{lossesCount}L
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Record</div>
              </div>
              <div className="px-2">
                <div className="text-lg sm:text-xl font-black font-mono text-[#ff6a17]">
                  {teamStanding?.points ?? 0}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Points</div>
              </div>
              <div className="px-2">
                <div className="text-lg sm:text-xl font-black font-mono text-white">
                  {teamStanding ? (teamStanding.nrr >= 0 ? `+${teamStanding.nrr.toFixed(2)}` : teamStanding.nrr.toFixed(2)) : '0.00'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">NRR</div>
              </div>
            </div>

            {/* Clean Hairline Team Stats Ledger */}
            <div className="space-y-2.5 text-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Team profile & 2026 stats
              </div>
              <div className="divide-y divide-white/[0.08]">
                <div className="py-2 flex items-center justify-between gap-3">
                  <span className="text-slate-400">Captain</span>
                  <span className="font-bold text-white truncate">{captain?.name || 'TBD'}</span>
                </div>
                <div className="py-2 flex items-center justify-between gap-3">
                  <span className="text-slate-400">Home ground</span>
                  <span className="font-semibold text-slate-200 truncate">{team.homeGround || 'Apex Oval'}</span>
                </div>
                <div className="py-2 flex items-center justify-between gap-3">
                  <span className="text-slate-400">Matches played</span>
                  <span className="font-mono font-bold text-white">{matchesPlayedCount}</span>
                </div>
                <div className="py-2 flex items-center justify-between gap-3">
                  <span className="text-slate-400">Total runs scored</span>
                  <span className="font-mono font-bold text-white">{totalRunsScored}</span>
                </div>
                <div className="py-2 flex items-center justify-between gap-3">
                  <span className="text-slate-400">Total wickets taken</span>
                  <span className="font-mono font-bold text-white">{totalWicketsTaken}</span>
                </div>
                <div className="py-2 flex items-center justify-between gap-3">
                  <span className="text-slate-400">Registered squad</span>
                  <span className="font-mono font-bold text-emerald-400">{team.players.length} Players ({verifiedCount} Verified)</span>
                </div>
              </div>
            </div>

            {/* Bottom Links / Form Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Form:</span>
                {(teamStanding?.form || []).slice(-5).map((f, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                      f === 'W'
                        ? 'bg-emerald-500 text-[#090909]'
                        : f === 'L'
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-600 text-white'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                {team.website && (
                  <a
                    href={team.website.startsWith('http') ? team.website : 'https://' + team.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-bold uppercase tracking-wider"
                  >
                    Website ↗
                  </a>
                )}
                {team.instagram && (
                  <a
                    href={team.instagram.startsWith('http') ? team.instagram : 'https://instagram.com/' + team.instagram.replace('@', '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-bold uppercase tracking-wider"
                  >
                    IG ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (7 Cols): BIG Dramatic Edge-to-Edge Fading Team Photo */}
          <div
            onClick={() => {
              if (isAuthorized) {
                document.getElementById('team-direct-photo-upload')?.click();
              } else {
                openAuthModal(team.id);
              }
            }}
            className="lg:col-span-7 relative min-h-[340px] sm:min-h-[460px] lg:min-h-[520px] overflow-hidden cursor-pointer group bg-[#0a0a0c]"
          >
            <img
              src={team.teamPhotoUrl || team.bannerUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=80'}
              alt={team.name}
              className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.onerror = null;
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=80';
              }}
            />

            {/* Vignette Fade Left & Bottom into #0a0a0c */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />

            {/* Subtle Top Performers Overlay at Bottom Right */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {topRunScorer && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEnlargedPlayer(topRunScorer); }}
                    className="px-3 py-1.5 rounded-xl bg-[#0a0a0c]/85 backdrop-blur-md border border-white/15 hover:border-[#ff6a17] text-left transition-colors cursor-pointer"
                  >
                    <div className="text-[9px] font-bold uppercase tracking-wider text-[#ff6a17]">Runs Leader</div>
                    <div className="text-xs font-bold text-white">
                      {topRunScorer.name} <span className="font-mono text-amber-300">({topRunScorer.runsScored || 0})</span>
                    </div>
                  </button>
                )}
                {topWicketTaker && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEnlargedPlayer(topWicketTaker); }}
                    className="px-3 py-1.5 rounded-xl bg-[#0a0a0c]/85 backdrop-blur-md border border-white/15 hover:border-[#ff6a17] text-left transition-colors cursor-pointer"
                  >
                    <div className="text-[9px] font-bold uppercase tracking-wider text-purple-300">Wickets Leader</div>
                    <div className="text-xs font-bold text-white">
                      {topWicketTaker.name} <span className="font-mono text-purple-300">({topWicketTaker.wicketsTaken || 0}W)</span>
                    </div>
                  </button>
                )}
              </div>

              <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur border border-white/15 text-[11px] font-semibold text-white/90 opacity-85 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity">
                <Camera className="w-3.5 h-3.5 text-[#ff6a17]" />
                <span>{isAuthorized ? 'Change Squad Photo' : 'Captain Login for Photo'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PROFILE NAVIGATION TABS (Rally Monochrome Pills) */}
      <div className="flex items-center gap-2 border-b border-[#090909]/15 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTabKey('squad')}
          className={'px-4 py-2 rounded-full font-semibold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer ' + (
            activeTabKey === 'squad'
              ? 'bg-[#090909] text-[#f6f4f4]'
              : 'bg-white text-[#575252] hover:text-[#090909] border border-[#090909]/15'
          )}
        >
          <Users className="w-4 h-4" />
          <span>Squad Cards ({team.players.length})</span>
        </button>

        <button
          onClick={() => setActiveTabKey('overview')}
          className={'px-4 py-2 rounded-full font-semibold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer ' + (
            activeTabKey === 'overview'
              ? 'bg-[#090909] text-[#f6f4f4]'
              : 'bg-white text-[#575252] hover:text-[#090909] border border-[#090909]/15'
          )}
        >
          <Info className="w-4 h-4" />
          <span>Team Overview & Captain</span>
        </button>

        <button
          onClick={() => setActiveTabKey('matches')}
          className={'px-4 py-2 rounded-full font-semibold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer ' + (
            activeTabKey === 'matches'
              ? 'bg-[#090909] text-[#f6f4f4]'
              : 'bg-white text-[#575252] hover:text-[#090909] border border-[#090909]/15'
          )}
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule & Results ({teamMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTabKey('media')}
          className={'px-4 py-2 rounded-full font-semibold text-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer ' + (
            activeTabKey === 'media'
              ? 'bg-[#090909] text-[#f6f4f4]'
              : 'bg-white text-[#575252] hover:text-[#090909] border border-[#090909]/15'
          )}
        >
          <Camera className="w-4 h-4" />
          <span>Team Photos & Colors</span>
        </button>
      </div>

      {/* TAB 1: SQUAD ROSTER (3D HOLOGRAPHIC TILT CARDS + ACCESS GUARDS) */}
      {activeTabKey === 'squad' && (
        <div className="space-y-6">
          
          {/* Carousel / Filter Toolbar with Next & Prev Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950 font-cabinet flex items-center gap-2">
                  <span>Squad Player Cards</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-xs font-mono">
                    {filteredPlayers.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Scroll horizontally or click Prev / Next · Click any player card for full 2026 stats & career view
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {squadLayout === 'carousel' && (
                  <div className="flex items-center gap-1.5 mr-1">
                    <button
                      type="button"
                      onClick={() => scrollCarousel('prev')}
                      aria-label="Previous Players"
                      className="w-9 h-9 rounded-full border border-slate-300 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-800 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel('next')}
                      aria-label="Next Players"
                      className="w-9 h-9 rounded-full bg-[#ff6a17] hover:bg-[#090909] text-[#090909] hover:text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSquadLayout('carousel')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                      squadLayout === 'carousel' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <GalleryHorizontalEnd className="w-3.5 h-3.5" />
                    <span>Slider</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSquadLayout('grid')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                      squadLayout === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search player by name, jersey #, or tournament ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 outline-none font-medium text-xs transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-800 font-medium outline-none cursor-pointer hover:bg-white transition-colors"
                >
                  <option value="all">All Roles ({team.players.length})</option>
                  <option value="pure_batter">Pure Batters</option>
                  <option value="wk_batter">Wicketkeeper Batters</option>
                  <option value="pace_allrounder">Pace All-rounders</option>
                  <option value="spin_allrounder">Spin All-rounders</option>
                  <option value="fast_bowler">Fast Bowlers</option>
                  <option value="spin_bowler">Spin Bowlers</option>
                </select>

                <select
                  value={authFilter}
                  onChange={e => setAuthFilter(e.target.value as any)}
                  className="border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-800 font-medium outline-none cursor-pointer hover:bg-white transition-colors"
                >
                  <option value="all">All Verification Status</option>
                  <option value="verified">Verified Real Players</option>
                  <option value="pending">Pending Authentication</option>
                </select>

                {isAuthorized ? (
                  <button
                    onClick={() => {
                      setEditingPlayer(null);
                      setPlayerName('');
                      setShowAddPlayer(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>Add Squad Player</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal(team.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Captain Auth to Add</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Horizontal Scrollable Player Cards Deck (or Grid Toggle) */}
          <div className="relative">
            <div
              ref={carouselRef}
              className={
                squadLayout === 'carousel'
                  ? 'flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1'
                  : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              }
            >
              {[...filteredPlayers]
                .sort((a, b) => {
                  if (a.isCaptain && !b.isCaptain) return -1;
                  if (!a.isCaptain && b.isCaptain) return 1;
                  return ((b.mvpPoints || 0) - (a.mvpPoints || 0)) || ((b.runsScored || 0) - (a.runsScored || 0));
                })
                .map((player) => (
                <div
                  key={player.id}
                  className={
                    squadLayout === 'carousel'
                      ? 'w-[285px] sm:w-[305px] shrink-0 snap-start'
                      : 'w-full'
                  }
                >
                  <HoloTiltCard
                    isSpecial={player.isCaptain}
                    className="h-full cursor-pointer group"
                    onClick={() => setEnlargedPlayer(player)}
                  >
                    {/* Paul Pogba / Alexis Sanchez Dark Editorial Athlete Card */}
                    <div
                      className={
                        'bg-[#0a0a0c] text-[#f6f4f4] rounded-2xl border overflow-hidden flex flex-col justify-between transition-all h-full shadow-xl group-hover:-translate-y-0.5 ' +
                        (player.isCaptain
                          ? 'border-[#ff6a17]/70'
                          : player.isAuthenticated
                            ? 'border-[#1e1e24] group-hover:border-[#ff6a17]/50'
                            : 'border-dashed border-amber-400/60')
                      }
                    >
                      {/* Full-Bleed Portrait with Dark Vignette Fade & Stacked Typography */}
                      <div className="relative h-72 overflow-hidden bg-[#0a0a0c]">
                        {/* Subtle Red/Orange Crescent Glow behind Shoulders */}
                        <div
                          className="pointer-events-none absolute -top-10 -left-10 w-56 h-56 rounded-full opacity-45"
                          style={{
                            background: `radial-gradient(circle, ${team.primaryColor || '#ff6a17'}aa 0%, #ff6a1733 55%, transparent 72%)`
                          }}
                        />

                        <img
                          src={player.photoUrl || player.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&h=600&q=80'}
                          alt={player.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&h=600&q=80';
                          }}
                        />

                        {/* Moody Vignette Gradient Fade into #0a0a0c */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/65 to-transparent" />

                        {/* Top Bar: Captain / WK / Verification */}
                        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            {player.isCaptain && (
                              <span className="px-2 py-0.5 rounded-full bg-[#ff6a17] text-[#090909] text-[10px] font-black uppercase">
                                Captain
                              </span>
                            )}
                            {player.isViceCaptain && !player.isCaptain && (
                              <span className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur text-white text-[10px] font-bold uppercase">
                                VC
                              </span>
                            )}
                            {player.isWicketKeeper && (
                              <span className="px-2 py-0.5 rounded-full bg-sky-400 text-[#090909] text-[10px] font-black uppercase">
                                WK
                              </span>
                            )}
                          </div>

                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-black/60 backdrop-blur border border-white/15 text-emerald-400"
                            title={player.isAuthenticated ? 'Verified Player' : 'Pending Verification'}
                          >
                            {player.isAuthenticated ? '✓' : '•'}
                          </span>
                        </div>

                        {/* Stacked Typographic Overlay anchored over Dark Vignette Fade */}
                        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[11px] font-mono font-bold text-slate-300 tracking-wide">
                              #{player.jerseyNumber} · {getRoleShortLabel(player.role)}
                            </div>
                            <h3 className="text-[22px] font-black font-cabinet text-white leading-[1.04] tracking-tight mt-0.5">
                              <span className="block truncate">{player.name.split(' ')[0]}</span>
                              {player.name.split(' ').length > 1 && (
                                <span className="block truncate">{player.name.split(' ').slice(1).join(' ')}</span>
                              )}
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                              {team.name}
                            </p>
                          </div>

                          <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur border border-white/15 flex items-center justify-center text-base shrink-0">
                            {team.logo}
                          </span>
                        </div>
                      </div>

                      {/* 3-Box Divided Attribute Strip (Pogba Reference Card) */}
                      <div className="grid grid-cols-3 border-y border-white/10 divide-x divide-white/10 text-center py-2.5 bg-[#0a0a0c]">
                        <div className="px-1">
                          <div className="text-sm font-black font-mono text-white">{player.matchesPlayed ?? 0}</div>
                          <div className="text-[10px] text-slate-400">Matches</div>
                        </div>
                        <div className="px-1">
                          <div className="text-sm font-black font-mono text-white">{Math.round(player.strikeRate || 0)}</div>
                          <div className="text-[10px] text-slate-400">Strike Rate</div>
                        </div>
                        <div className="px-1">
                          <div className="text-sm font-black font-mono text-white">
                            {player.battingStyle === 'Left-hand Bat' ? 'Left' : 'Right'}
                          </div>
                          <div className="text-[10px] text-slate-400">Batting</div>
                        </div>
                      </div>

                      {/* Clean Hairline Season Stats Rows */}
                      <div className="px-4 pt-3 pb-2.5 space-y-2 text-xs flex-1 flex flex-col justify-between bg-[#0a0a0c]">
                        <div className="text-[11px] font-semibold text-slate-400">Player stats</div>
                        <div className="divide-y divide-white/[0.07]">
                          <div className="py-1.5 flex items-center justify-between">
                            <span className="text-slate-400">Runs scored</span>
                            <span className="font-mono font-bold text-white">{player.runsScored || 0}</span>
                          </div>
                          <div className="py-1.5 flex items-center justify-between">
                            <span className="text-slate-400">Wickets · Sixes</span>
                            <span className="font-mono font-bold text-white">
                              {player.wicketsTaken || 0}W · {player.sixes || 0}×6
                            </span>
                          </div>
                          <div className="py-1.5 flex items-center justify-between">
                            <span className="text-slate-400">Highest · MVP</span>
                            <span className="font-mono font-bold text-white">
                              {player.highestScore || 0} · {player.mvpPoints ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Action Bar */}
                      <div
                        className="px-4 py-2.5 flex items-center justify-between border-t border-white/10 bg-[#0d0e12] text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setEnlargedPlayer(player)}
                          className="text-[11px] font-black uppercase tracking-wider text-emerald-400 hover:text-[#ff6a17] transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedCertPlayer(player)}
                            className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 text-[10px] font-semibold border border-white/10 transition-colors cursor-pointer"
                            title="View Official Player ID"
                          >
                            ID
                          </button>

                          {isAuthorized && (
                            <>
                              <label
                                htmlFor={'direct-photo-' + player.id}
                                className="cursor-pointer p-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-all"
                                title="Upload or change player photo"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <input
                                  id={'direct-photo-' + player.id}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) handleDirectPlayerPhoto(player, file);
                                  }}
                                />
                              </label>

                              <button
                                onClick={() => setEnlargedPlayer(player)}
                                className="p-1 rounded-md bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition-all cursor-pointer"
                                title="Edit Player Info"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to remove ${player.name} from ${team.name}?`)) {
                                    deletePlayer(team.id, player.id);
                                  }
                                }}
                                className="p-1 rounded-md bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition-all cursor-pointer"
                                title="Delete Player from Squad"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </HoloTiltCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEAM OVERVIEW & CAPTAIN */}
      {activeTabKey === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bio & Story */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider">
                Franchise Story
              </span>
              <h2 className="text-2xl font-bold font-cabinet mt-3 text-slate-900">About {team.name}</h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                {team.description || (team.name + ' is one of the premier franchise members of Ruchi Masters T20. Led by Captain ' + (captain?.name || 'TBD') + '.')}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-600" />
                Home Ground & Fortress Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Venue:</span>
                  <span className="font-semibold text-slate-900 text-sm">{team.homeGround}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Format:</span>
                  <span className="font-semibold text-slate-900 text-sm">T20 Championship</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Established:</span>
                  <span className="font-semibold text-slate-900 text-sm font-mono">{team.establishedYear || 2022}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Mascot & Tagline:</span>
                  <span className="font-semibold text-slate-900 text-sm">{team.logo} "{team.slogan || 'Play Bold'}"</span>
                </div>
              </div>
            </div>
          </div>

          {/* Captain & Staff Column */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-bold text-base font-cabinet text-slate-900 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                Franchise Captain & Management
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-amber-800 font-mono">FRANCHISE CAPTAIN</span>
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-base text-slate-950 font-cabinet">{captain?.name || 'Captain TBD'}</h4>
                  {captain && (
                    <p className="text-slate-600 font-medium text-xs">
                      #{captain.jerseyNumber} • {getRoleLabel(captain.role)}
                    </p>
                  )}
                  {team.managerEmail && (
                    <p className="text-slate-500 font-mono text-[11px] pt-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {team.managerEmail}
                    </p>
                  )}
                </div>

                {viceCaptain && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 font-mono">Vice Captain</span>
                    <h4 className="font-bold text-sm text-slate-900">{viceCaptain.name}</h4>
                    <p className="text-slate-500 text-xs">#{viceCaptain.jerseyNumber} • {getRoleLabel(viceCaptain.role)}</p>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 font-mono">Head Coach</span>
                  <h4 className="font-bold text-sm text-slate-900">{team.coach || 'Head Coach TBD'}</h4>
                </div>

                {team.supportStaff && team.supportStaff.map((staff, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 font-mono">{staff.role}</span>
                    <h4 className="font-bold text-sm text-slate-900">{staff.name}</h4>
                  </div>
                ))}
              </div>

              {isAuthorized ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-xs text-slate-900 transition-colors"
                >
                  Edit Captain & Staff Info
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal(team.id)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-xs text-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Captain Login to Edit Staff</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULE & RESULTS */}
      {activeTabKey === 'matches' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-cabinet text-slate-900">Tournament Fixtures & Results</h2>
              <p className="text-xs text-slate-500 mt-0.5">All scheduled and completed matches for {team.name}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {teamMatches.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center font-medium">No fixtures scheduled yet for this franchise.</p>
            ) : (
              teamMatches.map((match) => {
                const opponentId = match.teamAId === team.id ? match.teamBId : match.teamAId;
                const opponent = teams.find(t => t.id === opponentId);
                const isWinner = match.winnerTeamId === team.id;

                return (
                  <div
                    key={match.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold px-2 py-0.5 rounded text-[11px] bg-slate-200 text-slate-800 font-mono">
                          {match.title}
                        </span>
                        <span className="text-slate-500 font-medium">{match.date} • {match.time}</span>
                        <span className="text-slate-400 font-medium hidden md:inline">/ {match.venue}</span>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-2 font-bold text-base text-slate-900">
                          <span>{team.name}</span>
                          <span className="text-slate-400 text-xs font-normal">vs</span>
                          <span>{opponent?.name || 'Opponent'}</span>
                        </div>
                      </div>

                      {match.winMargin && (
                        <p className="text-xs font-semibold text-emerald-700">
                          {match.winMargin}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={'px-3 py-1 rounded-full text-xs font-semibold ' + (
                        match.status === 'completed'
                          ? (isWinner ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200')
                          : (match.status === 'live' ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700 border border-slate-200')
                      )}>
                        {match.status === 'completed' ? (isWinner ? '🏆 Won' : 'Defeat') : match.status.toUpperCase()}
                      </span>

                      <button
                        onClick={() => {
                          setActiveMatchId(match.id);
                          setActiveTab('live');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-2xs"
                      >
                        Match Center ➔
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MEDIA & KIT COLORS */}
      {activeTabKey === 'media' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Photograph Full View */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-cabinet text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-600" />
                Team Squad Photograph
              </h3>
              {isAuthorized && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition-colors"
                >
                  Upload / Change
                </button>
              )}
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={team.teamPhotoUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80'}
                alt={team.name}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Official roster squad photograph for {team.name} 2026 Championship.
            </p>
          </div>

          {/* Brand Colors & Kit Swatches */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-cabinet text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                Brand Identity & Kit Colors
              </h3>
              {isAuthorized && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-2xs"
                >
                  Customize Colors
                </button>
              )}
            </div>

            <div 
              className="p-6 rounded-xl border border-slate-200 shadow-sm text-white space-y-4"
              style={{
                background: 'linear-gradient(135deg, ' + (team.primaryColor || '#2563eb') + ', ' + (team.secondaryColor || '#f59e0b') + ')'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black font-cabinet">{team.name}</h4>
                <p className="text-xs opacity-90 font-medium">Official Team Kit & Theme</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl border-2 border-slate-900" style={{ backgroundColor: team.primaryColor }} />
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] font-mono">PRIMARY</span>
                  <span className="font-mono font-bold">{team.primaryColor}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl border-2 border-slate-900" style={{ backgroundColor: team.secondaryColor }} />
                <div>
                  <span className="text-slate-500 font-bold block text-[10px] font-mono">SECONDARY</span>
                  <span className="font-mono font-bold">{team.secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENLARGED PLAYER DETAIL PROFILE MODAL */}
      {enlargedPlayer && (
        <PlayerDetailModal
          player={enlargedPlayer}
          team={team}
          onClose={() => setEnlargedPlayer(null)}
        />
      )}

      {/* EDIT TEAM PROFILE & MEDIA MODAL */}
      {showEditModal && isAuthorized && (
        <EditTeamModal
          team={team}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* DIGITAL CAPTAIN VERIFICATION CERTIFICATE / PASSPORT MODAL */}
      {selectedCertPlayer && (
        <PlayerCertificateModal
          player={selectedCertPlayer}
          team={team}
          onClose={() => setSelectedCertPlayer(null)}
        />
      )}

      {/* CAPTAIN AUTHENTICATION & IMAGE UPLOAD MODAL */}
      {authPlayerModal && isAuthorized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-md w-full p-6 space-y-4 text-xs text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold font-cabinet flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-500" />
                Authenticate Player: {authPlayerModal.name}
              </h3>
              <button onClick={() => setAuthPlayerModal(null)} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAuthentication} className="space-y-4">
              {/* Photo Upload Box */}
              <div className="space-y-2">
                <label className="block font-semibold uppercase tracking-wider text-[11px] text-slate-600">
                  1. Upload Player Photograph / Headshot
                </label>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <img 
                    src={uploadedPhoto || authPlayerModal.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"}
                    alt="Player Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80';
                    }}
                  />
                  <div className="space-y-1.5 flex-1">
                    <label className="cursor-pointer px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      Choose Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                    <p className="text-[10px] text-slate-500">
                      PNG, JPG, or WEBP headshot.
                    </p>
                  </div>
                </div>
              </div>

              {/* ID Proof Number */}
              <div className="space-y-1">
                <label className="block font-semibold uppercase tracking-wider text-[11px] text-slate-600">
                  2. Tournament Player ID Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CRIC-2026-IND-8849"
                  value={idProofNum}
                  onChange={e => setIdProofNum(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-medium outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              {/* Captain Signature Name */}
              <div className="space-y-1">
                <label className="block font-semibold uppercase tracking-wider text-[11px] text-slate-600">
                  3. Authenticating Captain Name
                </label>
                <input
                  type="text"
                  required
                  value={captainSignName}
                  onChange={e => setCaptainSignName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Confirming authenticates that this player is eligible and rostered in compliance with tournament rules.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAuthPlayerModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm transition-colors"
                >
                  Verify & Authenticate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PLAYER MODAL */}
      {showAddPlayer && isAuthorized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-md w-full p-6 space-y-4 text-xs text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-base font-cabinet flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                {editingPlayer ? 'Edit Squad Player' : 'Register New Squad Player'}
              </h4>
              <button onClick={() => setShowAddPlayer(false)} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlayer} className="space-y-3">
              {/* Photo Upload Section inside modal */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700">Player Photo / Headshot</label>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src={playerFormPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80'}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80';
                    }}
                  />
                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-300" />
                      <span>Select Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            try {
                              const base64 = await processPlayerPhoto(file);
                              setPlayerFormPhoto(base64);
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-slate-500 font-medium">JPEG or PNG portrait from camera or gallery</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700">Player Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jasprit Bumrah"
                  value={playerName}
                  onChange={e => setPlayerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Jersey Number</label>
                  <input
                    type="number"
                    min={0}
                    max={999}
                    value={jerseyNum}
                    onChange={e => setJerseyNum(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-semibold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Player Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as PlayerRole)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:bg-white focus:border-amber-500 cursor-pointer"
                  >
                    <option value="pure_batter">Pure Batter</option>
                    <option value="wk_batter">Wicketkeeper Batter</option>
                    <option value="pace_allrounder">Pace All-Rounder</option>
                    <option value="spin_allrounder">Spin All-Rounder</option>
                    <option value="fast_bowler">Fast Bowler</option>
                    <option value="spin_bowler">Spin Bowler</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Batting Style</label>
                  <select
                    value={battingStyle}
                    onChange={e => setBattingStyle(e.target.value as BattingStyle)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:bg-white focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Right-hand Bat">Right-hand Bat</option>
                    <option value="Left-hand Bat">Left-hand Bat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700">Bowling Style</label>
                  <select
                    value={bowlingStyle}
                    onChange={e => setBowlingStyle(e.target.value as BowlingStyle)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:bg-white focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Right-arm fast">Right-arm fast</option>
                    <option value="Right-arm fast-medium">Right-arm fast-medium</option>
                    <option value="Left-arm fast">Left-arm fast</option>
                    <option value="Right-arm off-break">Right-arm off-break</option>
                    <option value="Right-arm leg-break">Right-arm leg-break</option>
                    <option value="Left-arm orthodox">Left-arm orthodox</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isCaptain}
                    onChange={e => setIsCaptain(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Captain (C)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isViceCaptain}
                    onChange={e => setIsViceCaptain(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>Vice Captain (VC)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isWK}
                    onChange={e => setIsWK(e.target.checked)}
                    className="rounded text-cyan-600"
                  />
                  <span>Wicketkeeper (WK)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddPlayer(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm transition-colors"
                >
                  Save Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
