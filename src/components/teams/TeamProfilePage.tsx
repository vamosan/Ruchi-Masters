import React, { useState } from 'react';
import { 
  ArrowLeft,
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
  Trash2
} from 'lucide-react';
import { Team, Player, Match, PlayerRole, BattingStyle, BowlingStyle } from '../../types/cricket';
import { useTournament } from '../../context/TournamentContext';
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

  const [activeTabKey, setActiveTabKey] = useState<'squad' | 'overview' | 'matches' | 'media'>('squad');
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

  // Filter matches involving this team
  const teamMatches = matches.filter(m => m.teamAId === team.id || m.teamBId === team.id);
  const completedMatches = teamMatches.filter(m => m.status === 'completed');
  const winsCount = completedMatches.filter(m => m.winnerTeamId === team.id).length;
  const lossesCount = completedMatches.filter(m => m.winnerTeamId && m.winnerTeamId !== team.id).length;

  const verifiedCount = team.players.filter(p => p.isAuthenticated).length;

  // Key Team Statistics
  const totalRunsScored = team.players.reduce((sum, p) => sum + (p.runsScored || 0), 0);
  const totalWicketsTaken = team.players.reduce((sum, p) => sum + (p.wicketsTaken || 0), 0);
  const topRunScorer = [...team.players].sort((a, b) => (b.runsScored || 0) - (a.runsScored || 0))[0];
  const topWicketTaker = [...team.players].sort((a, b) => (b.wicketsTaken || 0) - (a.wicketsTaken || 0))[0];

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
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Top Navigation & Team Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-2 transition-all shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Back to All Squads</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Direct Team Selector Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium hidden md:inline">Switch Franchise:</span>
            <select
              value={team.id}
              onChange={(e) => {
                const found = teams.find(t => t.id === e.target.value);
                if (found) onSelectTeam(found);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-xs outline-none cursor-pointer hover:bg-white transition-colors"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Edit Team / Login Button */}
          {isAuthorized ? (
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Edit Team Profile & Pic</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal(team.id)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span>Captain Login to Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Role Access Alert Banner */}
      {!isAuthorized && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 text-amber-300 border border-slate-700 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <span>Read-Only Squad View</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{team.name}</span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Viewing as <strong>{currentUser.role === 'team' ? currentUser.teamName + ' Captain' : 'Spectator'}</strong>. Only certified <strong>{team.name} Captain</strong> or tournament admins can modify roster data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAuthModal(team.id)}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>Log In as Team Captain</span>
            </button>
          </div>
        </div>
      )}

      {isAuthorized && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">
              {currentUser.role === 'admin' 
                ? 'Super Admin Mode Active: You can edit this team and certify all squad members.'
                : 'Franchise Captain Authorized: You have exclusive management access for ' + team.name + '.'}
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-200 text-emerald-900 font-mono font-black text-[10px]">
            EDIT ACCESS GRANTED
          </span>
        </div>
      )}

      {/* DYNAMIC FRANCHISE HERO BANNER (Full Height with Elevated Team Pic) */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-white shadow-lg">
        
        {/* Stadium Background Banner with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={team.bannerUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80'}
            alt={team.name}
            className="w-full h-full object-cover object-center brightness-[0.35]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80';
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, ' + (team.primaryColor || '#2563eb') + '88 0%, ' + (team.secondaryColor || '#f59e0b') + '35 60%, #090d16 100%)'
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          
          {/* Top Row: Group Badge & Edit Action */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur text-white font-mono font-semibold text-xs border border-white/20">
                OFFICIAL FRANCHISE
              </span>
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur text-slate-300 border border-white/10 text-xs font-mono font-medium">
                EST. {team.establishedYear || 2022}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isAuthorized ? (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/20 backdrop-blur-md transition-all shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Edit Team Info</span>
                  </button>

                  <label 
                    htmlFor="team-direct-photo-upload"
                    className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-slate-900" />
                    <span>Upload Squad Photo</span>
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
                  className="px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-slate-200 backdrop-blur text-xs font-semibold transition-all border border-white/20 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Captain Login to Edit</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Hero Header: Team Title on Left, High Elevated Team Photo on Right */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-2">
            
            {/* Left: Team Name */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-cabinet tracking-tight text-white drop-shadow-md truncate">
                    {team.name}
                  </h1>
                </div>

                

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-200 font-medium pt-1">
                  <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-bold">{team.homeGround || 'Apex Oval Complex'}</span>
                  </span>

                  {team.address && (
                    <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10 hidden sm:flex">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{team.address}</span>
                    </span>
                  )}

                  {captain && (
                    <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-white/20 text-white font-bold">
                      <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Captain: <strong className="text-amber-300 font-black">{captain.name}</strong></span>
                    </span>
                  )}

                  {/* Online links if available */}
                  {team.website && (
                    <a
                      href={team.website.startsWith('http') ? team.website : 'https://' + team.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-200 hover:text-slate-950 px-2.5 py-1 rounded-xl border border-cyan-400/30 transition-all font-bold"
                      title="Visit Official Website"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Website</span>
                    </a>
                  )}

                  {team.instagram && (
                    <a
                      href={team.instagram.startsWith('http') ? team.instagram : 'https://instagram.com/' + team.instagram.replace('@', '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-pink-500/20 hover:bg-pink-500 text-pink-200 hover:text-white px-2.5 py-1 rounded-xl border border-pink-400/30 transition-all font-bold"
                      title="View Instagram"
                    >
                      <AtSign className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </a>
                  )}

                  {team.facebook && (
                    <a
                      href={team.facebook.startsWith('http') ? team.facebook : 'https://facebook.com/' + team.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500 text-blue-200 hover:text-white px-2.5 py-1 rounded-xl border border-blue-400/30 transition-all font-bold"
                      title="View Facebook"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Elevated Team Squad Photo Card (Fully visible and elevated) */}
            <div 
              onClick={() => {
                if (isAuthorized) {
                  document.getElementById('team-direct-photo-upload')?.click();
                } else {
                  openAuthModal(team.id);
                }
              }}
              className="relative group cursor-pointer shrink-0 rounded-2xl overflow-hidden border border-white/20 shadow-md hover:scale-[1.02] transition-all w-full sm:w-80 bg-slate-900"
            >
              <div className="h-44 sm:h-48 w-full overflow-hidden">
                <img
                  src={team.teamPhotoUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'}
                  alt="Team Squad"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-xs">
                {isAuthorized ? (
                  <>
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>Upload New Squad Pic</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Captain Login to Change Pic</span>
                  </>
                )}
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur border border-white/10 text-white text-[11px] font-semibold">
                <span className="flex items-center gap-1"><Users className="w-3 h-3 text-emerald-400" /> Official Squad</span>
                <span className="text-amber-400 text-[10px] font-semibold font-mono">2026 ROSTER</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* KEY STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Squad Size</span>
          <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{team.players.length}</span>
          <span className="text-[11px] text-emerald-600 font-medium">25 Player Capacity</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Verified Players</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 font-mono">{verifiedCount}/{team.players.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">Photo ID Certified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Win Record</span>
          <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{winsCount}W - {lossesCount}L</span>
          <span className="text-[11px] text-slate-500 font-medium">{teamMatches.length} Matches</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Total Runs</span>
          <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{totalRunsScored}</span>
          <span className="text-[11px] text-slate-500 font-medium truncate">Top: {topRunScorer?.name?.split(' ')[0]} ({topRunScorer?.runsScored})</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Total Wickets</span>
          <span className="text-2xl font-black text-slate-900 mt-1 font-mono">{totalWicketsTaken}</span>
          <span className="text-[11px] text-slate-500 font-medium truncate">Top: {topWicketTaker?.name?.split(' ')[0]} ({topWicketTaker?.wicketsTaken})</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Captain</span>
          <span className="text-sm font-bold text-slate-900 mt-1 truncate">{captain?.name || 'TBD'}</span>
          <span className="text-[11px] text-slate-500 font-medium truncate">{team.managerPhone || team.homeGround}</span>
        </div>
      </div>

      {/* PROFILE NAVIGATION TABS (Mobbin-style Segmented Pills) */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTabKey('squad')}
          className={'px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shrink-0 ' + (
            activeTabKey === 'squad'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
          )}
        >
          <Users className="w-4 h-4" />
          <span>Squad Roster ({team.players.length})</span>
        </button>

        <button
          onClick={() => setActiveTabKey('overview')}
          className={'px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shrink-0 ' + (
            activeTabKey === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
          )}
        >
          <Info className="w-4 h-4" />
          <span>Team Overview & Captain</span>
        </button>

        <button
          onClick={() => setActiveTabKey('matches')}
          className={'px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shrink-0 ' + (
            activeTabKey === 'matches'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
          )}
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule & Results ({teamMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTabKey('media')}
          className={'px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shrink-0 ' + (
            activeTabKey === 'media'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
          )}
        >
          <Camera className="w-4 h-4" />
          <span>Team Photos & Colors</span>
        </button>
      </div>

      {/* TAB 1: SQUAD ROSTER (3D HOLOGRAPHIC TILT CARDS + ACCESS GUARDS) */}
      {activeTabKey === 'squad' && (
        <div className="space-y-6">
          
          {/* Squad Header & Search/Filter Controls */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Add Squad Player</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal(team.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Captain Auth to Add</span>
                </button>
              )}
            </div>
          </div>

          {/* Player Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlayers.map((player) => (
              <HoloTiltCard
                key={player.id}
                isSpecial={player.isCaptain}
                className="h-full cursor-pointer group"
                onClick={() => setEnlargedPlayer(player)}
              >
                <div
                  className={'bg-white rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all h-full relative overflow-hidden group-hover:border-slate-300 group-hover:shadow-md ' + (
                    player.isAuthenticated 
                      ? 'border-slate-200/80 shadow-sm' 
                      : 'bg-amber-50/20 border-dashed border-amber-300 shadow-2xs'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Enlarged Player Photo Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={player.photoUrl || player.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80'}
                        alt={player.name}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm bg-slate-100 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80';
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 text-[11px] font-mono font-bold shadow-xs">
                        #{player.jerseyNumber}
                      </span>
                    </div>

                    {/* Player Details */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-base text-slate-900 font-cabinet truncate">{player.name}</h3>
                        {player.isCaptain && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">(C)</span>}
                        {player.isViceCaptain && <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">(VC)</span>}
                        {player.isWicketKeeper && <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">(WK)</span>}
                      </div>

                      <p className="text-xs font-medium text-slate-500">
                        {getRoleLabel(player.role)}
                      </p>

                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        ID: {player.idProofNumber || 'PENDING AUTH'}
                      </div>
                    </div>
                  </div>

                  {/* Player Performance Stats Strip */}
                  <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50 rounded-xl border border-slate-100 text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">RUNS</span>
                      <span className="text-xs font-bold text-slate-900">{player.runsScored || 0}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">WKTS</span>
                      <span className="text-xs font-bold text-slate-900">{player.wicketsTaken || 0}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">HS</span>
                      <span className="text-xs font-bold text-slate-900">{player.highestScore || 0}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-semibold block">SR</span>
                      <span className="text-xs font-bold text-slate-900">{player.strikeRate || 135}</span>
                    </div>
                  </div>

                  {/* Captain Verification Bar & Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                    {/* View Certificate / Passport button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCertPlayer(player);
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-800 text-[11px] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                      title="View Official Player ID"
                    >
                      <FileBadge className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Player ID</span>
                    </button>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {isAuthorized ? (
                        <>
                          <label 
                            htmlFor={'direct-photo-' + player.id}
                            className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-[11px] border border-slate-200 flex items-center gap-1 transition-all shadow-2xs"
                            title="Upload or change player photo"
                          >
                            <Camera className="w-3.5 h-3.5 text-slate-700" />
                            <span>Upload Pic</span>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setEnlargedPlayer(player);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 transition-all"
                            title="Edit Player Info"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to remove ${player.name} from ${team.name}?`)) {
                                deletePlayer(team.id, player.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all"
                            title="Delete Player from Squad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEnlargedPlayer(player);
                          }}
                          className="text-[10px] font-mono text-slate-600 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>Profile ➔</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </HoloTiltCard>
            ))}
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
