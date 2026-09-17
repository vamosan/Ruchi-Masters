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
  CricketGlovesIcon 
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
  Share2
} from 'lucide-react';

export const RuchiDashboard: React.FC = () => {
  const { tournament, teams, matches, setActiveTab } = useTournament();
  
  // Interactive Fan Poll State for Fun Play Vibe
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
    <div className="space-y-8 pb-16">
      
      {/* 1. Main Sporty Hero Section */}
      <RuchiMastersHero />

      {/* 2. Interactive Feature Action Hub (Pick'Em + Social Studio CTAs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Fan Pick'Em Banner Tile */}
        <div 
          onClick={() => setActiveTab('pickem')}
          className="bg-gradient-to-r from-rose-950 via-slate-950 to-indigo-950 text-white p-6 rounded-3xl sport-card border-3 border-slate-950 shadow-[5px_5px_0px_#0f172a] hover:-translate-y-1.5 transition-all cursor-pointer group flex items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-xl bg-[#FF3366] text-white font-black text-xs sport-badge uppercase tracking-wider inline-flex items-center gap-1.5 shadow">
              <Flame className="w-3.5 h-3.5" />
              Fan Pick'Em Game
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-cabinet text-white group-hover:text-[#CCFF00] transition-colors">
              Make Match Predictions ➔
            </h3>
            <p className="text-xs text-slate-300 font-medium max-w-sm">
              Predict match winners, sixes, and project scores to climb the fan leaderboard & win badges.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#FF3366] text-white flex items-center justify-center text-3xl shrink-0 group-hover:rotate-12 transition-transform shadow-xl border-2 border-white/30">
            🔮
          </div>
        </div>

        {/* Social Poster Studio Banner Tile */}
        <div 
          onClick={() => setActiveTab('social')}
          className="bg-gradient-to-r from-cyan-950 via-slate-950 to-indigo-950 text-white p-6 rounded-3xl sport-card border-3 border-slate-950 shadow-[5px_5px_0px_#0f172a] hover:-translate-y-1.5 transition-all cursor-pointer group flex items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-xl bg-[#00F0FF] text-slate-950 font-black text-xs sport-badge uppercase tracking-wider inline-flex items-center gap-1.5 shadow">
              <Share2 className="w-3.5 h-3.5" />
              Social Media Studio
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-cabinet text-white group-hover:text-[#00F0FF] transition-colors">
              Story & Poster Studio ➔
            </h3>
            <p className="text-xs text-slate-300 font-medium max-w-sm">
              Export 9:16 Instagram Stories and 1:1 matchday lineup cards in 1 click for WhatsApp & Twitter.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#00F0FF] text-slate-950 flex items-center justify-center text-3xl shrink-0 group-hover:-rotate-12 transition-transform shadow-xl border-2 border-slate-950">
            📱
          </div>
        </div>

      </div>

      {/* 3. Interactive Fan Zone & Tournament Matchup Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fan Predictions / Who Will Win The Cup Arcade Widget */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 sport-card relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-[#FF3366] text-white font-black text-xs sport-badge uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a]">
                  <Flame className="w-3.5 h-3.5" />
                  Fan Arena
                </span>
                <span className="text-xs font-black text-slate-300">Predict Tournament Champion</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                🔥 {totalPollVotes.toLocaleString()} Live Fan Votes
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-cabinet tracking-tight text-white mb-2">
              Who will lift the <span className="text-[#CCFF00]">Ruchi Masters T20 Trophy?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Cast your vote and support your favorite franchise! Track real-time fan sentiment across the championship.
            </p>

            {/* Voting Team Tiles */}
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
                    className={'relative p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ' + (
                      isSelected
                        ? 'border-[#CCFF00] bg-[#CCFF00]/20 shadow-[0_0_15px_rgba(204,255,0,0.3)] scale-102'
                        : votedTeam
                        ? 'border-slate-800 bg-slate-900/60 opacity-80'
                        : 'border-slate-700 bg-slate-900/80 hover:border-[#00F0FF] hover:bg-slate-800 hover:-translate-y-1'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{team.logo}</span>
                      <span className="text-[11px] font-black font-mono text-slate-400">{team.code}</span>
                    </div>

                    <div>
                      <div className="font-black text-xs text-white truncate font-cabinet">{team.name}</div>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/50">
                        <span className="text-[11px] font-mono text-cyan-300 font-bold">{percent}%</span>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">{votes}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-[#CCFF00] text-slate-950 text-[9px] font-black font-mono">
                        VOTED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#CCFF00]" />
              Voting powered by verified tournament fan pulse
            </span>
            <button
              onClick={() => setActiveTab('teams')}
              className="text-[#00F0FF] hover:underline font-bold flex items-center gap-1"
            >
              <span>Explore all franchises</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Tournament Power Stats Badge */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 sport-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#FFE600] text-slate-950 font-black text-xs sport-pill uppercase tracking-wider">
                ⚡ Action Center
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">T20 PULSE</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 font-cabinet mt-2">
              Tournament Stats Radar
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Live metrics across all franchises and fixtures.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border-2 border-amber-300/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow">
                  🏆
                </span>
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block">Total Franchises</span>
                  <span className="text-sm font-black text-slate-900 font-cabinet">{teams.length} Squads Active</span>
                </div>
              </div>
              <span className="font-mono font-black text-amber-700 text-sm">25/Team</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#00F59B] text-slate-950 flex items-center justify-center font-black text-base shadow">
                  🛡️
                </span>
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block">Captain Verified</span>
                  <span className="text-sm font-black text-slate-900 font-cabinet">100% Real Players</span>
                </div>
              </div>
              <span className="font-mono font-black text-emerald-700 text-sm">Auth OK</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50/70 border-2 border-cyan-300/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#00F0FF] text-slate-950 flex items-center justify-center font-black text-base shadow">
                  ⚡
                </span>
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block">Matches Scheduled</span>
                  <span className="text-sm font-black text-slate-900 font-cabinet">{matches.length} Total Games</span>
                </div>
              </div>
              <span className="font-mono font-black text-cyan-700 text-sm">Stage 1</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('live')}
            className="w-full py-2.5 rounded-2xl bg-[#FF3366] text-white font-black text-xs sport-btn flex items-center justify-center gap-2 shadow-[3px_3px_0px_#0f172a]"
          >
            <span>Open Match Control & Scorer</span>
          </button>
        </div>

      </div>

      {/* 4. Franchises Quick Roster Hub */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 sport-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-cabinet">
                Tournament Franchises & Squads
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verified squad rosters with captain authentication and photo certificates. Click any card for full details.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('teams')}
            className="px-4 py-2.5 rounded-2xl bg-[#CCFF00] text-slate-950 font-black text-xs sport-btn flex items-center gap-1.5 shadow-[3px_3px_0px_#0f172a]"
          >
            <Users className="w-3.5 h-3.5" />
            <span>View All Squads & Photos ➔</span>
          </button>
        </div>

        {/* Sporty Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team) => {
            const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
            const verifiedCount = team.players.filter(p => p.isAuthenticated).length;

            return (
              <div
                key={team.id}
                onClick={() => {
                  setActiveTab('teams');
                }}
                className="p-5 rounded-3xl border-3 border-slate-950 bg-slate-50 hover:bg-amber-50/60 hover:-translate-y-1.5 transition-all cursor-pointer shadow-[4px_4px_0px_#0f172a] space-y-4 group relative overflow-hidden"
              >
                {/* Team Top Accent Bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: team.primaryColor || '#2563eb' }}
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 border-slate-900 shadow group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: (team.primaryColor || '#2563eb') + '25' }}
                    >
                      {team.logo}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 leading-tight text-base font-cabinet">{team.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase font-mono">{team.code}</span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[10px] font-bold text-amber-600">{team.group || 'Group A'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-300 sport-badge">
                    {team.players.length} Squad
                  </span>
                </div>

                <div className="pt-3 border-t-2 border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-slate-600 font-medium">
                      Captain: <strong className="text-slate-900">{captain?.name || team.managerName || 'TBD'}</strong>
                    </span>
                  </div>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{verifiedCount} Auth</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Match Highlights & Media Carousel */}
      <MatchHighlightCarousel />

      {/* 6. Upcoming & Live Fixtures Table */}
      <QuickFixturesTable />

      {/* 7. Sporty Cricket Equipment & Gear Banner */}
      <div className="bg-gradient-to-r from-cyan-50 via-white to-amber-50 rounded-3xl p-6 border-3 border-slate-950 shadow-[4px_4px_0px_#0f172a] flex flex-wrap items-center justify-around gap-6 text-center">
        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <div className="p-3.5 rounded-2xl bg-amber-100 sport-pill group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[2px_2px_0px_#0f172a]">
            <CricketBatIcon className="w-8 h-8 anim-bat" />
          </div>
          <span className="text-xs font-black text-slate-900">Grade 1 Willow</span>
          <span className="text-[10px] text-slate-500 font-medium">Tournament Match Bats</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <div className="p-3.5 rounded-2xl bg-rose-100 sport-pill group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-[2px_2px_0px_#0f172a]">
            <CricketBallIcon className="w-8 h-8 anim-ball-spin" />
          </div>
          <span className="text-xs font-black text-slate-900">Turf Stitched Balls</span>
          <span className="text-[10px] text-slate-500 font-medium">Kookaburra Red Seam</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <div className="p-3.5 rounded-2xl bg-blue-100 sport-pill group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[2px_2px_0px_#0f172a]">
            <CricketHelmetIcon className="w-8 h-8 anim-float" />
          </div>
          <span className="text-xs font-black text-slate-900">Titanium Helmets</span>
          <span className="text-[10px] text-slate-500 font-medium">Player Safety Compliance</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <div className="p-3.5 rounded-2xl bg-cyan-100 sport-pill group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-[2px_2px_0px_#0f172a]">
            <CricketPadsIcon className="w-8 h-8 anim-float-rev" />
          </div>
          <span className="text-xs font-black text-slate-900">High-Density Pads</span>
          <span className="text-[10px] text-slate-500 font-medium">Pro Impact Protection</span>
        </div>

        <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
          <div className="p-3.5 rounded-2xl bg-emerald-100 sport-pill group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[2px_2px_0px_#0f172a]">
            <CricketWicketsIcon className="w-8 h-8" />
          </div>
          <span className="text-xs font-black text-slate-900">LED Zing Bails</span>
          <span className="text-[10px] text-slate-500 font-medium">Instant Wicket Flash</span>
        </div>
      </div>
    </div>
  );
};
