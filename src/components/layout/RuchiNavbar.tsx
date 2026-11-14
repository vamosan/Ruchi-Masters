import React from 'react';
import { 
  ShieldCheck, 
  Download, 
  Moon, 
  Sun, 
  Calendar, 
  Users, 
  Flame, 
  KeyRound, 
  Crown, 
  Trophy,
  Award
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { CricketBallIcon } from '../common/CricketIcons';

interface Props {
  themeMode: 'clean' | 'broadcast';
  setThemeMode: (mode: 'clean' | 'broadcast') => void;
}

export const RuchiNavbar: React.FC<Props> = ({ themeMode, setThemeMode }) => {
  const { 
    activeTab, 
    setActiveTab, 
    exportTournamentJson, 
    currentUser, 
    openAuthModal, 
  } = useTournament();

  const navLinks = [
    { id: 'overview', label: 'Overview', icon: <CricketBallIcon className="w-4 h-4" /> },
    { id: 'fixtures', label: 'Fixtures', icon: <Calendar className="w-4 h-4" /> },
    { id: 'teams', label: 'Teams & Squads', icon: <Users className="w-4 h-4" />, badge: '40' },
    { id: 'standings', label: 'Standings', icon: <Award className="w-4 h-4 text-emerald-500" /> },
    { id: 'stats', label: 'Stats & Caps', icon: <Award className="w-4 h-4 text-amber-500" /> },
    { id: 'halloffame', label: 'Hall of Fame', icon: <Trophy className="w-4 h-4 text-amber-500" />, badge: '2022-26' },
    { id: 'playoffs', label: 'Finals Tree', icon: <Trophy className="w-4 h-4 text-purple-500" /> },
    { id: 'pickem', label: "Pick'Em", icon: <Flame className="w-4 h-4 text-rose-500" /> },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      {/* Top Professional Ticker Strip */}
      <div className="bg-slate-950 text-white text-[11px] font-medium py-1.5 px-4 sm:px-6 flex items-center justify-between overflow-x-auto tracking-wider uppercase whitespace-nowrap">
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="font-mono">CHAMPIONSHIP HUB</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="text-slate-300 font-cabinet font-semibold">RUCHI MASTERS T20 2026</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-slate-400 font-mono text-[10px] hidden sm:flex">
          <span className="text-amber-300 font-semibold">🏆 2022-2026 ARCHIVE</span>
          <span>•</span>
          <span className="text-cyan-300 font-semibold">⚡ 40 FRANCHISES</span>
          <span>•</span>
          <span className="text-emerald-300 font-semibold">📍 FRANKFURT, GERMANY</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Sponsor */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xs group-hover:scale-105 transition-all">
            <CricketBallIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="shrink-0">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-950 font-cabinet">
                Ruchi Masters
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 font-bold text-[10px] tracking-wider font-mono">
                T20
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-emerald-600 font-bold">● 2026 Season</span>
              <span>•</span>
              <span className="text-slate-400">Frankfurt Ground</span>
            </div>
          </div>
        </div>

        {/* Center Segmented Navigation (Mobbin-style) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80 shrink-0">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`h-9 flex items-center gap-1.5 px-3.5 rounded-xl text-xs transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/80 font-medium'
                }`}
              >
                <span className="shrink-0">{link.icon}</span>
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin Suite for Admin Role */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('organizer')}
              className={`h-9 flex items-center gap-1.5 px-3.5 rounded-xl text-xs transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'organizer'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                  : 'text-amber-800 hover:bg-amber-100/80 font-semibold'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Admin Suite</span>
            </button>
          )}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* User / Team Auth Pill */}
          {currentUser.role === 'admin' ? (
            <button
              onClick={() => openAuthModal()}
              className="h-9 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0"
              title="Super Admin Active"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Admin Access</span>
            </button>
          ) : currentUser.role === 'team' ? (
            <button
              onClick={() => openAuthModal(currentUser.teamId)}
              className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0"
              title={'Logged in as ' + currentUser.teamName}
            >
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="max-w-[140px] truncate">{currentUser.teamName}</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="h-9 px-3.5 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Team Login</span>
            </button>
          )}

          {/* Backup & Export */}
          <button
            onClick={() => exportTournamentJson()}
            title="Download Tournament Backup JSON"
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 transition-colors shrink-0 shadow-xs"
          >
            <Download className="w-4 h-4 shrink-0" />
          </button>

        </div>

      </div>

      {/* Mobile Segmented Strip */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-3 py-2 bg-slate-50 border-t border-slate-200 text-xs no-scrollbar whitespace-nowrap">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`h-8 flex items-center gap-1.5 px-3 rounded-lg whitespace-nowrap shrink-0 text-xs transition-all ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 bg-white border border-slate-200 hover:text-slate-900'
              }`}
            >
              <span className="shrink-0">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          );
        })}

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('organizer')}
            className={`h-8 flex items-center gap-1.5 px-3 rounded-lg whitespace-nowrap shrink-0 text-xs transition-all ${
              activeTab === 'organizer'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-amber-800 bg-amber-50 border border-amber-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Admin</span>
          </button>
        )}
      </div>

    </header>
  );
};
