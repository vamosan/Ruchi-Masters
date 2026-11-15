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
  Filter,
  X,
  Edit3
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { calculatePointsTable } from '../../utils/nrrCalculator';
import { PointsTableEntry } from '../../types/cricket';
import { EditStandingsModal } from './EditStandingsModal';

export const PointsTable: React.FC = () => {
  const { teams, matches, tournament, isAdmin } = useTournament();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showNrrExplainer, setShowNrrExplainer] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PointsTableEntry | null>(null);
  const adminMode = isAdmin();

  const standings = calculatePointsTable(teams, matches, tournament.rules);

  const groups = Array.from(new Set(teams.map(t => t.group).filter(Boolean))).sort();

  const filteredStandings = standings.filter(entry => {
    if (selectedGroup === 'all') return true;
    return entry.group === selectedGroup;
  });

  const getFormBadge = (form: 'W' | 'L' | 'T' | 'NR', i: number) => {
    switch (form) {
      case 'W':
        return <span key={i} className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">W</span>;
      case 'L':
        return <span key={i} className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center">L</span>;
      case 'T':
        return <span key={i} className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">T</span>;
      case 'NR':
        return <span key={i} className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">N</span>;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 font-cabinet flex items-center gap-2">
            <TableProperties className="w-6 h-6 text-amber-500" />
            Tournament Standings & Net Run Rate (NRR)
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Certified ICC Net Run Rate rules applied • Top 2 from each group advance to Knockouts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Group Filter */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedGroup === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Groups
            </button>
            {groups.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g!)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedGroup === g ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowNrrExplainer(true)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>NRR Formula</span>
          </button>
        </div>
      </div>

      {/* Standings Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="p-4 text-center w-12">#</th>
                <th className="p-4">Franchise</th>
                <th className="p-4 text-center">P</th>
                <th className="p-4 text-center">W</th>
                <th className="p-4 text-center">L</th>
                <th className="p-4 text-center">T</th>
                <th className="p-4 text-center">NR</th>
                <th className="p-4 text-center font-bold text-slate-950">PTS</th>
                <th className="p-4 text-center font-bold text-emerald-700">NRR</th>
                <th className="p-4 text-center hidden md:table-cell">For (Runs/Ov)</th>
                <th className="p-4 text-center hidden md:table-cell">Against (Runs/Ov)</th>
                <th className="p-4 text-center">Form</th>
                {adminMode && <th className="p-4 text-right">Admin</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredStandings.map((entry, idx) => {
                const isPlayoffZone = selectedGroup === 'all' ? Boolean(entry.isQualified) : idx < 2;
                return (
                  <tr 
                    key={entry.teamId}
                    className={`hover:bg-slate-50 transition-colors ${
                      isPlayoffZone ? 'border-l-4 border-l-amber-500' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="p-4 text-center font-bold font-mono text-xs text-slate-500">
                      <div className="flex items-center justify-center gap-1">
                        <span className={idx === 0 ? 'text-amber-600 font-extrabold text-sm' : ''}>{idx + 1}</span>
                        {idx === 0 && <span className="text-amber-500">👑</span>}
                      </div>
                    </td>

                    {/* Team Name */}
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{entry.teamLogo}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900 font-cabinet">{entry.teamName}</span>
                            {entry.isQualified && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                                Q
                              </span>
                            )}
                            {entry.isEliminated && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-rose-100 text-rose-700 uppercase">
                                E
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center font-mono">{entry.played}</td>
                    <td className="p-4 text-center font-semibold text-emerald-700 font-mono">{entry.won}</td>
                    <td className="p-4 text-center font-semibold text-rose-600 font-mono">{entry.lost}</td>
                    <td className="p-4 text-center text-slate-400 font-mono">{entry.tied}</td>
                    <td className="p-4 text-center text-slate-400 font-mono">{entry.noResult}</td>
                    
                    {/* Points */}
                    <td className="p-4 text-center font-bold text-slate-950 font-mono text-sm bg-slate-50/70">
                      {entry.points}
                    </td>

                    {/* NRR */}
                    <td className={`p-4 text-center font-mono font-bold text-xs ${entry.nrr >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {entry.nrr > 0 ? `+${entry.nrr.toFixed(3)}` : entry.nrr.toFixed(3)}
                    </td>

                    {/* Runs For / Against */}
                    <td className="p-4 text-center text-slate-500 font-mono text-[11px] hidden md:table-cell">
                      {entry.runsScored} / {entry.legalOversFaced} ov
                    </td>
                    <td className="p-4 text-center text-slate-500 font-mono text-[11px] hidden md:table-cell">
                      {entry.runsConceded} / {entry.legalOversBowled} ov
                    </td>

                    {/* Form Guide */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {entry.form.length > 0 ? (
                          entry.form.map((f, i) => getFormBadge(f, i))
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </div>
                    </td>
                    {adminMode && (
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setEditingEntry(entry)}
                          className="h-7 px-2.5 rounded-full bg-[#ff6a17] text-[#090909] hover:bg-[#090909] hover:text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit Points, Wins, NRR or Group"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend strip */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <strong>Rank 1 to 4:</strong> Advance to Semi-Finals
            </span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase">Q</span>
              Qualified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-rose-100 text-rose-700 uppercase">E</span>
              Eliminated
            </span>
          </div>

          <div>
            Tie-Breaker: <strong>Points &gt; Wins &gt; NRR &gt; Head-to-Head</strong>
          </div>
        </div>
      </div>

      {/* NRR Explainer Dialog */}
      {showNrrExplainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-cabinet">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                ICC Net Run Rate (NRR) Formula Explained
              </h3>
              <button onClick={() => setShowNrrExplainer(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-center text-slate-900 font-bold text-xs">
                NRR = (Total Runs Scored / Overs Faced) - (Total Runs Conceded / Overs Bowled)
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Key Tournament Rules:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
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

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowNrrExplainer(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Standings Modal */}
      <EditStandingsModal
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
      />
    </div>
  );
};
