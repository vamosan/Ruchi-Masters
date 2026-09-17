import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Target, 
  ShieldCheck,
  Trophy
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Player, Team } from '../../types/cricket';

export const Leaderboards: React.FC = () => {
  const { teams, matches } = useTournament();
  const [activeStatTab, setActiveStatTab] = useState<'orange' | 'purple' | 'sixes' | 'mvp' | 'scores'>('orange');

  // Aggregated Player Statistics
  const allPlayersWithStats = teams.flatMap(team => {
    return team.players.map(player => {
      // Calculate tournament aggregates from all completed / live matches
      let tournamentRuns = player.runsScored;
      let tournamentBalls = 0;
      let tournamentFours = 0;
      let tournamentSixes = 0;
      let highestScore = player.highestScore || 0;
      let tournamentWickets = player.wicketsTaken;
      let totalLegalBallsBowled = 0;
      let runsConceded = 0;

      // Extract exact stats from match scorecards
      matches.forEach(m => {
        [m.innings1, m.innings2].forEach(inn => {
          if (!inn) return;
          const bat = inn.battingScorecard.find(b => b.playerId === player.id);
          if (bat) {
            tournamentBalls += bat.balls;
            tournamentFours += bat.fours;
            tournamentSixes += bat.sixes;
            if (bat.runs > highestScore) highestScore = bat.runs;
          }

          const bowl = inn.bowlingScorecard.find(b => b.playerId === player.id);
          if (bowl) {
            totalLegalBallsBowled += bowl.ballsLegal;
            runsConceded += bowl.runsConceded;
          }
        });
      });

      const oversBowledDec = totalLegalBallsBowled / 6;
      const calcEconomy = oversBowledDec > 0 ? Number((runsConceded / oversBowledDec).toFixed(2)) : (player.economy || 0);
      const calcStrikeRate = tournamentBalls > 0 ? Number(((tournamentRuns / tournamentBalls) * 100).toFixed(1)) : (player.strikeRate || 0);

      // MVP Index Formula: (Runs * 1) + (Fours * 1) + (Sixes * 2) + (Wickets * 25) + (Dots * 1)
      const mvpPoints = (tournamentRuns * 1) + (tournamentFours * 1) + (tournamentSixes * 2.5) + (tournamentWickets * 20);

      return {
        player,
        team,
        runs: tournamentRuns,
        balls: tournamentBalls,
        fours: tournamentFours,
        sixes: tournamentSixes,
        highestScore,
        wickets: tournamentWickets,
        economy: calcEconomy,
        strikeRate: calcStrikeRate,
        mvpPoints: Math.round(mvpPoints)
      };
    });
  });

  const orangeCapList = [...allPlayersWithStats].sort((a, b) => b.runs - a.runs);
  const purpleCapList = [...allPlayersWithStats].sort((a, b) => b.wickets - a.wickets || a.economy - b.economy);
  const sixesList = [...allPlayersWithStats].sort((a, b) => b.sixes - a.sixes || b.strikeRate - a.strikeRate);
  const mvpList = [...allPlayersWithStats].sort((a, b) => b.mvpPoints - a.mvpPoints);

  const topOrange = orangeCapList[0];
  const topPurple = purpleCapList[0];
  const topMvp = mvpList[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" />
          Tournament Player Leaderboards & Honors
        </h2>
        <p className="text-xs text-slate-400">
          Orange Cap (Most Runs), Purple Cap (Most Wickets), Maximum Sixes and MVP Index
        </p>
      </div>

      {/* Top Cap Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Orange Cap Leader */}
        <div className="glass-panel p-5 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 shadow-glow-gold relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1">
              👑 ORANGE CAP
            </span>
            <span className="text-xs font-bold text-amber-400">Leading Run Scorer</span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-amber-400"
              style={{ backgroundColor: topOrange?.team.primaryColor }}
            >
              {topOrange?.team.logo}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{topOrange?.player.name}</h3>
              <span className="text-xs text-slate-300 font-semibold">{topOrange?.team.name}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Runs</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{topOrange?.runs}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Strike Rate / HS</span>
              <span className="text-xs font-bold text-slate-200 font-mono">{topOrange?.strikeRate} SR • HS {topOrange?.highestScore}</span>
            </div>
          </div>
        </div>

        {/* Purple Cap Leader */}
        <div className="glass-panel p-5 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900 shadow-lg shadow-purple-950/50 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-600 text-white flex items-center gap-1">
              🎯 PURPLE CAP
            </span>
            <span className="text-xs font-bold text-purple-300">Leading Wicket Taker</span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-purple-400"
              style={{ backgroundColor: topPurple?.team.primaryColor }}
            >
              {topPurple?.team.logo}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{topPurple?.player.name}</h3>
              <span className="text-xs text-slate-300 font-semibold">{topPurple?.team.name}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Wickets</span>
              <span className="text-2xl font-black text-purple-400 font-mono">{topPurple?.wickets}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Economy / Best</span>
              <span className="text-xs font-bold text-slate-200 font-mono">{topPurple?.economy} Econ • {topPurple?.player.bestBowling}</span>
            </div>
          </div>
        </div>

        {/* Most Valuable Player (MVP) */}
        <div className="glass-panel p-5 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 shadow-glow-emerald relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1">
              ⚡ MVP LEADER
            </span>
            <span className="text-xs font-bold text-emerald-300">Tournament Index</span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-emerald-400"
              style={{ backgroundColor: topMvp?.team.primaryColor }}
            >
              {topMvp?.team.logo}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{topMvp?.player.name}</h3>
              <span className="text-xs text-slate-300 font-semibold">{topMvp?.team.name}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">MVP Rating</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{topMvp?.mvpPoints} pts</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Contribution</span>
              <span className="text-xs font-bold text-slate-200 font-mono">{topMvp?.runs}r & {topMvp?.wickets}w</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveStatTab('orange')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeStatTab === 'orange' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          👑 Most Runs (Orange Cap)
        </button>
        <button
          onClick={() => setActiveStatTab('purple')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeStatTab === 'purple' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎯 Most Wickets (Purple Cap)
        </button>
        <button
          onClick={() => setActiveStatTab('sixes')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeStatTab === 'sixes' ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:text-white'
          }`}
        >
          🚀 Maximum Sixes
        </button>
        <button
          onClick={() => setActiveStatTab('mvp')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeStatTab === 'mvp' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚡ MVP Index
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Player</th>
                <th className="p-4">Franchise</th>
                <th className="p-4 text-right">Matches</th>
                {activeStatTab === 'orange' && (
                  <>
                    <th className="p-4 text-right font-bold text-amber-400">Total Runs</th>
                    <th className="p-4 text-right">Highest</th>
                    <th className="p-4 text-right">Strike Rate</th>
                    <th className="p-4 text-right">4s / 6s</th>
                  </>
                )}
                {activeStatTab === 'purple' && (
                  <>
                    <th className="p-4 text-right font-bold text-purple-400">Wickets</th>
                    <th className="p-4 text-right">Best Bowling</th>
                    <th className="p-4 text-right">Economy</th>
                    <th className="p-4 text-right">Role</th>
                  </>
                )}
                {activeStatTab === 'sixes' && (
                  <>
                    <th className="p-4 text-right font-bold text-amber-400">Sixes</th>
                    <th className="p-4 text-right">Fours</th>
                    <th className="p-4 text-right">Runs</th>
                    <th className="p-4 text-right">Strike Rate</th>
                  </>
                )}
                {activeStatTab === 'mvp' && (
                  <>
                    <th className="p-4 text-right font-bold text-emerald-400">MVP Points</th>
                    <th className="p-4 text-right">Runs</th>
                    <th className="p-4 text-right">Wickets</th>
                    <th className="p-4 text-right">Role</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {(activeStatTab === 'orange' ? orangeCapList : activeStatTab === 'purple' ? purpleCapList : activeStatTab === 'sixes' ? sixesList : mvpList).slice(0, 15).map((entry, idx) => (
                <tr key={entry.player.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-center font-bold text-slate-400 font-mono">
                    {idx === 0 ? <span className="text-amber-400 font-black text-sm">🥇 1</span> : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                  </td>

                  <td className="p-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span>{entry.player.name}</span>
                      {entry.player.isCaptain && <span className="text-[10px] text-amber-400">(C)</span>}
                    </div>
                  </td>

                  <td className="p-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <span>{entry.team.logo}</span>
                      <span className="text-xs">{entry.team.name}</span>
                    </div>
                  </td>

                  <td className="p-4 text-right text-slate-400 font-mono">{entry.player.matchesPlayed || 4}</td>

                  {activeStatTab === 'orange' && (
                    <>
                      <td className="p-4 text-right font-black text-amber-400 font-mono text-base">{entry.runs}</td>
                      <td className="p-4 text-right text-slate-200 font-mono font-bold">{entry.highestScore}</td>
                      <td className="p-4 text-right text-slate-300 font-mono">{entry.strikeRate.toFixed(1)}</td>
                      <td className="p-4 text-right text-slate-400 font-mono">{entry.fours} / {entry.sixes}</td>
                    </>
                  )}

                  {activeStatTab === 'purple' && (
                    <>
                      <td className="p-4 text-right font-black text-purple-400 font-mono text-base">{entry.wickets}</td>
                      <td className="p-4 text-right text-slate-200 font-mono font-bold">{entry.player.bestBowling}</td>
                      <td className="p-4 text-right text-amber-400 font-mono">{entry.economy.toFixed(2)}</td>
                      <td className="p-4 text-right text-slate-400">{entry.player.bowlingStyle}</td>
                    </>
                  )}

                  {activeStatTab === 'sixes' && (
                    <>
                      <td className="p-4 text-right font-black text-amber-400 font-mono text-base">{entry.sixes}</td>
                      <td className="p-4 text-right text-slate-300 font-mono">{entry.fours}</td>
                      <td className="p-4 text-right text-slate-200 font-mono font-bold">{entry.runs}</td>
                      <td className="p-4 text-right text-emerald-400 font-mono">{entry.strikeRate.toFixed(1)}</td>
                    </>
                  )}

                  {activeStatTab === 'mvp' && (
                    <>
                      <td className="p-4 text-right font-black text-emerald-400 font-mono text-base">{entry.mvpPoints}</td>
                      <td className="p-4 text-right text-slate-200 font-mono font-bold">{entry.runs}</td>
                      <td className="p-4 text-right text-purple-300 font-mono font-bold">{entry.wickets}</td>
                      <td className="p-4 text-right text-slate-400 capitalize">{entry.player.role.replace('_', ' ')}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
