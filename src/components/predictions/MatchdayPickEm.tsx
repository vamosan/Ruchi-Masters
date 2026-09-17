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

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const nextMatch = matches[0] || {
    id: 'match-1',
    teamAId: teams[0]?.id || 'team-1',
    teamBId: teams[1]?.id || 'team-2',
    date: '2026-09-15',
    time: '19:30 IST',
    venue: 'Wankhede Arena',
    title: 'Match 1 • Group A'
  };

  const teamA = getTeam(nextMatch.teamAId) || teams[0];
  const teamB = getTeam(nextMatch.teamBId) || teams[1];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 sport-card space-y-6 border-3 border-slate-950 shadow-[6px_6px_0px_#0f172a]">
      
      {/* Pick'Em Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-[#FF3366] text-white font-black text-xs sport-badge uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a]">
              <Flame className="w-3.5 h-3.5" />
              Fan Pick'Em Arena
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">2026 CHALLENGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-cabinet text-slate-950 mt-1">
            Matchday Predictions & Fan Streaks
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Lock in your predictions before toss time, climb the fan leaderboard, and unlock exclusive digital badges!
          </p>
        </div>

        {/* User Stats Card */}
        <div className="flex items-center gap-3 bg-slate-950 text-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-md shrink-0">
          <div className="w-11 h-11 rounded-xl bg-[#CCFF00] text-slate-950 flex items-center justify-center font-black text-xl shadow">
            🏆
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block font-bold">YOUR PREDICTION SCORE</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black font-mono text-[#CCFF00]">{scorePoints} PTS</span>
              <span className="text-[10px] font-black bg-[#FF3366] text-white px-2 py-0.5 rounded-md">🔥 3 STREAK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Match Pick'Em Card */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl border-2 border-slate-900 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Match Info Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <span className="px-3 py-1 rounded-xl bg-[#FFE600] text-slate-950 font-black text-xs sport-badge">
            ⚡ FEATURED CLASH • {nextMatch.title || 'Match 1'}
          </span>
          <span className="text-xs font-mono text-cyan-300 font-bold">
            📅 {nextMatch.date} • ⏰ {nextMatch.time} • 📍 {nextMatch.venue}
          </span>
        </div>

        {/* Head-to-Head Clash Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          
          {/* Team A Prediction Tile */}
          <button
            onClick={() => handlePredict('pred-' + nextMatch.id + '-winner', teamA?.id || 'team-1')}
            className={'p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ' + (
              userPredictions['pred-' + nextMatch.id + '-winner'] === teamA?.id
                ? 'border-[#CCFF00] bg-[#CCFF00]/20 shadow-[0_0_20px_rgba(204,255,0,0.3)] scale-[1.02]'
                : 'border-slate-700 bg-slate-900/80 hover:border-cyan-400'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{teamA?.logo}</span>
              <div>
                <span className="text-xs font-mono text-slate-400 block font-bold">{teamA?.code}</span>
                <span className="text-lg font-black font-cabinet text-white block">{teamA?.name}</span>
                <span className="text-[11px] text-[#CCFF00] font-bold">62% Fans Picked</span>
              </div>
            </div>
            {userPredictions['pred-' + nextMatch.id + '-winner'] === teamA?.id && (
              <span className="w-8 h-8 rounded-full bg-[#CCFF00] text-slate-950 flex items-center justify-center font-black">
                ✓
              </span>
            )}
          </button>

          {/* Team B Prediction Tile */}
          <button
            onClick={() => handlePredict('pred-' + nextMatch.id + '-winner', teamB?.id || 'team-2')}
            className={'p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ' + (
              userPredictions['pred-' + nextMatch.id + '-winner'] === teamB?.id
                ? 'border-[#00F0FF] bg-[#00F0FF]/20 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]'
                : 'border-slate-700 bg-slate-900/80 hover:border-cyan-400'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{teamB?.logo}</span>
              <div>
                <span className="text-xs font-mono text-slate-400 block font-bold">{teamB?.code}</span>
                <span className="text-lg font-black font-cabinet text-white block">{teamB?.name}</span>
                <span className="text-[11px] text-[#00F0FF] font-bold">38% Fans Picked</span>
              </div>
            </div>
            {userPredictions['pred-' + nextMatch.id + '-winner'] === teamB?.id && (
              <span className="w-8 h-8 rounded-full bg-[#00F0FF] text-slate-950 flex items-center justify-center font-black">
                ✓
              </span>
            )}
          </button>

        </div>

        {/* Micro Prediction Questions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 pt-2 border-t border-slate-800">
          
          {/* Question 1: Total Match Sixes */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              1. Total Match Sixes Bracket:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['< 10 Sixes', '11-18 Sixes', '19+ Sixes'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handlePredict('pred-' + nextMatch.id + '-sixes', opt)}
                  className={'py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all ' + (
                    userPredictions['pred-' + nextMatch.id + '-sixes'] === opt
                      ? 'bg-[#CCFF00] text-slate-950 border-[#CCFF00]'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: First Innings Score Bracket */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-cyan-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              2. Projected 1st Innings Runs:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['< 160 Runs', '161-190 Runs', '191+ Runs'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handlePredict('pred-' + nextMatch.id + '-runs', opt)}
                  className={'py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all ' + (
                    userPredictions['pred-' + nextMatch.id + '-runs'] === opt
                      ? 'bg-[#00F0FF] text-slate-950 border-[#00F0FF]'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Submit Prediction CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-400 font-medium">
            🎯 Correct picks earn <strong className="text-[#CCFF00]">+50 Points</strong> each.
          </span>
          <button
            onClick={() => handleSubmitMatchPrediction(nextMatch.id)}
            className="px-6 py-2.5 rounded-2xl bg-[#CCFF00] hover:bg-[#b8e600] text-slate-950 font-black text-xs sport-btn flex items-center gap-2 shadow-[3px_3px_0px_#0f172a]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submittedMatches[nextMatch.id] ? 'Update Predictions' : 'Lock In Matchday Picks'}</span>
          </button>
        </div>

      </div>

      {/* Fan Achievements & Badges Showcase */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono flex items-center gap-2">
          <Award className="w-4 h-4 text-[#FF3366]" />
          Unlocked Fan Prediction Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-3">
            <span className="text-2xl">🔮</span>
            <div>
              <span className="text-xs font-black text-slate-900 block font-cabinet">Boundary Prophet</span>
              <span className="text-[10px] text-amber-700 font-bold">Predicted 15+ Sixes</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-cyan-50 border-2 border-cyan-300 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <span className="text-xs font-black text-slate-900 block font-cabinet">Yorker Whisperer</span>
              <span className="text-[10px] text-cyan-700 font-bold">3 Wicket Predictions</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <span className="text-xs font-black text-slate-900 block font-cabinet">Master Strategist</span>
              <span className="text-[10px] text-emerald-700 font-bold">Top 5% Leaderboard</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <span className="text-xs font-black text-slate-900 block font-cabinet">Hot Streak 5x</span>
              <span className="text-[10px] text-rose-700 font-bold">5 Wins In A Row</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
