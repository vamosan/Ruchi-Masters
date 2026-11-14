import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Crown, 
  CheckCircle2, 
  Play, 
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTournament } from '../../context/TournamentContext';
import { Match } from '../../types/cricket';
import { DetailedScorecard } from '../scorecard/DetailedScorecard';

export const KnockoutBracket: React.FC = () => {
  const { matches, teams, setActiveMatchId, setActiveTab } = useTournament();
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
        <div className="bg-slate-50/60 p-5 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500 text-xs py-8">
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
        className={`bg-white p-4 rounded-2xl border transition-all space-y-3 shadow-sm hover:shadow-md ${
          match.stage === 'Grand Final' 
            ? 'border-amber-400 ring-2 ring-amber-400/20' 
            : isLive
              ? 'border-rose-400 ring-2 ring-rose-500/10'
              : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-100">
          <span className="font-bold uppercase tracking-wider text-slate-900 font-mono">{match.title}</span>
          {isLive ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] animate-pulse">
              LIVE
            </span>
          ) : isDone ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
              FINAL
            </span>
          ) : (
            <span className="text-slate-400 font-mono">{match.date}</span>
          )}
        </div>

        {/* Teams in match */}
        <div className="space-y-2 text-xs">
          {/* Team A */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
            match.winnerTeamId === tA?.id 
              ? 'bg-emerald-50/80 border-emerald-300 text-slate-950 font-bold' 
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{tA?.logo || '🏏'}</span>
              <span>{tA?.name || 'TBD Team 1'}</span>
              {match.winnerTeamId === tA?.id && <span className="text-amber-500 font-bold">👑</span>}
            </div>
            {scoreA && (
              <span className="font-mono font-bold text-slate-900">{scoreA.totalRuns}/{scoreA.totalWickets} ({scoreA.oversCompletedStr})</span>
            )}
          </div>

          {/* Team B */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
            match.winnerTeamId === tB?.id 
              ? 'bg-emerald-50/80 border-emerald-300 text-slate-950 font-bold' 
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-base">{tB?.logo || '🏏'}</span>
              <span>{tB?.name || 'TBD Team 2'}</span>
              {match.winnerTeamId === tB?.id && <span className="text-amber-500 font-bold">👑</span>}
            </div>
            {scoreB && (
              <span className="font-mono font-bold text-slate-900">{scoreB.totalRuns}/{scoreB.totalWickets} ({scoreB.oversCompletedStr})</span>
            )}
          </div>
        </div>

        {/* Card actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 truncate max-w-[140px]">{match.venue}</span>
          <div className="flex items-center gap-1.5">
            {match.innings1 && (
              <button
                onClick={() => setInspectMatch(match)}
                className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
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
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
            >
              <Play className="w-3 h-3 text-amber-300" /> Match
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[10px] uppercase tracking-wider font-semibold">
              ROAD TO THE TROPHY
            </span>
            <span className="text-xs text-slate-400 font-mono">/ PLAYOFFS & FINALS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-cabinet tracking-tight flex items-center gap-2">
            Championship Knockout Tree
          </h2>
          <p className="text-xs text-slate-500">
            Semi-Finals, 3rd Place Match, and Grand Championship Final at Frankfurt Ground.
          </p>
        </div>

        <button
          onClick={triggerConfetti}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Trigger Victory Confetti 🎊
        </button>
      </div>

      {/* CHAMPIONS PODIUM BANNER (If champion decided) */}
      {championTeam ? (
        <div className="p-8 rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 text-center space-y-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-amber-700 font-extrabold uppercase tracking-widest text-xs">
            <Crown className="w-5 h-5 text-amber-500" /> OFFICIAL 2026 TOURNAMENT CHAMPIONS <Crown className="w-5 h-5 text-amber-500" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-md border-2 border-amber-300 bg-white"
              style={{ backgroundColor: championTeam.primaryColor }}
            >
              {championTeam.logo}
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-cabinet">
              {championTeam.name}
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Winners of the Ruchi Masters T20 2026 Championship Trophy
            </p>
          </div>

          {runnerUpTeam && (
            <div className="text-xs text-slate-500 font-medium">
              Runners-Up: <strong className="text-slate-800 font-semibold">{runnerUpTeam.name}</strong> ({runnerUpTeam.logo})
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-slate-200/80 bg-white text-center space-y-2 shadow-sm">
          <div className="text-2xl">🏆</div>
          <h3 className="text-lg font-bold text-slate-900 font-cabinet">Championship Trophy Awaits</h3>
          <p className="text-xs text-slate-500">
            Grand Final champion will be permanently inscribed upon completion of the final match.
          </p>
        </div>
      )}

      {/* BRACKET TREE DIAGRAM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Semi Finals */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-cabinet flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Semi-Final 1 (SF1)
            </h3>
            {renderBracketCard(sf1, 'Semi Final 1: Group A Winner vs Group B Runner-Up')}
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 font-cabinet flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Semi-Final 2 (SF2)
            </h3>
            {renderBracketCard(sf2, 'Semi Final 2: Group B Winner vs Group A Runner-Up')}
          </div>
        </div>

        {/* Grand Final */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-cabinet">
              Grand Championship Final
            </h3>
          </div>
          {renderBracketCard(grandFinal, 'Grand Final: Winner SF1 vs Winner SF2')}
        </div>
      </div>

      {/* Scorecard Modal */}
      {inspectMatch && (
        <DetailedScorecard
          match={inspectMatch}
          onClose={() => setInspectMatch(null)}
        />
      )}
    </div>
  );
};
