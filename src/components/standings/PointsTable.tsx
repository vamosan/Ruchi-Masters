import React, { useState } from 'react';
import { 
  TableProperties, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Info, 
  Award,
  Sparkles,
  Filter
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { calculatePointsTable } from '../../utils/nrrCalculator';
import { PointsTableEntry } from '../../types/cricket';

export const PointsTable: React.FC = () => {
  const { teams, matches, tournament } = useTournament();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showNrrExplainer, setShowNrrExplainer] = useState(false);

  const standings = calculatePointsTable(teams, matches, tournament.rules);

  const groups = Array.from(new Set(teams.map(t => t.group).filter(Boolean)));

  const filteredStandings = standings.filter(entry => {
    if (selectedGroup === 'all') return true;
    return entry.group === selectedGroup;
  });

  const getFormBadge = (form: 'W' | 'L' | 'T' | 'NR') => {
    switch (form) {
      case 'W':
        return <span key={Math.random()} className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">W</span>;
      case 'L':
        return <span key={Math.random()} className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">L</span>;
      case 'T':
        return <span key={Math.random()} className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">T</span>;
      case 'NR':
        return <span key={Math.random()} className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 font-bold text-[10px] flex items-center justify-center">N</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <TableProperties className="w-6 h-6 text-amber-400" />
            Tournament Standings & Net Run Rate (NRR)
          </h2>
          <p className="text-xs text-slate-400">
            Certified ICC Net Run Rate rules applied • Top 4 advance to Championship Playoffs
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Group Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedGroup === 'all' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Overall Table
            </button>
            {groups.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g!)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedGroup === g ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowNrrExplainer(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            NRR Formula
          </button>
        </div>
      </div>

      {/* Standings Table Card */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Team</th>
                <th className="p-4 text-center">P</th>
                <th className="p-4 text-center">W</th>
                <th className="p-4 text-center">L</th>
                <th className="p-4 text-center">T</th>
                <th className="p-4 text-center">NR</th>
                <th className="p-4 text-center font-bold text-amber-400">PTS</th>
                <th className="p-4 text-center font-bold text-emerald-400">NRR</th>
                <th className="p-4 text-center hidden md:table-cell">For (Runs/Ov)</th>
                <th className="p-4 text-center hidden md:table-cell">Against (Runs/Ov)</th>
                <th className="p-4 text-center">Form</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredStandings.map((entry, idx) => {
                const isPlayoffZone = idx < 4;
                return (
                  <tr 
                    key={entry.teamId}
                    className={`hover:bg-slate-800/30 transition-colors ${
                      isPlayoffZone ? 'bg-amber-500/[0.02]' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="p-4 text-center font-black text-slate-300 font-mono text-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={idx === 0 ? 'text-amber-400 font-extrabold text-base' : ''}>{idx + 1}</span>
                        {idx === 0 && <span className="text-amber-400">👑</span>}
                      </div>
                    </td>

                    {/* Team Name & Logo */}
                    <td className="p-4 font-bold text-white">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{entry.teamLogo}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-white">{entry.teamName}</span>
                            {entry.isQualified && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500 text-slate-950 uppercase">
                                Q
                              </span>
                            )}
                            {entry.isEliminated && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-900/60 text-rose-300 border border-rose-800 uppercase">
                                E
                              </span>
                            )}
                          </div>
                          
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center text-slate-300 font-mono">{entry.played}</td>
                    <td className="p-4 text-center font-bold text-emerald-400 font-mono">{entry.won}</td>
                    <td className="p-4 text-center font-bold text-rose-400 font-mono">{entry.lost}</td>
                    <td className="p-4 text-center text-slate-400 font-mono">{entry.tied}</td>
                    <td className="p-4 text-center text-slate-400 font-mono">{entry.noResult}</td>
                    
                    {/* Points */}
                    <td className="p-4 text-center font-black text-amber-400 font-mono text-base bg-amber-500/5">
                      {entry.points}
                    </td>

                    {/* NRR */}
                    <td className={`p-4 text-center font-mono font-bold text-sm ${entry.nrr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {entry.nrr > 0 ? `+${entry.nrr.toFixed(3)}` : entry.nrr.toFixed(3)}
                    </td>

                    {/* Runs For / Against */}
                    <td className="p-4 text-center text-slate-300 font-mono text-[11px] hidden md:table-cell">
                      {entry.runsScored} / {entry.legalOversFaced} ov
                    </td>
                    <td className="p-4 text-center text-slate-300 font-mono text-[11px] hidden md:table-cell">
                      {entry.runsConceded} / {entry.legalOversBowled} ov
                    </td>

                    {/* Form Guide */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {entry.form.length > 0 ? (
                          entry.form.map(f => getFormBadge(f))
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend strip */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <strong>Rank 1 to 4:</strong> Qualify for Semi-Finals
            </span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500 text-slate-950 uppercase">Q</span>
              Qualified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-900/60 text-rose-300 border border-rose-800 uppercase">E</span>
              Eliminated
            </span>
          </div>

          <div>
            Tie-Breaker Hierarchy: <strong>Points &gt; Wins &gt; Net Run Rate (NRR) &gt; Head-to-Head</strong>
          </div>
        </div>
      </div>

      {/* NRR Explainer Dialog */}
      {showNrrExplainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                ICC Net Run Rate (NRR) Formula Explained
              </h3>
              <button onClick={() => setShowNrrExplainer(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-center text-amber-400 text-sm">
                NRR = (Total Runs Scored / Overs Faced) - (Total Runs Conceded / Overs Bowled)
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Key International Tournament Rules:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-[11px]">
                  <li>
                    <strong>All-Out Rule:</strong> If a team is bowled all out before their allotted quota of overs, their overs faced are counted as the full {tournament.rules.oversPerInnings}.0 overs.
                  </li>
                  <li>
                    <strong>Incomplete Overs:</strong> 18.2 overs is converted to 18 + (2/6) = 18.333 overs for exact rate mathematics.
                  </li>
                  <li>
                    <strong>Abandoned Matches:</strong> Matches with no result or abandoned without a ball bowled are excluded from NRR calculation.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowNrrExplainer(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
