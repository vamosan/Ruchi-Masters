import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Megaphone,
  Trophy,
  Users,
  Calendar,
  Layers
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { INITIAL_NEWS_STORIES, INITIAL_PREDICTION_POLL } from '../../data/initialData';
import { PredictionPoll } from '../../types/cricket';

export const TournamentFeed: React.FC = () => {
  const { tournament, teams, setActiveTab } = useTournament();

  const [poll, setPoll] = useState<PredictionPoll>(INITIAL_PREDICTION_POLL);
  const [selectedVoteTeamId, setSelectedVoteTeamId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (teamId: string) => {
    if (hasVoted) return;
    const newOptions = poll.options.map(opt => {
      const isChosen = opt.teamId === teamId;
      const votes = opt.votes + (isChosen ? 1 : 0);
      return { ...opt, votes };
    });
    const total = newOptions.reduce((acc, o) => acc + o.votes, 0);
    const withPercentages = newOptions.map(opt => ({
      ...opt,
      percentage: Math.round((opt.votes / total) * 100)
    }));

    setPoll({
      ...poll,
      totalVotes: total,
      options: withPercentages
    });
    setSelectedVoteTeamId(teamId);
    setHasVoted(true);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Featured Video & News Stories (Matching Screenshot) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Hero Featured Story Card with Video Overlay */}
          <div className="relative rounded-3xl overflow-hidden bg-[#1f1754] border border-indigo-700/50 group shadow-xl">
            <div className="h-64 sm:h-72 w-full relative overflow-hidden">
              <img 
                src={INITIAL_NEWS_STORIES[0].image}
                alt="Featured Story"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160f44] via-[#160f44]/60 to-transparent" />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 rounded-3xl bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl shadow-rose-900/60 group-hover:scale-110 transition-transform cursor-pointer border border-white/30 backdrop-blur-sm">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              </div>

              {/* Story Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-cyan-500 text-slate-950 shadow-md">
                  {INITIAL_NEWS_STORIES[0].category}
                </span>
              </div>
            </div>

            {/* Story Content */}
            <div className="p-6 space-y-2 relative -mt-6">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {INITIAL_NEWS_STORIES[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                {INITIAL_NEWS_STORIES[0].summary}
              </p>
              <div className="pt-2 text-xs text-indigo-400 font-semibold flex items-center gap-2">
                <span>{INITIAL_NEWS_STORIES[0].date}</span>
                <span>•</span>
                <span>By {INITIAL_NEWS_STORIES[0].author}</span>
              </div>
            </div>
          </div>

          {/* 2 Side-by-Side News Cards (Matching Screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INITIAL_NEWS_STORIES.slice(1).map((story) => (
              <div 
                key={story.id}
                className="rounded-3xl bg-[#1b1448] border border-indigo-800/60 overflow-hidden flex flex-col justify-between group hover:border-cyan-500/50 transition-all shadow-lg"
              >
                <div className="h-40 w-full relative overflow-hidden">
                  <img 
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b1448] via-transparent to-transparent" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-10 h-10 rounded-2xl bg-rose-600/90 text-white flex items-center justify-center shadow-lg border border-white/20">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-sm sm:text-base text-white line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-indigo-200/70 line-clamp-3 leading-relaxed">
                      {story.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-indigo-800/40 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider group-hover:underline cursor-pointer">
                      READ FULL STORY
                    </span>
                    <span className="text-[10px] text-indigo-400">{story.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pinned Tournament Notices */}
          <div className="bg-[#181145] p-6 rounded-3xl border border-indigo-800/50 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              Tournament Noticeboard & Certified Directives
            </h3>

            <div className="space-y-3">
              {tournament.announcements.map(ann => (
                <div key={ann.id} className="p-4 rounded-2xl bg-[#1f1754] border border-indigo-700/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ann.pinned && <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950">PINNED</span>}
                      <span className="font-bold text-white text-sm">{ann.title}</span>
                    </div>
                    <span className="text-[10px] text-indigo-400">{ann.date}</span>
                  </div>
                  <p className="text-indigo-200/80 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Interactive Prediction Poll (Matching Screenshot) */}
        <div className="space-y-6">
          
          {/* Prediction Poll Card */}
          <div className="bg-[#1e1650] border border-indigo-600/50 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> LIVE POLL
                </span>
                <h3 className="text-base font-black text-white leading-snug">
                  Time is running out! Predict who will win the Trophy
                </h3>
              </div>

              <button 
                onClick={() => handleVote(poll.options[0].teamId)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/20 shrink-0"
              >
                PLAY NOW
              </button>
            </div>

            {/* Teams Voting List with Progress Bars */}
            <div className="space-y-4 pt-1">
              {poll.options.map((option) => {
                const isSelected = selectedVoteTeamId === option.teamId;
                return (
                  <div 
                    key={option.teamId}
                    onClick={() => handleVote(option.teamId)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected 
                        ? 'bg-[#291e6b] border-cyan-400 shadow-md shadow-cyan-900/40' 
                        : 'bg-[#150e3b] border-indigo-800/60 hover:border-indigo-500'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{option.flag}</span>
                        <span>{option.teamName}</span>
                      </div>
                      <span className="font-mono text-cyan-300">{option.percentage}%</span>
                    </div>

                    {/* Progress Fill Bar */}
                    <div className="w-full h-2 bg-[#0e0a2b] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          isSelected ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-indigo-400 text-center font-medium">
              {hasVoted ? '✅ Your prediction recorded!' : `Total ${poll.totalVotes.toLocaleString()} votes casted across franchises`}
            </div>
          </div>

          {/* Quick Standings Snapshot Card */}
          <div className="bg-[#1b1448] border border-indigo-800/60 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Leaderboard Standings
              </h4>
              <button 
                onClick={() => setActiveTab('standings')}
                className="text-[11px] font-bold text-cyan-400 hover:underline"
              >
                View Full Table ➔
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {teams.slice(0, 4).map((t, idx) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-xl bg-[#150e3b] border border-indigo-900/60">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="text-slate-400 font-mono text-[11px]">{idx + 1}</span>
                    <span>{t.logo}</span>
                    <span className="truncate max-w-[130px]">{t.name}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300">
                    {8 - idx * 2} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 25-Player Squad Authentication CTA Card */}
          <div className="bg-gradient-to-br from-indigo-900/60 to-purple-950/80 border border-indigo-600/60 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Manager Authentication Suite
            </div>
            <p className="text-xs text-indigo-200/80 leading-relaxed">
              Every team is configured with certified 25-player squads. Upload headshot photos to verify player eligibility before matchday.
            </p>
            <button
              onClick={() => setActiveTab('teams')}
              className="w-full py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs shadow-lg shadow-cyan-400/20"
            >
              Verify 25-Player Squads ➔
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
