import React from 'react';
import { 
  ShieldCheck, 
  Download, 
  Moon, 
  Sun, 
  Calendar, 
  Users, 
  Flame, 
  Share2, 
  KeyRound, 
  Crown, 
  Activity, 
  Trophy 
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
    { id: 'overview', label: 'Main Zone', icon: <CricketBallIcon className="w-4 h-4" /> },
    { id: 'halloffame', label: 'Hall of Fame', icon: <Trophy className="w-4 h-4 text-amber-500" />, badge: '2022-26' },
    { id: 'teams', label: 'Squads', icon: <Users className="w-4 h-4" />, badge: '40+' },
    { id: 'fixtures', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'pickem', label: "Pick'Em", icon: <Flame className="w-4 h-4 text-rose-500" />, badge: '50 PTS' },
    { id: 'social', label: 'Story Studio', icon: <Share2 className="w-4 h-4 text-cyan-500" /> },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b-3 border-slate-950 sticky top-0 z-40 shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
      {/* Top Sporty Match Bar Ticker */}
      <div className="bg-slate-950 text-white text-[11px] font-black py-1 px-4 flex items-center justify-between overflow-x-auto tracking-wider uppercase whitespace-nowrap">
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 text-[#CCFF00]">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping inline-block" />
            <span className="font-mono font-black">LIVE MATCHDAY</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-cabinet">RUCHI MASTERS T20 2026 CHAMPIONSHIP</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-slate-400 font-mono text-[10px] hidden sm:flex">
          <span className="text-amber-400 font-bold">🏆 2022-2025 HALL OF FAME</span>
          <span>•</span>
          <span className="text-cyan-400 font-bold">⚡ 18 FIXTURES</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">🛡️ SQUAD PHOTO AUTH</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Playful Sporty Brand Logo */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#CCFF00] sport-pill flex items-center justify-center group-hover:rotate-6 group-hover:scale-105 transition-all shadow-[3px_3px_0px_#0f172a]">
              <CricketBallIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white font-black animate-pulse">
              !
            </span>
          </div>

          <div className="shrink-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-black text-xl sm:text-2xl lg:text-3xl tracking-tight text-slate-950 font-cabinet">
                Ruchi Masters
              </span>
              <span className="px-2 py-0.5 rounded-xl bg-[#00F0FF] text-slate-950 font-black text-[11px] sm:text-xs sport-badge transform -rotate-2">
                T20
              </span>
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-rose-600 font-black">● 2026 CUP</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">CHAMPIONSHIP HUB</span>
            </div>
          </div>
        </div>

        {/* Center Sport Navigation Pills (Standardized height: h-10) */}
        <nav className="hidden lg:flex items-center gap-2 shrink-0">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={'h-10 flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-black transition-all border-2 whitespace-nowrap shrink-0 ' + (
                activeTab === link.id
                  ? 'bg-slate-950 text-white border-slate-950 shadow-[3px_3px_0px_#CCFF00]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:text-slate-950 hover:bg-white hover:border-slate-400'
              )}
            >
              <span className="shrink-0">{link.icon}</span>
              <span>{link.label}</span>
              {link.badge && (
                <span className={'text-[9px] px-1.5 py-0.5 rounded-md font-black ' + (
                  activeTab === link.id ? 'bg-[#CCFF00] text-slate-950' : 'bg-slate-200 text-slate-700'
                )}>
                  {link.badge}
                </span>
              )}
            </button>
          ))}

          {/* Organizer Suite Nav (ONLY VISIBLE FOR ADMIN) */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('organizer')}
              className={'h-10 flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-black transition-all border-2 whitespace-nowrap shrink-0 ' + (
                activeTab === 'organizer'
                  ? 'bg-[#FFE600] text-slate-950 border-slate-950 shadow-[3px_3px_0px_#0f172a]'
                  : 'bg-amber-50 text-amber-950 border-amber-200 hover:bg-amber-100 hover:border-amber-300'
              )}
            >
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
              <span>Admin Suite</span>
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Live Scorer CTA Button */}
          <button
            onClick={() => setActiveTab('live')}
            className={'h-10 px-3.5 sm:px-4 rounded-xl text-xs font-black flex items-center gap-2 border-2 border-slate-950 transition-all whitespace-nowrap shrink-0 ' + (
              activeTab === 'live'
                ? 'bg-[#FF3366] text-white shadow-[3px_3px_0px_#0f172a]'
                : 'bg-[#FF3366] hover:bg-[#e02657] text-white shadow-[2px_2px_0px_#0f172a]'
            )}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0"></span>
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span>Live Scorer</span>
          </button>

          {/* Team / Admin Auth Button */}
          {currentUser.role === 'admin' ? (
            <button
              onClick={() => openAuthModal()}
              className="h-10 px-3.5 rounded-xl bg-[#FFE600] hover:bg-[#ebd300] text-slate-950 text-xs font-black flex items-center gap-1.5 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] transition-all whitespace-nowrap shrink-0"
              title="Logged in as Super Admin. Click to manage or switch accounts."
            >
              <ShieldCheck className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Admin Access</span>
            </button>
          ) : currentUser.role === 'team' ? (
            <button
              onClick={() => openAuthModal(currentUser.teamId)}
              className="h-10 px-3.5 rounded-xl bg-[#CCFF00] hover:bg-[#bdf000] text-slate-950 text-xs font-black flex items-center gap-1.5 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] transition-all whitespace-nowrap shrink-0"
              title={'Logged in as ' + currentUser.teamName + ' Captain. Click to switch franchise.'}
            >
              <Crown className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-cabinet max-w-[150px] truncate">{currentUser.teamName} Captain</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="h-10 px-3.5 sm:px-4 rounded-xl bg-white hover:bg-[#CCFF00] text-slate-950 text-xs font-black flex items-center gap-2 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] transition-all whitespace-nowrap shrink-0"
            >
              <KeyRound className="w-4 h-4 text-slate-900 shrink-0" />
              <span>Team / Admin Login</span>
            </button>
          )}

          {/* Backup & Export */}
          <button
            onClick={() => exportTournamentJson()}
            title="Download Tournament Backup"
            className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-slate-900 transition-all shrink-0"
          >
            <Download className="w-4 h-4 shrink-0" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setThemeMode(themeMode === 'clean' ? 'broadcast' : 'clean')}
            className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center text-slate-900 transition-all shrink-0"
            title="Toggle Theme"
          >
            {themeMode === 'clean' ? <Moon className="w-4 h-4 text-indigo-600 shrink-0" /> : <Sun className="w-4 h-4 text-amber-500 shrink-0" />}
          </button>

        </div>

      </div>

      {/* Mobile Submenu Bar */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-3 py-2 bg-slate-100 border-t-2 border-slate-900 text-xs no-scrollbar whitespace-nowrap">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={'h-8 flex items-center gap-1.5 px-3 rounded-lg whitespace-nowrap shrink-0 text-xs font-black border-2 transition-all ' + (
              activeTab === link.id
                ? 'bg-slate-950 text-white border-slate-950 shadow-[2px_2px_0px_#CCFF00]'
                : 'text-slate-800 bg-white border-slate-300 hover:border-slate-900'
            )}
          >
            <span className="shrink-0">{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveTab('organizer')}
            className={'h-8 flex items-center gap-1.5 px-3 rounded-lg whitespace-nowrap shrink-0 text-xs font-black border-2 transition-all ' + (
              activeTab === 'organizer'
                ? 'bg-[#FFE600] text-slate-950 border-slate-950 shadow-[2px_2px_0px_#0f172a]'
                : 'text-amber-950 bg-amber-100 border-amber-300'
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800 shrink-0" />
            <span>Admin Suite</span>
          </button>
        )}
      </div>

    </header>
  );
};
