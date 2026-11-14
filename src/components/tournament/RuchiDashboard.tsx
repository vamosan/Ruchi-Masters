import React, { useState } from 'react';
import { RuchiMastersHero } from './RuchiMastersHero';
import { MatchHighlightCarousel } from './MatchHighlightCarousel';
import { QuickFixturesTable } from '../fixtures/QuickFixturesTable';
import { 
  CricketHelmetIcon, 
  CricketBatIcon, 
  CricketBallIcon, 
  CricketPadsIcon, 
  CricketWicketsIcon, 
} from '../common/CricketIcons';
import { useTournament } from '../../context/TournamentContext';
import { 
  Users, 
  ShieldCheck, 
  Trophy, 
  Sparkles, 
  Flame, 
  Zap, 
  ArrowRight, 
  Crown, 
  Award,
  ChevronRight,
  TrendingUp,
  Calendar
} from 'lucide-react';

export const RuchiDashboard: React.FC = () => {
  const { tournament, teams, matches, setActiveTab } = useTournament();
  
  // Interactive Fan Poll State
  const [votedTeam, setVotedTeam] = useState<string | null>(null);
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({
    'team-1': 1420,
    'team-2': 1180,
    'team-3': 980,
    'team-4': 850
  });

  const handleVote = (teamId: string) => {
    if (votedTeam) return;
    setVotedTeam(teamId);
    setPollVotes(prev => ({
      ...prev,
      [teamId]: (prev[teamId] || 0) + 1
    }));
  };

  const totalPollVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. Main Editorial Sports Hero */}
      <RuchiMastersHero />

      {/* 2. Interactive Feature Action Hub (Pick'Em & Hall of Fame Showcase) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Fan Pick'Em Card */}
        <div 
          onClick={() => setActiveTab('pickem')}
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Fan Prediction Arena
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-cabinet text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <span>Make Match Predictions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-300 font-normal max-w-sm leading-relaxed">
              Predict match winners, top run scorers, and boundary counts to climb the spectator leaderboard.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform backdrop-blur-md">
            🔮
          </div>
        </div>

        {/* Hall of Fame Card */}
        <div 
          onClick={() => setActiveTab('halloffame')}
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Championship Legacy
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-cabinet text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
              <span>Hall of Fame (2022–26)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-300 font-normal max-w-sm leading-relaxed">
              Explore past tournament champions, victory celebrations, winning lineups, and certified match highlight reels.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform backdrop-blur-md">
            🏆
          </div>
        </div>

      </div>

      {/* 3. Fan Arena Poll & Tournament Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fan Predictions Poll Widget */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" />
                  Fan Sentiment
                </span>
                <span className="text-xs text-slate-400 font-medium">Predict Champion</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                🔥 {totalPollVotes.toLocaleString()} Total Votes Cast
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-cabinet tracking-tight text-white mb-2">
              Who will lift the <span className="text-amber-400">2026 Championship Trophy?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl leading-relaxed">
              Cast your vote and back your franchise! Track real-time spectator voting across Frankfurt.
            </p>

            {/* Voting Team Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {teams.slice(0, 4).map((team) => {
                const votes = pollVotes[team.id] || 450;
                const percent = Math.round((votes / (totalPollVotes || 1)) * 100);
                const isSelected = votedTeam === team.id;

                return (
                  <button
                    key={team.id}
                    onClick={() => handleVote(team.id)}
                    disabled={!!votedTeam}
                    className={`relative p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 shadow-sm'
                        : votedTeam
                        ? 'border-slate-800 bg-slate-900/60 opacity-70'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{team.logo}</span>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-white truncate font-cabinet">{team.name}</div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800">
                        <span className="text-xs font-mono text-cyan-300 font-semibold">{percent}%</span>
                        <span className="text-[10px] text-slate-400 font-mono">{votes}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-bold font-mono">
                        VOTED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Verified live tournament polling
            </span>
            <button
              onClick={() => setActiveTab('teams')}
              className="text-cyan-400 hover:underline font-semibold inline-flex items-center gap-1"
            >
              <span>Explore all franchises</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Tournament Metrics Radar */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
                Action Radar
              </span>
              <span className="text-xs font-mono font-medium text-slate-400">T20 METRICS</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-cabinet mt-2">
              Tournament Status
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live indicators across all franchises and venues.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                  🏆
                </span>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">Total Franchises</span>
                  <span className="text-sm font-bold text-slate-900 font-cabinet">{teams.length} Squads Active</span>
                </div>
              </div>
              <span className="font-mono font-semibold text-slate-700 text-xs">25/Team</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base">
                  🛡️
                </span>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">Roster Verification</span>
                  <span className="text-sm font-bold text-slate-900 font-cabinet">Captain Authenticated</span>
                </div>
              </div>
              <span className="font-mono font-semibold text-emerald-700 text-xs">100% OK</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-base">
                  ⚡
                </span>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">Match Schedule</span>
                  <span className="text-sm font-bold text-slate-900 font-cabinet">{matches.length} Total Matches</span>
                </div>
              </div>
              <span className="font-mono font-semibold text-cyan-700 text-xs">Group Stage</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('fixtures')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <span>View Complete Match Schedule</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 4. Franchises Gateway & Official Title Sponsor Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Franchises Gateway Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xl">
                  🛡️
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-cabinet">
                    40+ Tournament Franchises
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">8 Tournament Groups • 1000+ Registered Players</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 shrink-0">
                100% Certified
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Explore complete franchise rosters with player profiles, captain certificates, verified squads, and home grounds.
            </p>

            {/* Group Pills preview */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-4">
              {['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H'].map((grp) => (
                <button
                  key={grp}
                  onClick={() => setActiveTab('teams')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-center transition-all group"
                >
                  <span className="text-[11px] font-semibold text-slate-900 block group-hover:text-amber-600">{grp}</span>
                  <span className="text-[9px] text-slate-500 font-medium block">5 Teams</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full player search & captain auth available</span>
            </div>

            <button
              onClick={() => setActiveTab('teams')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Explore All 40 Squads ➔</span>
            </button>
          </div>
        </div>

        {/* Title Sponsor Spotlight Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-semibold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                Title Sponsor
              </span>
              <span className="text-[11px] font-medium text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                Official Partner
              </span>
            </div>

            {/* Sponsor Brand Display */}
            <div className="py-4 flex items-center justify-center">
              <img 
                src="/images/ruchi-sponsor.png" 
                alt="Ruchi Restaurant & Catering" 
                className="h-28 sm:h-32 md:h-36 w-auto max-w-full object-contain hover:scale-102 transition-transform duration-300"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-cabinet">
                Ruchi Restaurant & Catering
              </h3>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">
                Authentic Indian culinary excellence, premier tournament catering & official hospitality partner for the Ruchi Masters T20 2026 Championship.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1 text-emerald-700">
              <span>🍽️</span> Official Hospitality Partner
            </span>
            <span className="text-slate-500 font-medium">
              Frankfurt, Germany
            </span>
          </div>
        </div>

      </div>

      {/* 5. Match Highlights Carousel */}
      <MatchHighlightCarousel />

      {/* 6. Upcoming & Live Fixtures Table */}
      <QuickFixturesTable />

      {/* 7. Cricket Gear & Tournament Standards Banner */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 flex flex-wrap items-center justify-around gap-6 text-center shadow-xs">
        <div className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-xs">
            <CricketBatIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-900">Grade 1 Willow</span>
          <span className="text-[10px] text-slate-500">Official Tournament Bats</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-xs">
            <CricketBallIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-900">Turf Seamed Balls</span>
          <span className="text-[10px] text-slate-500">Kookaburra Red Seam</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-xs">
            <CricketHelmetIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-900">Titanium Helmets</span>
          <span className="text-[10px] text-slate-500">Player Safety Compliance</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-xs">
            <CricketPadsIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-900">High-Density Pads</span>
          <span className="text-[10px] text-slate-500">Pro Impact Protection</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-xs">
            <CricketWicketsIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-slate-900">LED Zing Bails</span>
          <span className="text-[10px] text-slate-500">Instant Wicket Flash</span>
        </div>
      </div>
    </div>
  );
};
