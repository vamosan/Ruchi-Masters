import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, TableProperties } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { PointsTableEntry, StandingsOverride } from '../../types/cricket';

interface Props {
  entry: PointsTableEntry | null;
  onClose: () => void;
}

export const EditStandingsModal: React.FC<Props> = ({ entry, onClose }) => {
  const { teams, updateTeam } = useTournament();
  const team = entry ? teams.find(t => t.id === entry.teamId) : null;

  const [group, setGroup] = useState('Group A');
  const [played, setPlayed] = useState(0);
  const [won, setWon] = useState(0);
  const [lost, setLost] = useState(0);
  const [tied, setTied] = useState(0);
  const [noResult, setNoResult] = useState(0);
  const [points, setPoints] = useState(0);
  const [nrr, setNrr] = useState('0.000');

  useEffect(() => {
    if (!entry) return;
    setGroup(team?.group || entry.group || 'Group A');
    setPlayed(entry.played);
    setWon(entry.won);
    setLost(entry.lost);
    setTied(entry.tied);
    setNoResult(entry.noResult);
    setPoints(entry.points);
    setNrr(entry.nrr.toFixed(3));
  }, [entry, team]);

  if (!entry || !team) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const override: StandingsOverride = {
      played: Number(played) || 0,
      won: Number(won) || 0,
      lost: Number(lost) || 0,
      tied: Number(tied) || 0,
      noResult: Number(noResult) || 0,
      points: Number(points) || 0,
      nrr: Number(nrr) || 0,
    };
    updateTeam({
      ...team,
      group: group.trim() || team.group,
      standingsOverride: override,
    });
    onClose();
  };

  const handleResetAuto = () => {
    const { standingsOverride: _removed, ...rest } = team;
    updateTeam({
      ...rest,
      group: group.trim() || team.group,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#090909]/15 rounded-[12px] max-w-md w-full p-6 shadow-2xl space-y-4 my-auto text-[#090909]">
        <div className="flex items-center justify-between border-b border-[#090909]/10 pb-3">
          <div>
            <h3 className="text-[17px] font-bold flex items-center gap-2">
              <TableProperties className="w-5 h-5 text-[#ff6a17]" />
              Edit Standings Row
            </h3>
            <p className="text-xs text-[#736e6e] mt-0.5">
              {team.logo} {team.name} ({team.code})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6f4f4] hover:bg-[#090909] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
              Division Group
            </label>
            <input
              type="text"
              value={group}
              onChange={e => setGroup(e.target.value)}
              placeholder="Group A / Group B / Group C / Group D"
              className="w-full h-9 px-3 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-semibold"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Played (P)</label>
              <input
                type="number"
                min={0}
                value={played}
                onChange={e => setPlayed(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Won (W)</label>
              <input
                type="number"
                min={0}
                value={won}
                onChange={e => {
                  const w = Number(e.target.value) || 0;
                  setWon(w);
                  setPoints(w * 2 + tied + noResult);
                }}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono font-bold text-emerald-700"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Lost (L)</label>
              <input
                type="number"
                min={0}
                value={lost}
                onChange={e => setLost(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono font-bold text-rose-600"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Tied (T)</label>
              <input
                type="number"
                min={0}
                value={tied}
                onChange={e => setTied(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">No Result</label>
              <input
                type="number"
                min={0}
                value={noResult}
                onChange={e => setNoResult(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Points</label>
              <input
                type="number"
                min={0}
                value={points}
                onChange={e => setPoints(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-amber-50 font-mono font-black"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
              Net Run Rate (NRR)
            </label>
            <input
              type="number"
              step="0.001"
              value={nrr}
              onChange={e => setNrr(e.target.value)}
              className="w-full h-9 px-3 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono font-bold"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#090909]/10">
            {team.standingsOverride ? (
              <button
                type="button"
                onClick={handleResetAuto}
                className="h-9 px-3 rounded-full border border-[#090909]/20 text-[11px] font-bold text-[#575252] hover:text-[#090909] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Auto-Calc
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rally-btn rally-btn-ghost-dark !h-9 !px-4 !text-[12px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rally-btn rally-btn-primary !h-9 !px-4 !text-[12px]"
              >
                <Save className="w-3.5 h-3.5" />
                Save Standings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
