import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Target, 
  ShieldCheck,
  Trophy,
  Edit3,
  Search
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Player, Team } from '../../types/cricket';
import { EditPlayerStatsModal } from './EditPlayerStatsModal';

export const Leaderboards: React.FC = () => {
  const { teams, matches, isAdmin } = useTournament();
  const [activeStatTab, setActiveStatTab] = useState<'orange' | 'purple' | 'sixes' | 'mvp'>('orange');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<{
    player: Player;
    team: Team;
    fours: number;
    sixes: number;
  } | null>(null);
  const adminMode = isAdmin();

  // Aggregated Player Statistics (merges scorecard totals & admin overrides)
  const allPlayersWithStats = teams.flatMap(team => {
    return team.players.map(player => {
      let matchRuns = 0;
      let tournamentBalls = 0;
      let matchFours = 0;
      let matchSixes = 0;
      let highestScore = player.highestScore || 0;
      let matchWickets = 0;
      let totalLegalBallsBowled = 0;
      let runsConceded = 0;

      matches.forEach(m => {
        [m.innings1, m.innings2].forEach(inn => {
          if (!inn) return;
          const bat = inn.battingScorecard.find(b => b.playerId === player.id);
          if (bat) {
            matchRuns += bat.runs || 0;
            tournamentBalls += bat.balls || 0;
            matchFours += bat.fours || 0;
            matchSixes += bat.sixes || 0;
            if (bat.runs > highestScore) highestScore = bat.runs;
          }

          const bowl = inn.bowlingScorecard.find(b => b.playerId === player.id);
          if (bowl) {
            matchWickets += bowl.wickets || 0;
            totalLegalBallsBowled += bowl.ballsLegal || 0;
            runsConceded += bowl.runsConceded || 0;
          }
        });
      });

      const tournamentRuns = Math.max(player.runsScored || 0, matchRuns);
      const tournamentWickets = Math.max(player.wicketsTaken || 0, matchWickets);
      const tournamentFours = player.fours !== undefined ? player.fours : matchFours;
      const tournamentSixes = player.sixes !== undefined ? player.sixes : matchSixes;

      const oversBowledDec = totalLegalBallsBowled / 6;
      const calcEconomy = player.economy && player.economy > 0
        ? player.economy
        : oversBowledDec > 0
        ? Number((runsConceded / oversBowledDec).toFixed(2))
        : 0;
      const calcStrikeRate = player.strikeRate && player.strikeRate > 0
        ? player.strikeRate
        : tournamentBalls > 0
        ? Number(((tournamentRuns / tournamentBalls) * 100).toFixed(1))
        : 0;
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
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-950 font-cabinet flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          Tournament Player Leaderboards & Caps
        </h2>
        <p className="text-xs text-slate-500 font-normal">
          Orange Cap (Most Runs), Purple Cap (Most Wickets), Maximum Sixes, and MVP Performance Rating
        </p>
      </div>

      {/* Top Cap Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Orange Cap Leader */}
        <div className="p-5 rounded-3xl border border-amber-200/90 bg-gradient-to-b from-amber-50/70 via-white to-white shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-900 border border-amber-300">
              👑 ORANGE CAP
            </span>
            <span className="text-xs font-semibold text-amber-700">Leading Run Scorer</span>
          </div>

          <div className="mt-4 flex items-center gap-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs border border-white"
              style={{ backgroundColor: topOrange?.team.primaryColor || '#ea580c' }}
            >
              {topOrange?.team.logo}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-cabinet">{topOrange?.player.name}</h3>
              <span className="text-xs text-slate-500 font-medium">{topOrange?.team.name}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Runs</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">{topOrange?.runs}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Strike Rate / HS</span>
              <span className="text-xs font-semibold text-slate-700 font-mono">{topOrange?.strikeRate} SR • HS {topOrange?.highestScore}</span>
            </div>
          </div>
        </div>

        {/* Purple Cap Leader */}
        <div className="p-5 rounded-3xl border border-purple-200/90 bg-gradient-to-b from-purple-50/70 via-white to-white shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
              🎯 PURPLE CAP
            </span>
            <span className="text-xs font-semibold text-purple-700">Leading Wicket Taker</span>
          </div>

          <div className="mt-4 flex items-center gap-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs border border-white"
              style={{ backgroundColor: topPurple?.team.primaryColor || '#9333ea' }}
            >
              {topPurple?.team.logo}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-cabinet">{topPurple?.player.name}</h3>
              <span className="text-xs text-slate-500 font-medium">{topPurple?.team.name}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Wickets</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">{topPurple?.wickets}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Economy / Best</span>
              <span className="text-xs font-semibold text-slate-700 font-mono">{topPurple?.economy} Econ • {topPurple?.player.bestBowling}</span>
            </div>
          </div>
        </div>

        {/* MVP Leader */}
        <div className="p-5 rounded-3xl border border-emerald-200/90 bg-gradient-to-b from-emerald-50/70 via-white to-white shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              ⚡ MVP RATING
            </span>
            <span className="text-xs font-semibold text-emerald-700">Tournament Index</span>
          </div>

          <div className="mt-4 flex items-center gap-3.5">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs border border-white"
              style={{ backgroundColor: topMvp?.team.primaryColor || '#059669' }}
            >
              {topMvp?.team.logo}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-cabinet">{topMvp?.player.name}</h3>
              <span className="text-xs text-slate-500 font-medium">{topMvp?.team.name}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">MVP Index</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">{topMvp?.mvpPoints} pts</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contribution</span>
              <span className="text-xs font-semibold text-slate-700 font-mono">{topMvp?.runs}r • {topMvp?.wickets}w</span>
            </div>
          </div>
        </div>

      </div>

      {/* Category Segmented Tabs + Player Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveStatTab('orange')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeStatTab === 'orange' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            👑 Most Runs (Orange Cap)
          </button>
          <button
            onClick={() => setActiveStatTab('purple')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeStatTab === 'purple' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🎯 Most Wickets (Purple Cap)
          </button>
          <button
            onClick={() => setActiveStatTab('sixes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeStatTab === 'sixes' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🚀 Maximum Sixes
          </button>
          <button
            onClick={() => setActiveStatTab('mvp')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeStatTab === 'mvp' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ⚡ MVP Index
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search player or club..."
            className="w-full h-8 pl-8 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#ff6a17]"
          />
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Athlete</th>
                <th className="p-4">Franchise</th>
                <th className="p-4 text-right">Matches</th>
                {activeStatTab === 'orange' && (
                  <>
                    <th className="p-4 text-right font-bold text-slate-900">Total Runs</th>
                    <th className="p-4 text-right">Highest</th>
                    <th className="p-4 text-right">Strike Rate</th>
                    <th className="p-4 text-right">4s / 6s</th>
                  </>
                )}
                {activeStatTab === 'purple' && (
                  <>
                    <th className="p-4 text-right font-bold text-slate-900">Wickets</th>
                    <th className="p-4 text-right">Best Bowling</th>
                    <th className="p-4 text-right">Economy</th>
                    <th className="p-4 text-right">Style</th>
                  </>
                )}
                {activeStatTab === 'sixes' && (
                  <>
                    <th className="p-4 text-right font-bold text-slate-900">Sixes</th>
                    <th className="p-4 text-right">Fours</th>
                    <th className="p-4 text-right">Runs</th>
                    <th className="p-4 text-right">Strike Rate</th>
                  </>
                )}
                {activeStatTab === 'mvp' && (
                  <>
                    <th className="p-4 text-right font-bold text-slate-900">MVP Points</th>
                    <th className="p-4 text-right">Runs</th>
                    <th className="p-4 text-right">Wickets</th>
                    <th className="p-4 text-right">Role</th>
                  </>
                )}
                {adminMode && <th className="p-4 text-right">Admin</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {(activeStatTab === 'orange' ? orangeCapList : activeStatTab === 'purple' ? purpleCapList : activeStatTab === 'sixes' ? sixesList : mvpList)
                .filter(entry => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    entry.player.name.toLowerCase().includes(q) ||
                    entry.team.name.toLowerCase().includes(q) ||
                    entry.team.code.toLowerCase().includes(q)
                  );
                })
                .slice(0, 20)
                .map((entry, idx) => (
                <tr key={entry.player.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-center font-bold text-slate-400 font-mono">
                    {idx === 0 ? <span className="text-amber-600 font-extrabold text-sm">🥇 1</span> : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : idx + 1}
                  </td>

                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span>{entry.player.name}</span>
                      {entry.player.isCaptain && <span className="text-[10px] text-amber-600 font-bold">(C)</span>}
                    </div>
                  </td>

                  <td className="p-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>{entry.team.logo}</span>
                      <span className="text-xs">{entry.team.name}</span>
                    </div>
                  </td>

                  <td className="p-4 text-right text-slate-500 font-mono">{entry.player.matchesPlayed || 4}</td>

                  {activeStatTab === 'orange' && (
                    <>
                      <td className="p-4 text-right font-bold text-slate-900 font-mono text-sm">{entry.runs}</td>
                      <td className="p-4 text-right text-slate-700 font-mono">{entry.highestScore}</td>
                      <td className="p-4 text-right text-slate-700 font-mono">{entry.strikeRate.toFixed(1)}</td>
                      <td className="p-4 text-right text-slate-500 font-mono">{entry.fours} / {entry.sixes}</td>
                    </>
                  )}

                  {activeStatTab === 'purple' && (
                    <>
                      <td className="p-4 text-right font-bold text-slate-900 font-mono text-sm">{entry.wickets}</td>
                      <td className="p-4 text-right text-slate-700 font-mono">{entry.player.bestBowling}</td>
                      <td className="p-4 text-right text-slate-700 font-mono">{entry.economy.toFixed(2)}</td>
                      <td className="p-4 text-right text-slate-500">{entry.player.bowlingStyle}</td>
                    </>
                  )}

                  {activeStatTab === 'sixes' && (
                    <>
                      <td className="p-4 text-right font-bold text-slate-900 font-mono text-sm">{entry.sixes}</td>
                      <td className="p-4 text-right text-slate-700 font-mono">{entry.fours}</td>
                      <td className="p-4 text-right text-slate-700 font-mono">{entry.runs}</td>
                      <td className="p-4 text-right text-slate-500 font-mono">{entry.strikeRate.toFixed(1)}</td>
                    </>
                  )}

                  {activeStatTab === 'mvp' && (
                    <>
                      <td className="p-4 text-right font-bold text-slate-900 font-mono text-sm">{entry.mvpPoints}</td>
                      <td className="p-4 text-right text-slate-700 font-mono">{entry.runs}</td>
                      <td className="p-4 text-right text-slate-700 font-mono">{entry.wickets}</td>
                      <td className="p-4 text-right text-slate-500 capitalize">{entry.player.role.replace('_', ' ')}</td>
                    </>
                  )}
                  {adminMode && (
                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          setEditingPlayer({
                            player: entry.player,
                            team: entry.team,
                            fours: entry.fours,
                            sixes: entry.sixes,
                          })
                        }
                        className="h-7 px-2.5 rounded-full bg-[#ff6a17] text-[#090909] hover:bg-[#090909] hover:text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Edit Runs, Wickets, Sixes & Averages"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Player Stats Modal */}
      <EditPlayerStatsModal
        player={editingPlayer?.player || null}
        team={editingPlayer?.team || null}
        computedFours={editingPlayer?.fours || 0}
        computedSixes={editingPlayer?.sixes || 0}
        onClose={() => setEditingPlayer(null)}
      />
    </div>
  );
};
