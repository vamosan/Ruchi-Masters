import React, { useState, useEffect } from 'react';
import { X, Save, Award } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Player, Team } from '../../types/cricket';

interface Props {
  player: Player | null;
  team?: Team | null;
  computedFours?: number;
  computedSixes?: number;
  onClose: () => void;
}

export const EditPlayerStatsModal: React.FC<Props> = ({
  player,
  team,
  computedFours = 0,
  computedSixes = 0,
  onClose,
}) => {
  const { updatePlayer, teams } = useTournament();

  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [runsScored, setRunsScored] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [strikeRate, setStrikeRate] = useState('0');
  const [fours, setFours] = useState(0);
  const [sixes, setSixes] = useState(0);
  const [wicketsTaken, setWicketsTaken] = useState(0);
  const [bestBowling, setBestBowling] = useState('0/0');
  const [economy, setEconomy] = useState('0');

  useEffect(() => {
    if (!player) return;
    setMatchesPlayed(player.matchesPlayed || 0);
    setRunsScored(player.runsScored || 0);
    setHighestScore(player.highestScore || 0);
    setStrikeRate(String(player.strikeRate || 0));
    setFours(player.fours ?? computedFours);
    setSixes(player.sixes ?? computedSixes);
    setWicketsTaken(player.wicketsTaken || 0);
    setBestBowling(player.bestBowling || '0/0');
    setEconomy(String(player.economy || 0));
  }, [player, computedFours, computedSixes]);

  if (!player) return null;

  const ownerTeam = team || teams.find(t => t.id === player.teamId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlayer(player.teamId, {
      ...player,
      matchesPlayed: Number(matchesPlayed) || 0,
      runsScored: Number(runsScored) || 0,
      highestScore: Number(highestScore) || 0,
      strikeRate: Number(strikeRate) || 0,
      fours: Number(fours) || 0,
      sixes: Number(sixes) || 0,
      wicketsTaken: Number(wicketsTaken) || 0,
      bestBowling: bestBowling.trim() || '0/0',
      economy: Number(economy) || 0,
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
      <div className="bg-white border border-[#090909]/15 rounded-[12px] max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto text-[#090909]">
        <div className="flex items-center justify-between border-b border-[#090909]/10 pb-3">
          <div>
            <h3 className="text-[17px] font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ff6a17]" />
              Edit Player Statistics
            </h3>
            <p className="text-xs text-[#736e6e] mt-0.5">
              {player.name} · {ownerTeam?.name || 'Club'}
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
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Matches</label>
              <input
                type="number"
                min={0}
                value={matchesPlayed}
                onChange={e => setMatchesPlayed(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#ff6a17] mb-1">Total Runs</label>
              <input
                type="number"
                min={0}
                value={runsScored}
                onChange={e => setRunsScored(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-amber-50 font-mono font-black"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Highest Score</label>
              <input
                type="number"
                min={0}
                value={highestScore}
                onChange={e => setHighestScore(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Fours (4s)</label>
              <input
                type="number"
                min={0}
                value={fours}
                onChange={e => setFours(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Sixes (6s)</label>
              <input
                type="number"
                min={0}
                value={sixes}
                onChange={e => setSixes(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Strike Rate</label>
              <input
                type="number"
                step="0.1"
                min={0}
                value={strikeRate}
                onChange={e => setStrikeRate(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-purple-700 mb-1">Wickets</label>
              <input
                type="number"
                min={0}
                value={wicketsTaken}
                onChange={e => setWicketsTaken(Number(e.target.value))}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-purple-50 font-mono font-black"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Best Bowling</label>
              <input
                type="text"
                value={bestBowling}
                onChange={e => setBestBowling(e.target.value)}
                placeholder="e.g. 4/18"
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-[#575252] mb-1">Economy</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={economy}
                onChange={e => setEconomy(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#090909]/10">
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
              Save Player Stats
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
