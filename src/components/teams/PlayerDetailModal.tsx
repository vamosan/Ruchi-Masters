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
  Trash2,
  Move,
  RotateCcw
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
  const [photoPosX, setPhotoPosX] = useState<number>(player.photoPosX ?? 50);
  const [photoPosY, setPhotoPosY] = useState<number>(player.photoPosY ?? 20);
  const [photoZoom, setPhotoZoom] = useState<number>(player.photoZoom ?? 1);
  const [isAdjustingPhoto, setIsAdjustingPhoto] = useState(false);
  const photoBoxRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [idProofNumber, setIdProofNumber] = useState(player.idProofNumber || '');

  const [isUploading, setIsUploading] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handlePhotoPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isAdjustingPhoto) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: photoPosX,
      origY: photoPosY,
    };
  };

  const handlePhotoPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isAdjustingPhoto || !dragRef.current || !photoBoxRef.current) return;
    const rect = photoBoxRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragRef.current.startX) / Math.max(1, rect.width)) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / Math.max(1, rect.height)) * 100;
    setPhotoPosX(Math.max(0, Math.min(100, dragRef.current.origX - dx * 1.4)));
    setPhotoPosY(Math.max(0, Math.min(100, dragRef.current.origY - dy * 1.4)));
  };

  const handlePhotoPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
  };

  // Handle Photo Selection
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const base64 = await processPlayerPhoto(file);
      setPhotoUrl(base64);
      setPhotoPosX(50);
      setPhotoPosY(20);
      setPhotoZoom(1);
      setIsAdjustingPhoto(true);
      
      // Auto-save photo immediately
      updatePlayer(team.id, {
        ...player,
        photoUrl: base64,
        photoPosX: 50,
        photoPosY: 20,
        photoZoom: 1,
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
      photoPosX: Math.round(photoPosX),
      photoPosY: Math.round(photoPosY),
      photoZoom: Number(photoZoom.toFixed(2)),
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
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200/80 shadow-2xl overflow-hidden my-auto text-slate-900">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
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

            {isAuthorized && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow"
                title="Remove Player from Squad"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Player</span>
              </button>
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
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Player Photo with Interactive Framing & Camera Overlay */}
              <div
                ref={photoBoxRef}
                onPointerDown={handlePhotoPointerDown}
                onPointerMove={handlePhotoPointerMove}
                onPointerUp={handlePhotoPointerUp}
                onPointerCancel={handlePhotoPointerUp}
                className={`relative group shrink-0 w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border shadow-md bg-slate-200 ${
                  isAdjustingPhoto
                    ? 'border-[#ff6a17] ring-2 ring-[#ff6a17]/40 cursor-grab active:cursor-grabbing touch-none select-none'
                    : 'border-slate-200'
                }`}
              >
                <img
                  src={photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80'}
                  alt={name}
                  draggable={false}
                  style={{
                    objectPosition: `${photoPosX}% ${photoPosY}%`,
                    transform: `scale(${photoZoom})`,
                    transformOrigin: `${photoPosX}% ${photoPosY}%`,
                  }}
                  className="w-full h-full object-cover"
                />

                {!isAdjustingPhoto && (
                  isAuthorized ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1 cursor-pointer"
                    >
                      <Camera className="w-8 h-8 text-amber-300" />
                      <span className="bg-slate-950/80 px-2.5 py-1 rounded-lg border border-white/20">{isUploading ? 'Compressing...' : 'Change Photo'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAuthModal(team.id)}
                      className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1"
                    >
                      <Lock className="w-6 h-6 text-amber-400" />
                      <span>Captain Login</span>
                    </button>
                  )
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
              <div className="space-y-2.5 flex-1 text-center sm:text-left">
                <div>
                  <h4 className="text-xl font-bold font-cabinet text-slate-950">{name}</h4>
                  <p className="text-xs font-medium text-slate-500">
                    {role.replace('_', ' ').toUpperCase()} • #{jerseyNumber}
                  </p>
                </div>

                {isAuthorized ? (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-amber-300" />
                      <span>Upload New Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAdjustingPhoto(prev => !prev)}
                      className={`px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isAdjustingPhoto
                          ? 'bg-[#ff6a17] text-[#090909] border-[#ff6a17]'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      <Move className="w-3.5 h-3.5" />
                      <span>{isAdjustingPhoto ? 'Done Positioning' : 'Move / Slide Pic'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal(team.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs inline-flex items-center gap-1.5 border border-slate-200"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Captain Login to Edit Player</span>
                  </button>
                )}

                <p className="text-[11px] text-slate-500 font-medium">
                  {isAdjustingPhoto
                    ? 'Drag inside the portrait or slide controls below, then click Save Changes.'
                    : 'Upload from phone camera/gallery and position the face cleanly inside the card frame.'}
                </p>
              </div>
            </div>

            {isAuthorized && isAdjustingPhoto && (
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-[11px] text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2">
                    <span className="w-16 shrink-0 font-semibold text-slate-500">Left–Right</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(photoPosX)}
                      onChange={(e) => setPhotoPosX(Number(e.target.value))}
                      className="w-full accent-[#ff6a17] cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="w-14 shrink-0 font-semibold text-slate-500">Up–Down</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(photoPosY)}
                      onChange={(e) => setPhotoPosY(Number(e.target.value))}
                      className="w-full accent-[#ff6a17] cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="w-10 shrink-0 font-semibold text-slate-500">Zoom</span>
                    <input
                      type="range"
                      min={1}
                      max={1.6}
                      step={0.05}
                      value={photoZoom}
                      onChange={(e) => setPhotoZoom(Number(e.target.value))}
                      className="w-full accent-[#ff6a17] cursor-pointer"
                    />
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPosX(50);
                      setPhotoPosY(20);
                      setPhotoZoom(1);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Framing</span>
                  </button>
                </div>
              </div>
            )}
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
                className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black flex items-center gap-1.5 transition-colors border-2 border-rose-300"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Player from Squad</span>
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
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4 text-amber-300" />
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
