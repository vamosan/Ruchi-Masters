import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Flame, 
  Zap, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  Target
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import confetti from 'canvas-confetti';

interface Props {
  onClose?: () => void;
}

export const MatchdayPickEm: React.FC<Props> = ({ onClose }) => {
  const { matches, teams } = useTournament();

  const [userPredictions, setUserPredictions] = useState<Record<string, string>>({
    'pred-m1-winner': 'team-1',
    'pred-m1-sixes': '11-18 Sixes',
    'pred-m1-runs': '161-190 Runs'
  });

  const [scorePoints, setScorePoints] = useState(380);
  const [submittedMatches, setSubmittedMatches] = useState<Record<string, boolean>>({ 'match-1': true });

  const getTeam = (id: string) => teams.find(t => t.id === id);

  const handlePredict = (key: string, value: string) => {
    setUserPredictions(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmitMatchPrediction = (matchId: string) => {
    setSubmittedMatches(prev => ({ ...prev, [matchId]: true }));
    setScorePoints(prev => prev + 50);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const nextMatch = matches[0] || {
    id: 'match-1',
    teamAId: teams[0]?.id || 'team-1',
    teamBId: teams[1]?.id || 'team-2',
    date: '2026-09-15',
    time: '19:30 IST',
    venue: 'Frankfurt Cricket Ground',
    title: 'Match 1 • Group A'
  };

  const teamA = getTeam(nextMatch.teamAId) || teams[0];
  const teamB = getTeam(nextMatch.teamBId) || teams[1];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 pb-20">
      
      {/* Pick'Em Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              Fan Prediction Arena
            </span>
            <span className="text-xs font-mono font-medium text-slate-400">2026 CHALLENGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-cabinet text-slate-950 mt-1">
            Matchday Predictions & Streaks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Lock in your predictions before toss time, climb the fan leaderboard, and unlock digital badges!
          </p>
        </div>

        {/* User Prediction Stats */}
        <div className="flex items-center gap-3 bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 shadow-xs shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg">
            🏆
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block font-medium">PREDICTION SCORE</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold font-mono text-amber-300">{scorePoints} PTS</span>
              <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">3 Streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Match Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-md space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Match Info Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold text-xs tracking-wide">
            ⚡ FEATURED CLASH • {nextMatch.title || 'Match 1'}
          </span>
          <span className="text-xs font-mono text-slate-300">
            📅 {nextMatch.date} • ⏰ {nextMatch.time} • 📍 {nextMatch.venue}
          </span>
        </div>

        {/* Head-to-Head Clash */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          
          {/* Team A Option */}
          <button
            onClick={() => handlePredict('pred-' + nextMatch.id + '-winner', teamA?.id || 'team-1')}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
              userPredictions['pred-' + nextMatch.id + '-winner'] === teamA?.id
                ? 'border-amber-400 bg-amber-500/15 shadow-sm'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{teamA?.logo}</span>
              <div>
                <span className="text-xs font-mono text-slate-400 block font-medium">{teamA?.code}</span>
                <span className="text-base font-bold font-cabinet text-white block">{teamA?.name}</span>
                <span className="text-xs text-amber-300 font-semibold">62% Fans Picked</span>
              </div>
            </div>
            {userPredictions['pred-' + nextMatch.id + '-winner'] === teamA?.id && (
              <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                ✓
              </span>
            )}
          </button>

          {/* Team B Option */}
          <button
            onClick={() => handlePredict('pred-' + nextMatch.id + '-winner', teamB?.id || 'team-2')}
            className={`p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
              userPredictions['pred-' + nextMatch.id + '-winner'] === teamB?.id
                ? 'border-cyan-400 bg-cyan-500/15 shadow-sm'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{teamB?.logo}</span>
              <div>
                <span className="text-xs font-mono text-slate-400 block font-medium">{teamB?.code}</span>
                <span className="text-base font-bold font-cabinet text-white block">{teamB?.name}</span>
                <span className="text-xs text-cyan-300 font-semibold">38% Fans Picked</span>
              </div>
            </div>
            {userPredictions['pred-' + nextMatch.id + '-winner'] === teamB?.id && (
              <span className="w-7 h-7 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                ✓
              </span>
            )}
          </button>

        </div>

        {/* Micro Prediction Questions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 pt-3 border-t border-slate-800">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              1. Total Match Sixes:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['< 10 Sixes', '11-18 Sixes', '19+ Sixes'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handlePredict('pred-' + nextMatch.id + '-sixes', opt)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                    userPredictions['pred-' + nextMatch.id + '-sixes'] === opt
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-cyan-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              2. Projected 1st Innings Runs:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['< 160 Runs', '161-190 Runs', '191+ Runs'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handlePredict('pred-' + nextMatch.id + '-runs', opt)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                    userPredictions['pred-' + nextMatch.id + '-runs'] === opt
                      ? 'bg-cyan-400 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Submit Prediction */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-400 font-normal">
            🎯 Correct picks earn <strong className="text-amber-300 font-semibold">+50 Points</strong> each.
          </span>
          <button
            onClick={() => handleSubmitMatchPrediction(nextMatch.id)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submittedMatches[nextMatch.id] ? 'Update Predictions' : 'Lock In Matchday Picks'}</span>
          </button>
        </div>

      </div>

      {/* Fan Achievements & Badges Showcase */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Unlocked Fan Prediction Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center gap-3">
            <span className="text-2xl">🔮</span>
            <div>
              <span className="text-xs font-bold text-slate-900 block font-cabinet">Boundary Prophet</span>
              <span className="text-[10px] text-amber-800 font-medium">Predicted 15+ Sixes</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-200 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <span className="text-xs font-bold text-slate-900 block font-cabinet">Yorker Whisperer</span>
              <span className="text-[10px] text-cyan-800 font-medium">3 Wicket Predictions</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <span className="text-xs font-bold text-slate-900 block font-cabinet">Master Strategist</span>
              <span className="text-[10px] text-emerald-800 font-medium">Top 5% Leaderboard</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <span className="text-xs font-bold text-slate-900 block font-cabinet">Hot Streak 5x</span>
              <span className="text-[10px] text-rose-800 font-medium">5 Wins In A Row</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
