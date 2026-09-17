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
  Users
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { CricketBallIcon } from '../common/CricketIcons';

export const RuchiMastersHero: React.FC = () => {
  const { matches, teams, setActiveMatchId, setActiveTab, setViewMode } = useTournament();

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
      {/* 1. Main Sporty Hero Section */}
      <div className="relative bg-white rounded-3xl sport-card p-6 sm:p-10 lg:p-12 overflow-hidden bg-gradient-to-br from-white via-slate-50 to-amber-50/30">
        
        {/* Dynamic Background Energy Lines & Pattern */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-[#CCFF00]/20 via-[#00F0FF]/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-gradient-to-tr from-[#FF3366]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          
          {/* Fun Sporty Tags & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#CCFF00] sport-badge text-slate-950 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping inline-block"></span>
              <span>⚡ 2026 PRO EDITION</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F0FF] sport-badge text-slate-950 text-xs transform -rotate-1">
              <span>🔥 6 TOP FRANCHISES</span>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-950 text-amber-300 font-mono text-xs font-black shadow">
              <span>🏆 $100,000 CUP</span>
            </div>
          </div>

          {/* Big High-Energy Sport Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08] font-cabinet flex flex-wrap items-center gap-3">
              <span className="inline-block bg-[#CCFF00] text-slate-950 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-2xl sm:rounded-3xl sport-card transform -rotate-1 hover:rotate-0 transition-transform">
                Ruchi Masters
              </span>
              <span className="inline-block bg-[#00F0FF] text-slate-950 px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-2xl sm:rounded-3xl sport-card transform rotate-1 hover:rotate-0 transition-transform">
                T20 Cricket
              </span>
              <span className="inline-flex items-center hover:rotate-45 transition-transform cursor-pointer">
                <CricketBallIcon className="w-10 h-10 sm:w-16 sm:h-16" />
              </span>
            </h1>
            
            <p className="text-base sm:text-lg font-bold text-slate-700 max-w-2xl pt-2 leading-relaxed">
              The high-voltage cricket tournament hub! Experience 
              <span className="bg-[#FFE600] px-2 py-0.5 rounded-lg text-slate-950 font-black mx-1 border border-slate-900">ball-by-ball live scoring</span>, 
              verified 25-player franchise squad cards, automated ICC NRR standings, and live match analytics.
            </p>
          </div>

          {/* High Impact Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => {
                if (liveMatch) setActiveMatchId(liveMatch.id);
                setActiveTab('live');
              }}
              className="px-7 py-3.5 rounded-2xl bg-[#FF3366] sport-btn text-white font-black text-sm flex items-center gap-2.5 shadow-[4px_4px_0px_#0f172a]"
            >
              <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>
              <span>Enter Live Scorer</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className="px-7 py-3.5 rounded-2xl bg-[#CCFF00] sport-btn text-slate-950 font-black text-sm flex items-center gap-2 shadow-[4px_4px_0px_#0f172a]"
            >
              <Users className="w-4 h-4" />
              <span>Explore Squads</span>
            </button>

            <button
              onClick={() => setActiveTab('halloffame')}
              className="px-5 py-3.5 rounded-2xl bg-[#FFE600] sport-btn text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[4px_4px_0px_#0f172a]"
            >
              <Trophy className="w-4 h-4" />
              <span>🏆 Hall of Fame (2022-26)</span>
            </button>
          </div>

          {/* Sporty Mini Tickers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t-3 border-slate-900">
            <div className="bg-slate-50 p-3.5 rounded-2xl sport-card flex items-center gap-3">
              <span className="text-3xl">🦁</span>
              <div>
                <div className="text-lg font-black text-slate-950 leading-tight">6 Teams</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Pro Squads</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl sport-card flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <div>
                <div className="text-lg font-black text-slate-950 leading-tight">18 Games</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">T20 Schedule</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl sport-card flex items-center gap-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <div className="text-lg font-black text-slate-950 leading-tight">100% Auth</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Captain Certified</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl sport-card flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <div className="text-lg font-black text-slate-950 leading-tight">Champions</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Grand Trophy</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. High-Energy Sporty Live Match Arcade Box */}
      {liveMatch && (
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white sport-card border-3 border-slate-950 shadow-[6px_6px_0px_#CCFF00] space-y-6 relative overflow-hidden">
          
          {/* Subtle Sport Glow Backdrop */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Live Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF3366] text-white font-black text-xs uppercase tracking-wider animate-pulse border border-white/20">
                <span className="w-2 h-2 rounded-full bg-white"></span> LIVE MATCHDAY
              </span>
              <span className="text-xs font-bold text-slate-300">
                Match {liveMatch.matchNumber} • {liveMatch.stage} • 📍 {liveMatch.venue}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveMatchId(liveMatch.id);
                  setActiveTab('live');
                }}
                className="px-4 py-1.5 rounded-full bg-[#CCFF00] hover:bg-[#bbf000] text-slate-950 font-black text-xs sport-btn flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Launch Live Scorer ➔</span>
              </button>
            </div>
          </div>

          {/* Teams Showdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Team A Card */}
            <div className={`p-5 rounded-2xl border-2 transition-all ${
              battingTeam?.id === teamA?.id 
                ? 'bg-slate-900 border-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.2)]' 
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700">{teamA?.logo}</span>
                  <div>
                    <h3 className="font-black text-xl text-white flex items-center gap-2">
                      {teamA?.name}
                      {battingTeam?.id === teamA?.id && (
                        <span className="px-2 py-0.5 rounded bg-[#CCFF00] text-slate-950 text-[10px] font-black uppercase">Batting</span>
                      )}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono font-bold">{teamA?.code}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black font-mono text-[#CCFF00]">
                    {liveMatch.innings1?.totalRuns ?? 0}/{liveMatch.innings1?.totalWickets ?? 0}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-400">
                    {liveMatch.innings1?.oversCompletedStr ?? '0.0'} OVERS
                  </div>
                </div>
              </div>
            </div>

            {/* Team B Card */}
            <div className={`p-5 rounded-2xl border-2 transition-all ${
              battingTeam?.id === teamB?.id 
                ? 'bg-slate-900 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.2)]' 
                : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700">{teamB?.logo}</span>
                  <div>
                    <h3 className="font-black text-xl text-white flex items-center gap-2">
                      {teamB?.name}
                      {battingTeam?.id === teamB?.id && (
                        <span className="px-2 py-0.5 rounded bg-[#00F0FF] text-slate-950 text-[10px] font-black uppercase">Batting</span>
                      )}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono font-bold">{teamB?.code}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black font-mono text-[#00F0FF]">
                    {liveMatch.innings2?.totalRuns ?? 0}/{liveMatch.innings2?.totalWickets ?? 0}
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-400">
                    {liveMatch.innings2?.oversCompletedStr ?? '0.0'} OVERS
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Live Action Strip: Batter On Strike & Bowler */}
          {striker && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00]"></span>
                <span className="text-slate-400 font-bold">On Strike:</span>
                <strong className="text-white font-black">{striker.name}</strong>
                <span className="font-mono text-[#CCFF00]">({strikerStats?.runs ?? 0} off {strikerStats?.balls ?? 0}b)</span>
              </div>

              {nonStriker && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  <span className="text-slate-400 font-bold">Non-Striker:</span>
                  <strong className="text-slate-200 font-bold">{nonStriker.name}</strong>
                </div>
              )}

              {bowler && (
                <div className="flex items-center gap-2 sm:justify-end">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="text-slate-400 font-bold">Bowling:</span>
                  <strong className="text-cyan-300 font-black">{bowler.name}</strong>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 3. Sporty Four Core Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('fixtures')}
          className="bg-white rounded-3xl p-5 sport-card cursor-pointer hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#CCFF00] sport-pill flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📅
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 group-hover:text-cyan-700 transition-colors">Match Schedule</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">18 T20 fixtures with automated live state tracking.</p>
          </div>
          <span className="text-xs font-black text-slate-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Fixtures</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('teams')}
          className="bg-white rounded-3xl p-5 sport-card cursor-pointer hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#00F0FF] sport-pill flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            👥
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 group-hover:text-cyan-700 transition-colors">Franchise Squads</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">25 player trading cards, captains, and photo authentication.</p>
          </div>
          <span className="text-xs font-black text-slate-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Explore Teams</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('live')}
          className="bg-white rounded-3xl p-5 sport-card cursor-pointer hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FF3366] text-white sport-pill flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 group-hover:text-cyan-700 transition-colors">Live Scorer Console</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">Ball-by-ball commentary, extras, and wicket rotation.</p>
          </div>
          <span className="text-xs font-black text-slate-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Open Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div 
          onClick={() => setActiveTab('halloffame')}
          className="bg-white rounded-3xl p-5 sport-card cursor-pointer hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FFE600] sport-pill flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🏆
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 group-hover:text-cyan-700 transition-colors">Hall of Fame (2022-26)</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">Historic championship glory, winners gallery, photos & video reels.</p>
          </div>
          <span className="text-xs font-black text-slate-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Explore Champions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

    </div>
  );
};
