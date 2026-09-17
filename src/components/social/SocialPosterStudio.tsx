import React, { useState, useRef } from 'react';
import { 
  Download, 
  Share2, 
  Camera, 
  Layers, 
  Sparkles, 
  Flame, 
  Crown, 
  MapPin, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  X,
  Palette
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SocialPosterStudio: React.FC<Props> = ({ onClose }) => {
  const { matches, teams } = useTournament();

  const [aspectRatio, setAspectRatio] = useState<'story' | 'square'>('story'); // 9:16 vs 1:1
  const [templateType, setTemplateType] = useState<'matchday' | 'lineup' | 'winner'>('matchday');
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const posterRef = useRef<HTMLDivElement>(null);

  const selectedMatch = matches.find(m => m.id === selectedMatchId) || matches[0];
  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  const teamA = teams.find(t => t.id === selectedMatch?.teamAId) || teams[0];
  const teamB = teams.find(t => t.id === selectedMatch?.teamBId) || teams[1];

  const captain = selectedTeam?.players.find(p => p.isCaptain || p.id === selectedTeam?.captainId);

  const handleDownload = () => {
    window.print();
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 sport-card space-y-6 border-3 border-slate-950 shadow-[6px_6px_0px_#0f172a]">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-[#00F0FF] text-slate-950 font-black text-xs sport-badge uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a]">
              <Sparkles className="w-3.5 h-3.5" />
              Social Studio
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">INSTANT GRAPHIC EXPORTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-cabinet text-slate-950 mt-1">
            Matchday Story & Poster Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Export ready-to-share 9:16 Instagram Stories and 1:1 Matchday Posters for WhatsApp, Twitter, and social channels.
          </p>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-900">
          <button
            onClick={() => setAspectRatio('story')}
            className={'px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ' + (
              aspectRatio === 'story'
                ? 'bg-slate-950 text-white shadow-[2px_2px_0px_#CCFF00]'
                : 'text-slate-600 hover:text-slate-950'
            )}
          >
            📱 9:16 Story
          </button>
          <button
            onClick={() => setAspectRatio('square')}
            className={'px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ' + (
              aspectRatio === 'square'
                ? 'bg-slate-950 text-white shadow-[2px_2px_0px_#CCFF00]'
                : 'text-slate-600 hover:text-slate-950'
            )}
          >
            ⏹️ 1:1 Square
          </button>
        </div>
      </div>

      {/* Control Panel: Template Selector & Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-slate-900 text-xs">
        <div>
          <label className="block font-black uppercase text-slate-700 mb-1">Select Poster Type:</label>
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value as any)}
            className="w-full p-2 rounded-xl border-2 border-slate-900 bg-white font-bold outline-none cursor-pointer"
          >
            <option value="matchday">🔥 Matchday Clash Card</option>
            <option value="lineup">🛡️ Playing Squad Lineup Card</option>
            <option value="winner">🏆 Match Winner Celebration</option>
          </select>
        </div>

        <div>
          <label className="block font-black uppercase text-slate-700 mb-1">Target Match:</label>
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="w-full p-2 rounded-xl border-2 border-slate-900 bg-white font-bold outline-none cursor-pointer"
          >
            {matches.map(m => (
              <option key={m.id} value={m.id}>
                {m.title} ({m.date})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-black uppercase text-slate-700 mb-1">Target Franchise:</label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full p-2 rounded-xl border-2 border-slate-900 bg-white font-bold outline-none cursor-pointer"
          >
            {teams.map(t => (
              <option key={t.id} value={t.id}>
                {t.logo} {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Graphic Poster Canvas Preview */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-900 rounded-3xl border-3 border-slate-950 overflow-hidden relative">
        
        {/* Canvas Wrapper */}
        <div
          ref={posterRef}
          className={'w-full bg-slate-950 text-white rounded-3xl overflow-hidden border-3 border-white shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative flex flex-col justify-between transition-all duration-300 ' + (
            aspectRatio === 'story'
              ? 'max-w-sm aspect-[9/16] p-6'
              : 'max-w-md aspect-square p-6'
          )}
          style={{
            background: 'linear-gradient(145deg, #0a0e1a 0%, #15102a 60%, ' + (selectedTeam?.primaryColor || '#1e1b4b') + 'cc 100%)'
          }}
        >
          {/* Background Stadium Glow */}
          <div className="absolute inset-0 bg-radial from-[#CCFF00]/10 via-transparent to-black/80 pointer-events-none" />

          {/* Poster Top Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-ping" />
              <span className="text-[10px] font-black font-mono tracking-widest text-[#CCFF00] uppercase">
                RUCHI MASTERS T20
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white text-slate-950 text-[10px] font-mono font-black">
              2026 CUP
            </span>
          </div>

          {/* TEMPLATE 1: MATCHDAY CLASH */}
          {templateType === 'matchday' && (
            <div className="relative z-10 space-y-6 my-auto text-center">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#FF3366] text-white font-black text-[11px] font-mono uppercase tracking-wider">
                  🔥 MATCHDAY SHOWDOWN
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-cabinet text-white mt-2">
                  {selectedMatch?.title || 'Championship Match'}
                </h3>
              </div>

              {/* Clash Face-Off */}
              <div className="flex items-center justify-around gap-2 py-4">
                <div className="flex flex-col items-center space-y-1">
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl border-3 border-white shadow-xl"
                    style={{ backgroundColor: (teamA?.primaryColor || '#2563eb') + 'dd' }}
                  >
                    {teamA?.logo}
                  </div>
                  <span className="font-black text-sm font-cabinet">{teamA?.code}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[90px]">{teamA?.name}</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="px-2.5 py-1 rounded-xl bg-[#CCFF00] text-slate-950 font-black text-xs font-mono shadow">
                    VS
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold mt-1">T20 CLASH</span>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl border-3 border-white shadow-xl"
                    style={{ backgroundColor: (teamB?.primaryColor || '#dc2626') + 'dd' }}
                  >
                    {teamB?.logo}
                  </div>
                  <span className="font-black text-sm font-cabinet">{teamB?.code}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[90px]">{teamB?.name}</span>
                </div>
              </div>

              {/* Match Venue Details */}
              <div className="p-3 rounded-2xl bg-black/50 backdrop-blur border border-white/15 text-xs space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedMatch?.date} • {selectedMatch?.time}</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-slate-300 text-[11px]">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{selectedMatch?.venue}</span>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: SQUAD LINEUP */}
          {templateType === 'lineup' && (
            <div className="relative z-10 space-y-4 my-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{selectedTeam?.logo}</span>
                  <div>
                    <h3 className="font-black text-lg font-cabinet leading-tight">{selectedTeam?.name}</h3>
                    <span className="text-[10px] text-[#CCFF00] font-mono font-bold">SQUAD LINEUP 2026</span>
                  </div>
                </div>
                {captain && (
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px]">
                    (C) {captain.name.split(' ')[0]}
                  </span>
                )}
              </div>

              {/* Top 6 Squad Roster Grid */}
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {selectedTeam?.players.slice(0, 6).map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between p-1.5 px-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
                    <span className="font-bold flex items-center gap-2">
                      <span className="font-mono text-[#CCFF00] text-[10px]">#{p.jerseyNumber}</span>
                      <span className="truncate max-w-[140px]">{p.name}</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-300 uppercase">
                      {p.role.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEMPLATE 3: WINNER CELEBRATION */}
          {templateType === 'winner' && (
            <div className="relative z-10 space-y-4 my-auto text-center">
              <div className="w-16 h-16 rounded-full bg-[#CCFF00] text-slate-950 flex items-center justify-center text-3xl mx-auto shadow-xl">
                🏆
              </div>
              <div>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] font-mono">
                  MATCH VICTORY
                </span>
                <h3 className="text-2xl font-black font-cabinet text-white mt-1">
                  {selectedTeam?.name} WIN!
                </h3>
                <p className="text-xs text-amber-300 font-bold italic mt-0.5">
                  "{selectedTeam?.slogan || 'Play Bold, Strike Hard'}"
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/60 border border-white/20 text-xs font-mono text-[#00F0FF] font-bold">
                ⭐ PLAYER OF THE MATCH: {captain?.name || selectedTeam?.players[0]?.name}
              </div>
            </div>
          )}

          {/* Poster Bottom Footer */}
          <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>FOLLOW @RUCHIMASTERST20</span>
            <span className="text-[#CCFF00]">#RuchiMasters2026</span>
          </div>

        </div>

        {/* Exporter Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 rounded-2xl bg-[#CCFF00] hover:bg-[#b8e600] text-slate-950 font-black text-xs sport-btn flex items-center gap-2 shadow-[3px_3px_0px_#0f172a]"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res Graphic</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-950 font-black text-xs sport-btn flex items-center gap-1.5 shadow"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Share Card'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
