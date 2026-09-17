import React, { useState } from 'react';
import { Calendar, Plus, X, MapPin } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Match, MatchStage } from '../../types/cricket';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleMatchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { teams, matches, scheduleMatch } = useTournament();

  const [teamAId, setTeamAId] = useState(teams[0]?.id || '');
  const [teamBId, setTeamBId] = useState(teams[1]?.id || '');
  const [stage, setStage] = useState<MatchStage>('Group Stage');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('19:30');
  const [venue, setVenue] = useState('Apex Oval Complex');
  const [pitchCondition, setPitchCondition] = useState('Batting friendly, good bounce');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamAId === teamBId) {
      alert('Please select two distinct teams for the match.');
      return;
    }

    const matchNum = matches.length + 1;
    const teamA = teams.find(t => t.id === teamAId);
    const teamB = teams.find(t => t.id === teamBId);

    const newMatch: Match = {
      id: `m-${Date.now()}`,
      matchNumber: matchNum,
      title: `Match ${matchNum} • ${stage}`,
      stage,
      group: teamA?.group === teamB?.group ? teamA?.group : undefined,
      teamAId,
      teamBId,
      date,
      time,
      venue,
      pitchCondition,
      status: 'scheduled',
      currentInningsNumber: 1
    };

    scheduleMatch(newMatch);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Schedule New Tournament Fixture
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Team 1 (Home)</label>
              <select
                value={teamAId}
                onChange={e => setTeamAId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Team 2 (Away)</label>
              <select
                value={teamBId}
                onChange={e => setTeamBId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Tournament Stage</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as MatchStage)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Group Stage">Group Stage</option>
                <option value="Super 8">Super 8</option>
                <option value="Quarter Final">Quarter Final</option>
                <option value="Semi Final 1">Semi Final 1</option>
                <option value="Semi Final 2">Semi Final 2</option>
                <option value="3rd Place Playoff">3rd Place Playoff</option>
                <option value="Grand Final">Grand Final</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Match Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Match Start Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Host Venue</label>
              <select
                value={venue}
                onChange={e => setVenue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Apex Oval Complex">Apex Oval Complex</option>
                <option value="Eden Gardens Park">Eden Gardens Park</option>
                <option value="Royal Park Stadium">Royal Park Stadium</option>
                <option value="Wankhede Arena">Wankhede Arena</option>
                <option value="Chepauk Fortress">Chepauk Fortress</option>
                <option value="Metro Stadium">Metro Stadium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Pitch & Weather Condition Note</label>
            <input
              type="text"
              placeholder="e.g. Dry surface, expected to assist spin in 2nd half"
              value={pitchCondition}
              onChange={e => setPitchCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
            >
              Schedule Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
