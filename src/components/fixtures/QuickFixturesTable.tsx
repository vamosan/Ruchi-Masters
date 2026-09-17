import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, Play, Trophy, Sparkles, MapPin } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { CricketBallIcon, CricketWicketsIcon } from '../common/CricketIcons';

export const QuickFixturesTable: React.FC = () => {
  const { matches, teams, setActiveMatchId, setActiveTab } = useTournament();
  const [filterType, setFilterType] = useState<'All' | 'Group A' | 'Group B'>('All');

  const getTeam = (id: string) => teams.find(t => t.id === id);

  const filteredMatches = matches.filter(m => {
    if (filterType === 'All') return true;
    const tA = getTeam(m.teamAId);
    const tB = getTeam(m.teamBId);
    return tA?.group === filterType || tB?.group === filterType;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 sport-card space-y-5 border-3 border-slate-950">
      {/* Table Header with Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 sport-pill shadow-[2px_2px_0px_#0f172a]">
            <CricketWicketsIcon className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-cabinet">
              Match Schedule & Fixture Arena
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Total <strong className="text-amber-600 font-mono font-bold">{matches.length} fixtures</strong> in Ruchi Masters T20
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-900 text-xs font-black">
          {(['All', 'Group A', 'Group B'] as const).map(group => (
            <button
              key={group}
              onClick={() => setFilterType(group)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filterType === group 
                  ? 'bg-slate-950 text-white shadow-[2px_2px_0px_#CCFF00]' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Match Rows List (Sporty Arcade Rows) */}
      <div className="divide-y-2 divide-slate-100 text-xs">
        {filteredMatches.map((match) => {
          const tA = getTeam(match.teamAId);
          const tB = getTeam(match.teamBId);
          const dateObj = new Date(match.date);
          const dayName = isNaN(dateObj.getTime()) ? 'Sunday' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <div
              key={match.id}
              onClick={() => {
                setActiveMatchId(match.id);
                setActiveTab('live');
              }}
              className="py-4 px-3 hover:bg-amber-50/50 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all group hover:scale-[1.005]"
            >
              {/* Match Flags & Title */}
              <div className="flex items-center gap-3.5 min-w-[240px]">
                <div className="flex items-center -space-x-2">
                  <div 
                    className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm shadow-md border-2 border-white"
                    style={{ backgroundColor: tA?.primaryColor || '#2563eb' }}
                  >
                    {tA?.logo || '🦁'}
                  </div>
                  <div 
                    className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm shadow-md border-2 border-white"
                    style={{ backgroundColor: tB?.primaryColor || '#dc2626' }}
                  >
                    {tB?.logo || '🌊'}
                  </div>
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm group-hover:text-amber-600 transition-colors font-cabinet">
                    {tA?.code} <span className="text-slate-400 font-sans font-bold">vs</span> {tB?.code}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {tA?.shortName || tA?.name} vs {tB?.shortName || tB?.name}
                  </div>
                </div>
              </div>

              {/* Venue & Stage */}
              <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-medium text-xs">
                <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span className="truncate max-w-[140px]">{match.venue}</span>
              </div>

              {/* Date & Day */}
              <div className="hidden sm:block font-mono text-slate-700 font-bold text-xs">
                {match.date} <span className="text-slate-400 font-sans font-medium">({dayName})</span>
              </div>

              {/* Status Badge & Time */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-xl text-[11px] font-black font-mono sport-badge ${
                  match.status === 'live' 
                    ? 'bg-[#FF3366] text-white animate-pulse' 
                    : match.status === 'completed'
                    ? 'bg-[#00F59B] text-slate-950'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  {match.status === 'live' ? '● LIVE' : match.time}
                </span>

                <span className="p-2 rounded-xl bg-slate-100 group-hover:bg-[#CCFF00] group-hover:text-slate-950 text-slate-600 transition-all border border-slate-300 group-hover:border-slate-950 shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
