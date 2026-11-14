import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Shield, 
  Trash2, 
  Edit3, 
  Award, 
  Sparkles, 
  MapPin, 
  Flame,
  Activity,
  CheckCircle2,
  Clock,
  Upload,
  Camera,
  Search,
  Filter,
  UserCheck,
  FileBadge
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Team, Player, PlayerRole, BattingStyle, BowlingStyle } from '../../types/cricket';
import { processPlayerPhoto } from '../../utils/imageUtils';

interface Props {
  team: Team | null;
  onClose: () => void;
}

export const TeamDetailModal: React.FC<Props> = ({ team, onClose }) => {
  const { viewMode, addPlayer, updatePlayer, deletePlayer } = useTournament();
  
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [authPlayerModal, setAuthPlayerModal] = useState<Player | null>(null);

  // Filter & Search
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

  // Authentication State
  const [uploadedPhoto, setUploadedPhoto] = useState<string>('');
  const [idProofNum, setIdProofNum] = useState('');
  const [captainSignName, setCaptainSignName] = useState(team?.players.find(p => p.isCaptain)?.name || team?.managerName || 'Team Captain');

  if (!team) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await processPlayerPhoto(file);
        setUploadedPhoto(compressedBase64);
      } catch (err) {
        console.error('Image compression failed:', err);
      }
    }
  };

  const handleConfirmAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authPlayerModal) return;

    updatePlayer(team.id, {
      ...authPlayerModal,
      photoUrl: uploadedPhoto || authPlayerModal.photoUrl,
      idProofNumber: idProofNum || authPlayerModal.idProofNumber || `CRIC-ID-${team.code}-${Date.now().toString().slice(-4)}`,
      isAuthenticated: true,
      authenticatedAt: new Date().toISOString(),
      authenticatedBy: captainSignName || 'Team Captain'
    });

    setAuthPlayerModal(null);
    setUploadedPhoto('');
    setIdProofNum('');
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

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
      });
      setEditingPlayer(null);
    } else {
      const newP: Player = {
        id: `p-${team.id}-${Date.now()}`,
        teamId: team.id,
        name: playerName,
        jerseyNumber: jerseyNum,
        role,
        battingStyle,
        bowlingStyle,
        isCaptain,
        isViceCaptain,
        isWicketKeeper: isWK,
        photoUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80`,
        idProofNumber: `CRIC-ID-${team.code}-${Math.floor(Math.random() * 9000) + 1000}`,
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
  };

  const startEditPlayer = (p: Player) => {
    setEditingPlayer(p);
    setPlayerName(p.name);
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
      case 'pure_batter': return '🏏 Pure Batter';
      case 'wk_batter': return '🧤 Wicketkeeper Batter';
      case 'pace_allrounder': return '⚡ Pace All-Rounder';
      case 'spin_allrounder': return '🌀 Spin All-Rounder';
      case 'fast_bowler': return '🔥 Fast Bowler';
      case 'spin_bowler': return '🎯 Spin Bowler';
    }
  };

  const verifiedCount = team.players.filter(p => p.isAuthenticated).length;
  const captain = team.players.find(p => p.isCaptain);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-slate-900 border-2 border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div 
          className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 shrink-0"
          style={{
            background: `linear-gradient(135deg, ${team.primaryColor}12, #ffffff)`
          }}
        >
          <div className="flex items-center gap-3.5">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-200 bg-white"
            >
              {team.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-cabinet text-slate-950 leading-tight">{team.name}</h2>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-900 text-white">
                  {team.code}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {team.homeGround}</span>
                {captain && (
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Captain: <strong className="text-slate-800">{captain.name}</strong>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                  <FileBadge className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{verifiedCount}/{team.players.length} Certified</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === 'organizer' && (
              <button
                onClick={() => {
                  setEditingPlayer(null);
                  setPlayerName('');
                  setShowAddPlayer(true);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>Add Player</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[60vh] space-y-5">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by player name, jersey #, or tournament ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-full border-2 border-slate-900 bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 outline-none font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="border-2 border-slate-900 bg-slate-50 rounded-full px-3 py-2 text-slate-900 font-bold outline-none"
              >
                <option value="all">All Roles ({team.players.length})</option>
                <option value="pure_batter">Batters</option>
                <option value="wk_batter">Wicketkeepers</option>
                <option value="pace_allrounder">Pace All-rounders</option>
                <option value="spin_allrounder">Spin All-rounders</option>
                <option value="fast_bowler">Fast Bowlers</option>
                <option value="spin_bowler">Spin Bowlers</option>
              </select>

              <select
                value={authFilter}
                onChange={e => setAuthFilter(e.target.value as any)}
                className="border-2 border-slate-900 bg-slate-50 rounded-full px-3 py-2 text-slate-900 font-bold outline-none"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified Players</option>
                <option value="pending">Pending Auth</option>
              </select>
            </div>
          </div>

          {/* Player Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPlayers.map((player) => (
              <div 
                key={player.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                  player.isAuthenticated 
                    ? 'bg-slate-50 border-slate-900 shadow-[3px_3px_0px_#0f172a]' 
                    : 'bg-amber-50/50 border-dashed border-amber-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Photo Avatar */}
                  <div className="relative shrink-0">
                    <img 
                      src={player.photoUrl || player.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"}
                      alt={player.name}
                      className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-900 shadow"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[9px] font-mono font-bold">
                      #{player.jerseyNumber}
                    </span>
                  </div>

                  {/* Player Info */}
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{player.name}</h4>
                      {player.isCaptain && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-200">(C)</span>}
                      {player.isViceCaptain && <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">(VC)</span>}
                      {player.isWicketKeeper && <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">(WK)</span>}
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium truncate">
                      <span>{getRoleLabel(player.role)}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      ID: {player.idProofNumber || 'PENDING'}
                    </div>
                  </div>
                </div>

                {/* Verification Status & Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  {player.isAuthenticated ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pending Auth</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setAuthPlayerModal(player);
                        setUploadedPhoto(player.photoUrl || '');
                        setIdProofNum(player.idProofNumber || '');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] border border-slate-200 flex items-center gap-1 transition-colors"
                      title="Upload photo to authenticate player"
                    >
                      <Camera className="w-3 h-3 text-slate-600" />
                      <span>{player.isAuthenticated ? 'Edit Photo' : 'Certify'}</span>
                    </button>

                    {viewMode === 'organizer' && (
                      <button
                        onClick={() => startEditPlayer(player)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                        title="Edit Player Info"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* AUTHENTICATION & IMAGE UPLOAD MODAL */}
        {authPlayerModal && (
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
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-medium outline-none"
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
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Confirming authenticates that this player is eligible and rostered in compliance with tournament bylaws.
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

        {/* Add/Edit Player Modal */}
        {showAddPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl max-w-md w-full p-5 space-y-4 text-xs text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-base font-cabinet flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-amber-500" />
                  {editingPlayer ? 'Edit Squad Player' : 'Register New Squad Player'}
                </h4>
                <button onClick={() => setShowAddPlayer(false)} className="w-7 h-7 rounded-full bg-slate-100 neo-pill flex items-center justify-center font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePlayer} className="space-y-3">
                <div>
                  <label className="block font-bold mb-1">Player Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jasprit Bumrah"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Jersey Number</label>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      value={jerseyNum}
                      onChange={e => setJerseyNum(parseInt(e.target.value, 10) || 0)}
                      className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Player Role</label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value as PlayerRole)}
                      className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none"
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
                    <label className="block font-bold mb-1">Batting Style</label>
                    <select
                      value={battingStyle}
                      onChange={e => setBattingStyle(e.target.value as BattingStyle)}
                      className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none"
                    >
                      <option value="Right-hand Bat">Right-hand Bat</option>
                      <option value="Left-hand Bat">Left-hand Bat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Bowling Style</label>
                    <select
                      value={bowlingStyle}
                      onChange={e => setBowlingStyle(e.target.value as BowlingStyle)}
                      className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none"
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
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isCaptain}
                      onChange={e => setIsCaptain(e.target.checked)}
                      className="rounded text-cyan-600"
                    />
                    <span>Captain (C)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isViceCaptain}
                      onChange={e => setIsViceCaptain(e.target.checked)}
                      className="rounded text-cyan-600"
                    />
                    <span>Vice Captain (VC)</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
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
    </div>
  );
};
