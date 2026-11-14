import React from 'react';
import { 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Trophy, 
  Flame, 
  Zap, 
  Award, 
  ArrowRight, 
  Activity,
  Radio,
  Clock,
  TrendingUp,
  MapPin,
  ChevronRight,
  Users,
  Calendar,
  ExternalLink,
  Target
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { CricketBallIcon } from '../common/CricketIcons';

export const RuchiMastersHero: React.FC = () => {
  const { matches, teams, setActiveMatchId, setActiveTab } = useTournament();

  const liveMatch = matches.find(m => m.status === 'live') || matches[0];
  const teamA = teams.find(t => t.id === liveMatch?.teamAId);
  const teamB = teams.find(t => t.id === liveMatch?.teamBId);

  const curInnings = liveMatch?.currentInningsNumber === 1 ? liveMatch?.innings1 : liveMatch?.innings2;
  const battingTeam = liveMatch?.currentInningsNumber === 1 
    ? teams.find(t => t.id === liveMatch?.innings1?.battingTeamId)
    : teams.find(t => t.id === liveMatch?.innings2?.battingTeamId);
  const bowlingTeam = liveMatch?.currentInningsNumber === 1
    ? teams.find(t => t.id === liveMatch?.innings1?.bowlingTeamId)
    : teams.find(t => t.id === liveMatch?.innings2?.bowlingTeamId);

  const striker = battingTeam?.players.find(p => p.id === liveMatch?.liveStrikerId);
  const nonStriker = battingTeam?.players.find(p => p.id === liveMatch?.liveNonStrikerId);
  const bowler = bowlingTeam?.players.find(p => p.id === liveMatch?.liveBowlerId);

  const strikerStats = curInnings?.battingScorecard.find(b => b.playerId === liveMatch?.liveStrikerId);

  return (
    <div className="relative space-y-8">
      {/* 1. Main Editorial Sports Hero */}
      <div className="relative rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-sm">
        
        {/* Subtle Ambient Radial Backdrops */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          
          {/* Tournament Meta Strip & Title Sponsor */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wider uppercase font-mono shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>2026 Season Hub</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>40 Elite Franchises</span>
            </span>
            
            {/* Title Sponsor Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium">
              <span className="text-[10px] uppercase font-bold text-slate-400">Presented by</span>
              <img src="/images/ruchi-sponsor.png" alt="Ruchi Sponsor" className="h-4 object-contain" />
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200">Title Sponsor</span>
            </div>
          </div>

          {/* Clean Editorial Sports Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1] font-cabinet">
              The Official <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent">Ruchi Masters</span> T20 Championship
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              Frankfurt’s premier cricket tournament hub. Explore verified franchise rosters, real-time ball-by-ball scorecards, ICC automated standings, and the historic Championship Wall of Fame.
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('fixtures')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide shadow-sm transition-all duration-200"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Match Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs tracking-wide border border-slate-200/80 transition-all duration-200"
            >
              <Users className="w-4 h-4 text-slate-600" />
              <span>Explore Franchises</span>
            </button>

            <button
              onClick={() => setActiveTab('halloffame')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold text-xs tracking-wide border border-amber-200/80 transition-all duration-200"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Hall of Fame (2022-26)</span>
            </button>
          </div>

          {/* Clean Segmented Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="text-base font-bold text-slate-900 leading-tight font-cabinet">40+ Franchises</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">8 Regional Groups</div>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="text-base font-bold text-slate-900 leading-tight font-cabinet">18+ Matches</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Live & Scheduled</div>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
              <span className="text-2xl">📸</span>
              <div>
                <div className="text-base font-bold text-slate-900 leading-tight font-cabinet">Official Rosters</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Squad Photos & Auth</div>
              </div>
            </div>

            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-base font-bold text-slate-900 leading-tight font-cabinet">5th Edition Cup</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">2026 Glory</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Broadcast-Grade Live Match Score Widget */}
      {liveMatch && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
          
          {/* Subtle Glow Backdrop */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
                <span>Live Matchday</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Match {liveMatch.matchNumber} • {liveMatch.stage} • 📍 {liveMatch.venue}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (liveMatch) setActiveMatchId(liveMatch.id);
                  setActiveTab('fixtures');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>Full Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Teams Broadcast Showdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            
            {/* Team A Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              battingTeam?.id === teamA?.id 
                ? 'bg-slate-900/90 border-amber-500/50 shadow-sm' 
                : 'bg-slate-900/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-slate-800 border border-slate-700">{teamA?.logo}</span>
                  <div>
                    <h3 className="font-bold text-lg text-white font-cabinet flex items-center gap-2">
                      {teamA?.name}
                      {battingTeam?.id === teamA?.id && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">Batting</span>
                      )}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">{teamA?.code}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
                    {liveMatch.innings1?.totalRuns ?? 0}/{liveMatch.innings1?.totalWickets ?? 0}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {liveMatch.innings1?.oversCompletedStr ?? '0.0'} OVERS
                  </div>
                </div>
              </div>
            </div>

            {/* Team B Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              battingTeam?.id === teamB?.id 
                ? 'bg-slate-900/90 border-cyan-500/50 shadow-sm' 
                : 'bg-slate-900/40 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-slate-800 border border-slate-700">{teamB?.logo}</span>
                  <div>
                    <h3 className="font-bold text-lg text-white font-cabinet flex items-center gap-2">
                      {teamB?.name}
                      {battingTeam?.id === teamB?.id && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider">Batting</span>
                      )}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">{teamB?.code}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">
                    {liveMatch.innings2?.totalRuns ?? 0}/{liveMatch.innings2?.totalWickets ?? 0}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {liveMatch.innings2?.oversCompletedStr ?? '0.0'} OVERS
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Live Action Strip: Batter On Strike & Bowler */}
          {striker && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-slate-400 font-medium">On Strike:</span>
                <strong className="text-white font-semibold">{striker.name}</strong>
                <span className="font-mono text-amber-300">({strikerStats?.runs ?? 0} off {strikerStats?.balls ?? 0}b)</span>
              </div>

              {nonStriker && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  <span className="text-slate-400 font-medium">Non-Striker:</span>
                  <strong className="text-slate-300 font-medium">{nonStriker.name}</strong>
                </div>
              )}

              {bowler && (
                <div className="flex items-center gap-2 sm:justify-end">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-slate-400 font-medium">Bowling:</span>
                  <strong className="text-cyan-300 font-semibold">{bowler.name}</strong>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 3. Core Feature Cards (Mobbin-style Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setActiveTab('fixtures')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
            📅
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors font-cabinet">
              Match Schedule
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              18 T20 fixtures with automatic live matchday tracking.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Fixtures</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('teams')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
            👥
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors font-cabinet">
              Franchise Squads
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              40 team rosters, verified captain certificates & squad photos.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Explore Teams</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('standings')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
            📊
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors font-cabinet">
              Points & Standings
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Official group standings with automated ICC Net Run Rate (NRR).
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Standings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('halloffame')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
            🏆
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors font-cabinet">
              Hall of Fame (2022-26)
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Championship glory, winners podium, squad photos & video reels.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Wall of Glory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>

    </div>
  );
};
