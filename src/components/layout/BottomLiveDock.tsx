import React from 'react';
import { Play, Radio, ChevronUp, Maximize2 } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export const BottomLiveDock: React.FC = () => {
  const { matches, teams, activeMatchId, setActiveMatchId, setActiveTab } = useTournament();

  const liveMatch = matches.find(m => m.status === 'live') || matches[0];
  if (!liveMatch || !liveMatch.innings1) return null;

  const teamA = teams.find(t => t.id === liveMatch.teamAId);
  const teamB = teams.find(t => t.id === liveMatch.teamBId);
  const allPlayers = teams.flatMap(t => t.players);

  const curInn = liveMatch.currentInningsNumber === 1 ? liveMatch.innings1 : liveMatch.innings2;
  const striker = allPlayers.find(p => p.id === liveMatch.liveStrikerId);
  const nonStriker = allPlayers.find(p => p.id === liveMatch.liveNonStrikerId);
  const bowler = allPlayers.find(p => p.id === liveMatch.liveBowlerId);

  const strikerBat = curInn?.battingScorecard.find(b => b.playerId === striker?.id);
  const nonStrikerBat = curInn?.battingScorecard.find(b => b.playerId === nonStriker?.id);
  const bowlerStats = curInn?.bowlingScorecard.find(b => b.playerId === bowler?.id);

  const battingTeam = curInn ? teams.find(t => t.id === curInn.battingTeamId) : teamA;
  const bowlingTeam = curInn ? teams.find(t => t.id === curInn.bowlingTeamId) : teamB;

  return (
    <div className="fixed bottom-3 left-4 right-4 sm:left-72 sm:right-8 z-40 select-none">
      <div 
        onClick={() => {
          setActiveMatchId(liveMatch.id);
          setActiveTab('live');
        }}
        className="bg-[#1c144e]/95 backdrop-blur-xl border border-indigo-500/50 rounded-3xl p-3 sm:p-4 shadow-2xl shadow-indigo-950 flex flex-wrap items-center justify-between gap-3 text-xs text-white cursor-pointer hover:border-cyan-400 transition-all group"
      >
        {/* Left: Team Flags/Badges */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center -space-x-2">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow border border-white/20 z-10"
              style={{ backgroundColor: teamA?.primaryColor || '#2563eb' }}
            >
              {teamA?.logo || '🦁'}
            </div>
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow border border-white/20"
              style={{ backgroundColor: teamB?.primaryColor || '#dc2626' }}
            >
              {teamB?.logo || '🌊'}
            </div>
          </div>
          <span className="text-[11px] font-black tracking-wider text-indigo-300 uppercase hidden md:inline">
            VS
          </span>
        </div>

        {/* Batsmen on Crease */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono border-l border-indigo-800/60 pl-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="truncate max-w-[90px]">{striker?.name.split(' ')[0].toUpperCase() || 'STRIKER'}</span>
              <span className="text-cyan-300">{strikerBat?.runs || 0}</span>
              <span className="text-slate-400 text-[10px]">({strikerBat?.balls || 0})</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="truncate max-w-[90px]">{nonStriker?.name.split(' ')[0].toUpperCase() || 'BATTER'}</span>
              <span>{nonStrikerBat?.runs || 0}</span>
              <span className="text-slate-400 text-[10px]">({nonStrikerBat?.balls || 0})</span>
            </div>
          </div>
        </div>

        {/* Center Pill: Coral Score Banner (Matching Screenshot) */}
        <div className="flex-1 max-w-sm mx-auto bg-gradient-to-r from-rose-600 to-red-600 rounded-2xl px-4 py-2 text-center shadow-lg shadow-rose-900/50">
          <div className="flex items-center justify-center gap-2 font-mono font-black text-sm sm:text-base tracking-wide text-white">
            <span>{teamA?.code} v {teamB?.code}</span>
            <span className="text-yellow-300 text-base sm:text-lg">
              {curInn?.totalRuns || 0}-{curInn?.totalWickets || 0}
            </span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-sans">
              P{liveMatch.currentInningsNumber}
            </span>
            <span className="text-xs text-white/90">
              {curInn?.oversCompletedStr || '0.0'}
            </span>
          </div>

          <div className="text-[9px] font-extrabold uppercase tracking-widest text-white/90 truncate">
            {liveMatch.tossWinnerId 
              ? `${teams.find(t => t.id === liveMatch.tossWinnerId)?.code} WON TOSS & ELECTED TO ${liveMatch.tossDecision?.toUpperCase()}` 
              : 'LIVE BALL-BY-BALL SCORING ACTIVE'}
          </div>
        </div>

        {/* Bowler Figures & Over Balls */}
        <div className="hidden sm:flex items-center gap-3 font-mono text-xs border-l border-indigo-800/60 pl-3">
          <div>
            <div className="font-bold text-emerald-400 truncate max-w-[100px]">
              {bowler?.name.split(' ')[0].toUpperCase() || 'BOWLER'}
            </div>
            <div className="text-[11px] text-slate-300">
              {bowlerStats?.wickets || 0}-{bowlerStats?.runsConceded || 0} <span className="text-slate-400">({bowlerStats?.overs || 0})</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-indigo-900 text-[9px] flex items-center justify-center font-bold text-slate-300">1</span>
            <span className="w-4 h-4 rounded-full bg-indigo-900 text-[9px] flex items-center justify-center font-bold text-slate-300">1</span>
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-[9px] flex items-center justify-center font-bold text-white">4</span>
            <span className="w-4 h-4 rounded-full bg-indigo-900/60 text-[9px] flex items-center justify-center text-slate-500">○</span>
            <span className="w-4 h-4 rounded-full bg-indigo-900/60 text-[9px] flex items-center justify-center text-slate-500">○</span>
            <span className="w-4 h-4 rounded-full bg-indigo-900/60 text-[9px] flex items-center justify-center text-slate-500">○</span>
          </div>
        </div>

        {/* Open Match Center trigger */}
        <div className="flex items-center gap-1 bg-cyan-500 text-slate-950 px-3 py-1.5 rounded-xl font-extrabold text-[11px] group-hover:scale-105 transition-transform shadow">
          <Play className="w-3 h-3 fill-current" />
          <span className="hidden sm:inline">Expand</span>
        </div>
      </div>
    </div>
  );
};
