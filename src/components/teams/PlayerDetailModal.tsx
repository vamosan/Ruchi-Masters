import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Save, 
  Check, 
  ShieldCheck, 
  User, 
  Crown, 
  Sparkles,
  Edit3,
  Lock,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { Player, Team, PlayerRole, BattingStyle, BowlingStyle } from '../../types/cricket';
import { useTournament } from '../../context/TournamentContext';
import { processPlayerPhoto } from '../../utils/imageUtils';

interface Props {
  player: Player;
  team: Team;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<Props> = ({ player, team, onClose }) => {
  const { updatePlayer, deletePlayer, canEditTeam, openAuthModal, currentUser } = useTournament();
  const isAuthorized = canEditTeam(team.id);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState(player.name);
  const [jerseyNumber, setJerseyNumber] = useState(player.jerseyNumber);
  const [role, setRole] = useState<PlayerRole>(player.role);
  const [battingStyle, setBattingStyle] = useState<BattingStyle>(player.battingStyle || 'Right-hand Bat');
  const [bowlingStyle, setBowlingStyle] = useState<BowlingStyle>(player.bowlingStyle || 'Right-arm medium');
  const [isCaptain, setIsCaptain] = useState(player.isCaptain || false);
  const [isViceCaptain, setIsViceCaptain] = useState(player.isViceCaptain || false);
  const [isWicketKeeper, setIsWicketKeeper] = useState(player.isWicketKeeper || false);
  const [photoUrl, setPhotoUrl] = useState(player.photoUrl || '');
  const [idProofNumber, setIdProofNumber] = useState(player.idProofNumber || '');

  const [isUploading, setIsUploading] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Handle Photo Selection
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64 = await processPlayerPhoto(file);
      setPhotoUrl(base64);
      
      // Auto-save photo immediately
      updatePlayer(team.id, {
        ...player,
        photoUrl: base64,
        isAuthenticated: true,
        authenticatedAt: new Date().toISOString()
      });
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to compress/save photo', err);
      alert('Could not process this image. Please try another image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      openAuthModal(team.id);
      return;
    }

    updatePlayer(team.id, {
      ...player,
      name,
      jerseyNumber: Number(jerseyNumber) || 1,
      role,
      battingStyle,
      bowlingStyle,
      isCaptain,
      isViceCaptain,
      isWicketKeeper,
      photoUrl,
      idProofNumber,
      isAuthenticated: true
    });

    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 600);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${player.name} from ${team.name}?`)) {
      deletePlayer(team.id, player.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full sport-card overflow-hidden my-auto border-3 border-slate-950 shadow-[10px_10px_0px_#0f172a] text-slate-900">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-xs text-white border border-white/30"
              style={{ backgroundColor: team.primaryColor || '#0284c7' }}
            >
              #{jerseyNumber}
            </div>
            <div>
              <h3 className="text-lg font-black font-cabinet leading-tight">
                {name || 'Player Profile'}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {team.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedFeedback && (
              <span className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-7 space-y-6">
          
          {/* Main Photo & Identification Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 border-2 border-slate-900">
            
            {/* Player Photo with Camera Overlay */}
            <div className="relative group shrink-0">
              <img
                src={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80'}
                alt={name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-3 border-slate-950 shadow-md bg-slate-200"
              />

              {isAuthorized ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-black gap-1 cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-[#CCFF00]" />
                  <span>{isUploading ? 'Compressing...' : 'Change Photo'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal(team.id)}
                  className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-black gap-1"
                >
                  <Lock className="w-5 h-5 text-amber-400" />
                  <span>Captain Login</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Photo Action & Status */}
            <div className="space-y-2 flex-1 text-center sm:text-left">
              <div>
                <h4 className="text-xl font-black font-cabinet text-slate-950">{name}</h4>
                <p className="text-xs font-bold text-slate-500">
                  {role.replace('_', ' ').toUpperCase()} • #{jerseyNumber}
                </p>
              </div>

              {isAuthorized ? (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#CCFF00] hover:bg-[#b8e600] text-slate-950 font-black text-xs flex items-center gap-1.5 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload New Photo</span>
                  </button>

                  <span className="text-[11px] text-slate-500 font-medium">
                    Upload from phone camera or gallery
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal(team.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#CCFF00] text-slate-950 font-black text-xs inline-flex items-center gap-1.5 border border-slate-300"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Captain Login to Edit Player</span>
                </button>
              )}
            </div>
          </div>

          {/* Editable Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Player Full Name *
              </label>
              <input
                type="text"
                required
                disabled={!isAuthorized}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white disabled:bg-slate-100 disabled:text-slate-500 font-bold text-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Jersey Number *
              </label>
              <input
                type="number"
                min={0}
                max={999}
                required
                disabled={!isAuthorized}
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white disabled:bg-slate-100 disabled:text-slate-500 font-mono font-bold text-xs outline-none"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Playing Role *
              </label>
              <select
                disabled={!isAuthorized}
                value={role}
                onChange={(e) => setRole(e.target.value as PlayerRole)}
                className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white disabled:bg-slate-100 font-bold text-xs outline-none"
              >
                <option value="pure_batter">Pure Batter</option>
                <option value="wk_batter">Wicketkeeper Batter</option>
                <option value="pace_allrounder">Pace All-Rounder</option>
                <option value="spin_allrounder">Spin All-Rounder</option>
                <option value="fast_bowler">Fast Bowler</option>
                <option value="spin_bowler">Spin Bowler</option>
              </select>
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Batting Style
              </label>
              <select
                disabled={!isAuthorized}
                value={battingStyle}
                onChange={(e) => setBattingStyle(e.target.value as BattingStyle)}
                className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white disabled:bg-slate-100 font-bold text-xs outline-none"
              >
                <option value="Right-hand Bat">Right-hand Bat</option>
                <option value="Left-hand Bat">Left-hand Bat</option>
              </select>
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Bowling Style
              </label>
              <select
                disabled={!isAuthorized}
                value={bowlingStyle}
                onChange={(e) => setBowlingStyle(e.target.value as BowlingStyle)}
                className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white disabled:bg-slate-100 font-bold text-xs outline-none"
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

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                Tournament Player ID
              </label>
              <input
                type="text"
                disabled={!isAuthorized}
                value={idProofNumber}
                onChange={(e) => setIdProofNumber(e.target.value)}
                placeholder="Official ID"
                className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white disabled:bg-slate-100 font-mono font-bold text-xs outline-none"
              />
            </div>
          </div>

          {/* Captain / Roles Checkboxes */}
          {isAuthorized && (
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                <input
                  type="checkbox"
                  checked={isCaptain}
                  onChange={(e) => setIsCaptain(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-950"
                />
                <span>Team Captain (C)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                <input
                  type="checkbox"
                  checked={isViceCaptain}
                  onChange={(e) => setIsViceCaptain(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-950"
                />
                <span>Vice Captain (VC)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                <input
                  type="checkbox"
                  checked={isWicketKeeper}
                  onChange={(e) => setIsWicketKeeper(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-950"
                />
                <span>Wicketkeeper (WK)</span>
              </label>
            </div>
          )}

          {/* Performance Stats Strip */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-black uppercase text-slate-500 font-mono block mb-2">
              Tournament Career Statistics
            </span>
            <div className="grid grid-cols-5 gap-2 text-center font-mono">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">MATCHES</span>
                <span className="text-sm font-black text-slate-900">{player.matchesPlayed || 0}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">RUNS</span>
                <span className="text-sm font-black text-slate-900">{player.runsScored || 0}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">WICKETS</span>
                <span className="text-sm font-black text-purple-700">{player.wicketsTaken || 0}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">HIGH SCORE</span>
                <span className="text-sm font-black text-slate-900">{player.highestScore || 0}</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">STRIKE RATE</span>
                <span className="text-sm font-black text-emerald-700">{player.strikeRate || 0}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
            {isAuthorized ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Player</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs border border-slate-300 transition-colors"
              >
                Close
              </button>

              {isAuthorized && (
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#00F59B] hover:bg-[#00e08d] text-slate-950 font-black text-xs flex items-center gap-1.5 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
