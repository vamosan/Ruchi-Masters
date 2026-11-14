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
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
      {/* Header with Segmented Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
            <CricketWicketsIcon className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-cabinet">
              Match Schedule & Fixtures
            </h3>
            <span className="text-xs text-slate-500 font-normal">
              Total <strong className="text-slate-800 font-semibold">{matches.length} fixtures</strong> in Ruchi Masters T20
            </span>
          </div>
        </div>

        {/* Filter Pills (Mobbin-style) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {(['All', 'Group A', 'Group B'] as const).map(group => (
            <button
              key={group}
              onClick={() => setFilterType(group)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterType === group 
                  ? 'bg-white text-slate-900 shadow-xs font-semibold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Fixture Rows */}
      <div className="divide-y divide-slate-100 text-xs">
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
                setActiveTab('fixtures');
              }}
              className="py-3.5 px-3 hover:bg-slate-50 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-colors group"
            >
              {/* Teams & Emblem */}
              <div className="flex items-center gap-3.5 min-w-[240px]">
                <div className="flex items-center -space-x-2">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-xs border-2 border-white"
                    style={{ backgroundColor: tA?.primaryColor || '#2563eb' }}
                  >
                    {tA?.logo || '🦁'}
                  </div>
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-xs border-2 border-white"
                    style={{ backgroundColor: tB?.primaryColor || '#dc2626' }}
                  >
                    {tB?.logo || '🌊'}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors font-cabinet">
                    {tA?.code} <span className="text-slate-400 font-sans font-normal text-xs">vs</span> {tB?.code}
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    {tA?.shortName || tA?.name} vs {tB?.shortName || tB?.name}
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-normal text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[150px]">{match.venue}</span>
              </div>

              {/* Date & Day */}
              <div className="hidden sm:block font-mono text-slate-600 text-xs">
                {match.date} <span className="text-slate-400 font-sans">({dayName})</span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold font-mono ${
                  match.status === 'live' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' 
                    : match.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {match.status === 'live' ? '● LIVE' : match.time}
                </span>

                <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-500 flex items-center justify-center transition-colors">
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
