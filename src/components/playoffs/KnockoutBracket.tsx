import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Flame, 
  Crown, 
  CheckCircle2, 
  Play, 
  Radio,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTournament } from '../../context/TournamentContext';
import { Match, Team } from '../../types/cricket';
import { DetailedScorecard } from '../scorecard/DetailedScorecard';

export const KnockoutBracket: React.FC = () => {
  const { matches, teams, setActiveMatchId, setActiveTab, viewMode } = useTournament();
  const [inspectMatch, setInspectMatch] = useState<Match | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  // Playoff matches
  const sf1 = matches.find(m => m.stage === 'Semi Final 1');
  const sf2 = matches.find(m => m.stage === 'Semi Final 2');
  const grandFinal = matches.find(m => m.stage === 'Grand Final');

  const getTeam = (id?: string) => teams.find(t => t.id === id);

  const championTeam = grandFinal?.winnerTeamId ? getTeam(grandFinal.winnerTeamId) : undefined;
  const runnerUpTeam = grandFinal?.winnerTeamId 
    ? (grandFinal.teamAId === grandFinal.winnerTeamId ? getTeam(grandFinal.teamBId) : getTeam(grandFinal.teamAId))
    : undefined;

  const triggerConfetti = () => {
    setCelebrating(true);
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCelebrating(false);
        return;
      }
      confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#dc2626', '#eab308']
      });
    }, 250);
  };

  const renderBracketCard = (match?: Match, label?: string) => {
    if (!match) {
      return (
        <div className="glass-panel p-4 rounded-2xl border border-dashed border-slate-700 text-center text-slate-500 text-xs py-8">
          {label || 'TBD Fixture'}
        </div>
      );
    }

    const tA = getTeam(match.teamAId);
    const tB = getTeam(match.teamBId);

    const scoreA = match.innings1?.battingTeamId === tA?.id ? match.innings1 : (match.innings2?.battingTeamId === tA?.id ? match.innings2 : undefined);
    const scoreB = match.innings1?.battingTeamId === tB?.id ? match.innings1 : (match.innings2?.battingTeamId === tB?.id ? match.innings2 : undefined);

    const isLive = match.status === 'live';
    const isDone = match.status === 'completed';

    return (
      <div 
        className={`glass-panel p-4 rounded-2xl border transition-all space-y-3 relative ${
          match.stage === 'Grand Final' 
            ? 'border-amber-500/60 shadow-glow-gold bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900' 
            : isLive
              ? 'border-rose-500 shadow-lg shadow-rose-950/40'
              : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-black uppercase text-amber-400">{match.title}</span>
          {isLive ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] animate-pulse">
              LIVE
            </span>
          ) : isDone ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              FINAL
            </span>
          ) : (
            <span className="text-slate-400">{match.date}</span>
          )}
        </div>

        {/* Teams in match */}
        <div className="space-y-2 text-xs">
          {/* Team A */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            match.winnerTeamId === tA?.id 
              ? 'bg-emerald-950/40 border-emerald-700 text-white font-bold' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{tA?.logo || '🏏'}</span>
              <span>{tA?.name || 'TBD Team 1'}</span>
              {match.winnerTeamId === tA?.id && <span className="text-amber-400">👑</span>}
            </div>
            {scoreA && (
              <span className="font-mono font-bold">{scoreA.totalRuns}/{scoreA.totalWickets} ({scoreA.oversCompletedStr})</span>
            )}
          </div>

          {/* Team B */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
            match.winnerTeamId === tB?.id 
              ? 'bg-emerald-950/40 border-emerald-700 text-white font-bold' 
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{tB?.logo || '🏏'}</span>
              <span>{tB?.name || 'TBD Team 2'}</span>
              {match.winnerTeamId === tB?.id && <span className="text-amber-400">👑</span>}
            </div>
            {scoreB && (
              <span className="font-mono font-bold">{scoreB.totalRuns}/{scoreB.totalWickets} ({scoreB.oversCompletedStr})</span>
            )}
          </div>
        </div>

        {/* Card actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 truncate max-w-[140px]">{match.venue}</span>
          <div className="flex items-center gap-1.5">
            {match.innings1 && (
              <button
                onClick={() => setInspectMatch(match)}
                className="p-1 text-slate-400 hover:text-white"
                title="View Scorecard"
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {
                setActiveMatchId(match.id);
                setActiveTab('live');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-[11px] flex items-center gap-1"
            >
              <Play className="w-3 h-3" /> Match
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Playoffs Tournament Tree & Finals Day Gala
          </h2>
          <p className="text-xs text-slate-400">
            Road to the Trophy • Semi-Finals, Grand Championship Final & Awards Ceremony
          </p>
        </div>

        <button
          onClick={triggerConfetti}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          Trigger Victory Confetti 🎊
        </button>
      </div>

      {/* CHAMPIONS PODIUM BANNER (If champion decided) */}
      {championTeam ? (
        <div className="glass-panel p-8 rounded-3xl border border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 text-center space-y-4 shadow-glow-gold relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold uppercase tracking-widest text-xs">
            <Crown className="w-5 h-5 animate-bounce" /> OFFICIAL TOURNAMENT CHAMPIONS <Crown className="w-5 h-5 animate-bounce" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <div 
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-4 border-amber-400 animate-pulse"
              style={{ backgroundColor: championTeam.primaryColor }}
            >
              {championTeam.logo}
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {championTeam.name}
            </h1>
            <p className="text-sm text-amber-300 font-bold mt-1">
              Winners of the {matches[0]?.title ? 'Premier Super League 2026' : 'Cricket Championship Trophy'}
            </p>
          </div>

          {runnerUpTeam && (
            <div className="text-xs text-slate-300">
              Runners-Up: <strong className="text-slate-100">{runnerUpTeam.name}</strong> ({runnerUpTeam.logo})
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center space-y-2">
          <div className="text-2xl">🏆</div>
          <h3 className="text-lg font-bold text-white">Championship Trophy Awaits</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            The Grand Final is scheduled between the winners of Semi Final 1 and Semi Final 2.
          </p>
        </div>
      )}

      {/* VISUAL PLAYOFF TREE BRACKET */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Playoff Bracket View
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Semi Finals Column (Col 1) */}
          <div className="space-y-6">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">Semi-Final 1</div>
            {renderBracketCard(sf1, 'Semi Final 1: Rank 1 vs Rank 4')}

            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider pt-2">Semi-Final 2</div>
            {renderBracketCard(sf2, 'Semi Final 2: Rank 2 vs Rank 3')}
          </div>

          {/* Connectors / Middle indicator (Col 2) */}
          <div className="hidden md:flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-full h-0.5 bg-gradient-to-r from-slate-700 to-amber-500"></div>
            <div className="p-3 rounded-full bg-slate-900 border border-amber-500 text-amber-400 font-black text-xs shadow-glow-gold">
              VS
            </div>
            <div className="w-full h-0.5 bg-gradient-to-r from-slate-700 to-amber-500"></div>
          </div>

          {/* Grand Final Column (Col 3) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Grand Championship Final
            </div>
            {renderBracketCard(grandFinal, 'Grand Final: Winners of SF1 vs SF2')}
          </div>
        </div>
      </div>

      {/* FINALS AWARDS GALA SECTION */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Certified Presentation Ceremony Awards
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-2">
            <span className="text-2xl">🏆</span>
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider">Champions Trophy</div>
            <div className="font-bold text-white text-sm">{championTeam?.name || 'Tournament Winner'}</div>
            <div className="text-[10px] text-slate-400">$100,000 Grand Prize</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
            <span className="text-2xl">🥈</span>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Runners-Up Shield</div>
            <div className="font-bold text-white text-sm">{runnerUpTeam?.name || 'Finalist'}</div>
            <div className="text-[10px] text-slate-400">$50,000 Prize</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-2">
            <span className="text-2xl">👑</span>
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider">Orange Cap (Most Runs)</div>
            <div className="font-bold text-white text-sm">Virat Sharma (218 runs)</div>
            <div className="text-[10px] text-slate-400">Royal Strikers</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 text-center space-y-2">
            <span className="text-2xl">🎯</span>
            <div className="text-xs font-black text-purple-400 uppercase tracking-wider">Purple Cap (Most Wickets)</div>
            <div className="font-bold text-white text-sm">Jasprit Bumrah (11 wkts)</div>
            <div className="text-[10px] text-slate-400">Mumbai Mavericks</div>
          </div>
        </div>
      </div>

      {/* Inspect Match Scorecard Modal */}
      {inspectMatch && (
        <DetailedScorecard
          match={inspectMatch}
          onClose={() => setInspectMatch(null)}
        />
      )}
    </div>
  );
};
