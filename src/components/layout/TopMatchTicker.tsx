import React from 'react';
import { CloudRain, Radio, CheckCircle2, Trophy, Globe, Search, ChevronDown, Bell } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export const TopMatchTicker: React.FC = () => {
  const { matches, teams, setActiveMatchId, setActiveTab, tournament } = useTournament();

  const getTeam = (id: string) => teams.find(t => t.id === id);

  return (
    <div className="space-y-4">
      {/* Top Search & Edition bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="w-4 h-4 text-indigo-300 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search teams, players, matches, venues..."
            className="w-full bg-[#1b1448] border border-indigo-700/60 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-indigo-300/50 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto text-xs">
          <div className="flex items-center gap-2 bg-[#1b1448] border border-indigo-700/60 px-3 py-1.5 rounded-2xl text-indigo-200 cursor-pointer hover:border-cyan-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{tournament.edition}</span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
          </div>

          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 p-0.5 shadow-md flex items-center justify-center font-bold text-slate-950 text-xs cursor-pointer">
            🏆
          </div>
        </div>
      </div>

      {/* Horizontal Match Cards Row matching Screenshot */}
      <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none">
        
        {/* Card 1: Rain Delayed Match */}
        <div 
          onClick={() => {
            setActiveMatchId('m-104');
            setActiveTab('live');
          }}
          className="min-w-[210px] sm:min-w-[220px] bg-gradient-to-br from-rose-950/80 to-purple-950/80 border border-rose-500/40 rounded-2xl p-3.5 text-xs space-y-2 cursor-pointer hover:scale-[1.02] transition-all shadow-md shrink-0"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-300">
            <CloudRain className="w-3 h-3 text-rose-400 animate-bounce-short" />
            <span>Match Delayed By Rain</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between font-bold text-white">
              <div className="flex items-center gap-1.5">
                <span>🔥</span>
                <span>BB</span>
              </div>
              <span className="font-mono text-slate-200">29/2 (7.3 ov)</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-1.5">
                <span>⚡</span>
                <span>TCC</span>
              </div>
              <span className="text-[10px] text-slate-400">Yet to bat</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tournament Edition Badge Card (Cyan) */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="min-w-[130px] bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl p-3.5 text-slate-950 flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20 shrink-0 font-cabinet"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-900/80">
            CHAMPIONS
          </span>
          <div className="font-black text-sm leading-tight uppercase">
            {tournament.name.split(' ')[0]} {tournament.season}
          </div>
          <span className="text-[9px] font-bold text-slate-900">
            {tournament.format} Trophy ➔
          </span>
        </div>

        {/* Card 3: Live Score Card (White/Dark high-contrast) */}
        <div 
          onClick={() => {
            setActiveMatchId('m-103');
            setActiveTab('live');
          }}
          className="min-w-[240px] sm:min-w-[250px] bg-slate-100 text-slate-900 rounded-2xl p-3.5 text-xs space-y-2 cursor-pointer hover:scale-[1.02] transition-all shadow-lg shrink-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-600">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              <span>Live - Updates only</span>
            </div>
            <span className="text-[9px] font-bold text-slate-500 uppercase">Match 3</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between font-extrabold text-slate-900">
              <div className="flex items-center gap-1.5">
                <span>🌊</span>
                <span>MM</span>
              </div>
              <span className="font-mono">185/6 (20.0)</span>
            </div>

            <div className="flex items-center justify-between font-extrabold text-indigo-900">
              <div className="flex items-center gap-1.5">
                <span>🦁</span>
                <span>RS</span>
              </div>
              <span className="font-mono text-emerald-700">174/4 (18.2 ov)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Knockout / Special Cup Card (Magenta) */}
        <div 
          onClick={() => setActiveTab('playoffs')}
          className="min-w-[130px] bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl p-3.5 text-white flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-all shadow-lg shadow-pink-600/20 shrink-0"
        >
          <span className="text-[10px] font-bold uppercase text-pink-200">
            PLAYOFFS
          </span>
          <div className="font-black text-sm leading-tight">
            GRAND FINAL
          </div>
          <span className="text-[9px] font-bold text-pink-100">
            Sep 28 Gala 🏆
          </span>
        </div>

        {/* Card 5: Result Card */}
        <div 
          onClick={() => {
            setActiveMatchId('m-101');
            setActiveTab('live');
          }}
          className="min-w-[210px] bg-[#1d164d] border border-emerald-500/40 rounded-2xl p-3.5 text-xs space-y-2 cursor-pointer hover:scale-[1.02] transition-all shadow shrink-0"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Result • Match 1</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between font-bold text-white">
              <div className="flex items-center gap-1.5">
                <span>🦁</span>
                <span>RS</span>
              </div>
              <span className="font-mono text-emerald-400">196/5</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <div className="flex items-center gap-1.5">
                <span>👑</span>
                <span>CC</span>
              </div>
              <span className="font-mono text-slate-400">178/8 (20 ov)</span>
            </div>
          </div>
        </div>

        {/* Card 6: Edition Selector Pill (Yellow) */}
        <div 
          onClick={() => setActiveTab('stats')}
          className="min-w-[120px] bg-amber-400 rounded-2xl p-3.5 text-slate-950 flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-all shadow-md shrink-0"
        >
          <span className="text-[10px] font-bold text-slate-800 uppercase">
            HONORS
          </span>
          <div className="font-black text-sm leading-tight">
            TOP CAPS
          </div>
          <span className="text-[9px] font-bold text-slate-900">
            Orange & Purple ➔
          </span>
        </div>

      </div>
    </div>
  );
};
