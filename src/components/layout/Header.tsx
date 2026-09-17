import React from 'react';
import { Trophy, Calendar, MapPin, Shield, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export const Header: React.FC<{ onOpenEditModal?: () => void }> = ({ onOpenEditModal }) => {
  const { tournament, teams, matches, viewMode, setActiveTab } = useTournament();

  const liveMatches = matches.filter(m => m.status === 'live');
  const completedMatches = matches.filter(m => m.status === 'completed');

  return (
    <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
      {/* Background Graphic & Turf Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none cricket-turf-bg" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Main Info */}
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                {tournament.edition}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {tournament.format} Format ({tournament.rules.oversPerInnings} Overs)
              </span>
              {liveMatches.length > 0 && (
                <button
                  onClick={() => setActiveTab('live')}
                  className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-600/90 text-white border border-rose-400 animate-pulse flex items-center gap-1.5 cursor-pointer hover:bg-rose-500"
                >
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  {liveMatches.length} LIVE MATCH IN PROGRESS
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {tournament.name}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {tournament.tagline} — {tournament.description}
            </p>

            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{tournament.startDate} to {tournament.endDate}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{tournament.location}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Shield className="w-4 h-4 text-sky-400" />
                <span>Organized by: {tournament.organizerName}</span>
              </div>
            </div>
          </div>

          {/* Quick Dashboard Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
            <div className="glass-card p-3.5 rounded-xl border border-slate-700 text-center hover:border-amber-500/50 transition-colors">
              <div className="text-2xl font-black text-amber-400">{teams.length}</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Teams</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-slate-700 text-center hover:border-emerald-500/50 transition-colors">
              <div className="text-2xl font-black text-emerald-400">{matches.length}</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Matches</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-slate-700 text-center hover:border-sky-500/50 transition-colors">
              <div className="text-2xl font-black text-sky-400">{completedMatches.length}</div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed</div>
            </div>
            <div className="glass-card p-3.5 rounded-xl border border-slate-700 text-center hover:border-purple-500/50 transition-colors">
              <div className="text-2xl font-black text-purple-400">
                {tournament.rules.superOverForTies ? 'YES' : 'NO'}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Super Over</div>
            </div>
          </div>
        </div>

        {/* Organizer Notice Banner if in organizer mode */}
        {viewMode === 'organizer' && (
          <div className="mt-6 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-amber-300 font-medium">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
              <span>
                <strong>Organizer Control Mode Active:</strong> You can score live matches, conduct coin toss, rotate bowlers, adjust squads, create fixtures, and export tournament records.
              </span>
            </div>
            {onOpenEditModal && (
              <button
                onClick={onOpenEditModal}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold tracking-tight shrink-0 shadow"
              >
                Edit Tournament Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
