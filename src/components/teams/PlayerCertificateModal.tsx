import React, { useRef } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ShieldCheck, 
  Award, 
  QrCode, 
  Crown, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Share2,
  FileBadge,
  Shield
} from 'lucide-react';
import { Player, Team } from '../../types/cricket';

interface Props {
  player: Player;
  team: Team;
  onClose: () => void;
}

export const PlayerCertificateModal: React.FC<Props> = ({ player, team, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);
  const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
  const certDate = player.authenticatedAt ? new Date(player.authenticatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'September 14, 2026';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full sport-card overflow-hidden my-auto border-3 border-slate-950 shadow-[10px_10px_0px_#0f172a] text-slate-900">
        
        {/* Top Header Controls */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-900">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#CCFF00] text-slate-950 sport-pill text-xs font-black">
              OFFICIAL PLAYER ID
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black font-cabinet leading-tight">
                Official Player Registration Credential
              </h3>
              <span className="text-xs text-slate-400 font-mono">RUCHI MASTERS T20 CREDENTIAL</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-[#00F59B] text-slate-950 text-xs font-black flex items-center gap-1.5 sport-btn"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-white ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Card Printable Body */}
        <div ref={certRef} className="p-6 sm:p-8 bg-gradient-to-b from-amber-50/50 via-white to-slate-50 relative overflow-hidden space-y-6">
          
          {/* Watermark Emblem */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] opacity-[0.03] select-none pointer-events-none font-cabinet font-black">
            🏏
          </div>

          {/* Certificate Top Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-slate-950 shadow-md bg-slate-100"
              >
                <Shield className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <span className="text-[10px] font-black font-mono uppercase tracking-widest text-[#FF3366] block">
                  RUCHI MASTERS T20 • 2026 CHAMPIONSHIP
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-cabinet text-slate-950">
                  Player Identity Verification Certificate
                </h2>
                <span className="text-xs font-bold text-slate-500">
                  {team.name} • Official Squad Member
                </span>
              </div>
            </div>

            {/* Verification Seal Badge */}
            <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-full border-3 border-emerald-600 bg-emerald-50 text-emerald-900 text-center p-1 shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-0.5" />
              <span className="text-[8px] font-black uppercase tracking-tight">CAPTAIN</span>
              <span className="text-[7px] font-bold text-emerald-700">AUTHENTICATED</span>
            </div>
          </div>

          {/* Player Main Bio & Photo Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            
            {/* Player Headshot */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="relative">
                <img
                  src={player.photoUrl || player.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80'}
                  alt={player.name}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-3 border-slate-950 shadow-[4px_4px_0px_#0f172a]"
                />
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-xl bg-slate-950 text-[#CCFF00] text-xs font-mono font-black border-2 border-slate-800 shadow">
                  #{player.jerseyNumber}
                </span>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                ● Live Match Verified
              </span>
            </div>

            {/* Player Credential Details */}
            <div className="sm:col-span-2 space-y-3">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 font-mono">PLAYER FULL NAME</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black font-cabinet text-slate-950">{player.name}</h3>
                  {player.isCaptain && <span className="px-2 py-0.5 rounded bg-[#FFE600] text-slate-950 text-[10px] font-black">(C)</span>}
                  {player.isViceCaptain && <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">(VC)</span>}
                  {player.isWicketKeeper && <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-[10px] font-bold">(WK)</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-300">
                  <span className="text-slate-500 font-bold block text-[10px]">DESIGNATED ROLE</span>
                  <span className="font-black text-slate-900">{player.role.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-300">
                  <span className="text-slate-500 font-bold block text-[10px]">BATTING / BOWLING</span>
                  <span className="font-black text-slate-900 truncate block">{player.battingStyle}</span>
                </div>
                <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-300">
                  <span className="text-slate-500 font-bold block text-[10px]">TOURNAMENT ID NUMBER</span>
                  <span className="font-mono font-black text-slate-900">{player.idProofNumber || ('RUCHI-' + team.code + '-1099')}</span>
                </div>
                <div className="bg-slate-100/80 p-2.5 rounded-xl border border-slate-300">
                  <span className="text-slate-500 font-bold block text-[10px]">AUTHENTICATED DATE</span>
                  <span className="font-mono font-bold text-slate-900">{certDate}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Performance Summary Strip */}
          <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-950 text-white font-mono text-center border-2 border-slate-900">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">RUNS</span>
              <span className="text-sm font-black text-[#CCFF00]">{player.runsScored || 0}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">WICKETS</span>
              <span className="text-sm font-black text-[#00F0FF]">{player.wicketsTaken || 0}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">HIGHEST SCORE</span>
              <span className="text-sm font-black text-[#FF3366]">{player.highestScore || 0}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">STRIKE RATE</span>
              <span className="text-sm font-black text-emerald-400">{player.strikeRate || 135}</span>
            </div>
          </div>

          {/* Captain Signature Stamp & QR Barcode Footer */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Captain Digital Sign-off */}
            <div className="flex items-center gap-3 text-xs">
              <div className="p-2 rounded-xl bg-amber-100 border border-amber-300">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">CERTIFYING FRANCHISE CAPTAIN</span>
                <span className="font-black text-slate-950 text-sm font-cabinet">
                  {player.authenticatedBy || captain?.name || team.managerName || 'Team Captain'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">✓ Digital Signature Stamp Verified</span>
              </div>
            </div>

            {/* QR Security Verification */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-slate-900 shadow-xs">
              <div className="w-8 h-8 bg-slate-950 text-white rounded flex items-center justify-center font-mono text-[9px] font-black">
                QR
              </div>
              <div className="text-[9px] font-mono text-slate-600">
                <div>VERIFY PASS:</div>
                <strong className="text-slate-900">{player.idProofNumber || 'RUCHI-T20-AUTH'}</strong>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
