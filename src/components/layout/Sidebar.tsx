import React from 'react';
import { 
  Radio, 
  Calendar, 
  Users, 
  Sparkles, 
  Video, 
  Award, 
  Trophy, 
  ShieldCheck, 
  Layers,
  Search,
  Settings
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, viewMode, setViewMode, tournament, matches } = useTournament();

  const liveMatches = matches.filter(m => m.status === 'live');

  const navItems = [
    { id: 'live', label: 'Live scores', icon: Radio, dot: true, badge: liveMatches.length > 0 ? `${liveMatches.length}` : undefined },
    { id: 'fixtures', label: 'Series', icon: Calendar },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'overview', label: 'Features', icon: Sparkles },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'stats', label: 'Stats', icon: Award },
    { id: 'playoffs', label: `${tournament.season || '2026'} Finals`, icon: Trophy },
    ...(viewMode === 'organizer' ? [{ id: 'organizer', label: 'Organizer Hub', icon: ShieldCheck }] : [])
  ];

  return (
    <aside className="w-64 bg-[#140e3a] border-r border-indigo-800/40 min-h-screen p-5 flex flex-col justify-between shrink-0 select-none">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#140e3a] rounded-[14px] flex items-center justify-center text-xl">
              🏏
            </div>
          </div>
          <div>
            <h1 className="font-black text-xl tracking-wider text-white font-cabinet uppercase">
              CRICKET
            </h1>
            <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
              TOURNAMENT HUB
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-700/90 to-purple-800/80 text-white shadow-lg shadow-indigo-900/40 border border-indigo-500/50'
                    : 'text-indigo-200/70 hover:text-white hover:bg-indigo-900/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.dot && (
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-rose-500'}`} />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-indigo-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mode Switcher & Footer in Sidebar */}
      <div className="pt-4 border-t border-indigo-800/40 space-y-3">
        <div className="bg-[#1b1448] p-1 rounded-2xl border border-indigo-700/50 flex items-center text-[11px] font-bold">
          <button
            onClick={() => setViewMode('spectator')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              viewMode === 'spectator' ? 'bg-cyan-500 text-slate-950 font-black shadow' : 'text-indigo-300 hover:text-white'
            }`}
          >
            Fan View
          </button>
          <button
            onClick={() => {
              setViewMode('organizer');
              if (activeTab === 'overview') setActiveTab('organizer');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              viewMode === 'organizer' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow' : 'text-indigo-300 hover:text-white'
            }`}
          >
            Manager
          </button>
        </div>

        <div className="text-[10px] text-indigo-400 text-center">
          {tournament.name} • {tournament.edition}
        </div>
      </div>
    </aside>
  );
};
