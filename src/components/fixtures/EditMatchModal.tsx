import React, { useState, useEffect } from 'react';
import { Calendar, X, Trophy, Save } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Match, MatchStage, MatchStatus, Innings } from '../../types/cricket';
import { oversStrToDecimal } from '../../utils/cricketEngine';

interface Props {
  match: Match | null;
  onClose: () => void;
}

function buildEmptyInnings(
  inningsNumber: 1 | 2,
  battingTeamId: string,
  bowlingTeamId: string,
  runs: number,
  wickets: number,
  oversStr: string,
  target?: number
): Innings {
  const legalBalls = Math.round(oversStrToDecimal(oversStr || '0') * 6);
  return {
    inningsNumber,
    battingTeamId,
    bowlingTeamId,
    totalRuns: Math.max(0, runs),
    totalWickets: Math.min(10, Math.max(0, wickets)),
    oversCompletedStr: oversStr || '0.0',
    legalBallsBowled: legalBalls,
    target,
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0, total: 0 },
    battingScorecard: [],
    bowlingScorecard: [],
    fallOfWickets: [],
    ballsHistory: [],
    isCompleted: true,
  };
}

export const EditMatchModal: React.FC<Props> = ({ match, onClose }) => {
  const { teams, updateMatch } = useTournament();

  const [title, setTitle] = useState('');
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [stage, setStage] = useState<MatchStage>('Group Stage');
  const [group, setGroup] = useState('Group A');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [status, setStatus] = useState<MatchStatus>('scheduled');

  // Optional direct score & result fields
  const [inn1TeamId, setInn1TeamId] = useState('');
  const [inn1Runs, setInn1Runs] = useState<string>('');
  const [inn1Wickets, setInn1Wickets] = useState<string>('');
  const [inn1Overs, setInn1Overs] = useState<string>('20.0');

  const [inn2TeamId, setInn2TeamId] = useState('');
  const [inn2Runs, setInn2Runs] = useState<string>('');
  const [inn2Wickets, setInn2Wickets] = useState<string>('');
  const [inn2Overs, setInn2Overs] = useState<string>('20.0');

  const [winnerTeamId, setWinnerTeamId] = useState<string>('');
  const [winMargin, setWinMargin] = useState<string>('');

  useEffect(() => {
    if (!match) return;
    setTitle(match.title);
    setTeamAId(match.teamAId);
    setTeamBId(match.teamBId);
    setStage(match.stage);
    setGroup(match.group || '');
    setDate(match.date);
    setTime(match.time || '19:30');
    setVenue(match.venue || 'Apex Oval Complex');
    setStatus(match.status);

    setInn1TeamId(match.innings1?.battingTeamId || match.teamAId);
    setInn1Runs(match.innings1 ? String(match.innings1.totalRuns) : '');
    setInn1Wickets(match.innings1 ? String(match.innings1.totalWickets) : '');
    setInn1Overs(match.innings1?.oversCompletedStr || '20.0');

    setInn2TeamId(match.innings2?.battingTeamId || match.teamBId);
    setInn2Runs(match.innings2 ? String(match.innings2.totalRuns) : '');
    setInn2Wickets(match.innings2 ? String(match.innings2.totalWickets) : '');
    setInn2Overs(match.innings2?.oversCompletedStr || '20.0');

    setWinnerTeamId(match.winnerTeamId || '');
    setWinMargin(match.winMargin || '');
  }, [match]);

  if (!match) return null;

  const teamA = teams.find(t => t.id === teamAId);
  const teamB = teams.find(t => t.id === teamBId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamAId === teamBId) {
      alert('Team A and Team B must be different clubs.');
      return;
    }

    const updated: Match = {
      ...match,
      title: title.trim() || `Match ${match.matchNumber} • ${stage}`,
      teamAId,
      teamBId,
      stage,
      group: group || undefined,
      date,
      time,
      venue,
      status,
      winnerTeamId: winnerTeamId || undefined,
      winMargin: winMargin.trim() || undefined,
    };

    // Update innings 1 if score was entered or existed
    if (inn1Runs.trim() !== '') {
      const bat1 = inn1TeamId || teamAId;
      const bowl1 = bat1 === teamAId ? teamBId : teamAId;
      const r1 = Number(inn1Runs) || 0;
      const w1 = Number(inn1Wickets) || 0;
      if (match.innings1) {
        updated.innings1 = {
          ...match.innings1,
          battingTeamId: bat1,
          bowlingTeamId: bowl1,
          totalRuns: r1,
          totalWickets: Math.min(10, Math.max(0, w1)),
          oversCompletedStr: inn1Overs || '20.0',
          legalBallsBowled: Math.round(oversStrToDecimal(inn1Overs || '20.0') * 6),
        };
      } else {
        updated.innings1 = buildEmptyInnings(1, bat1, bowl1, r1, w1, inn1Overs || '20.0');
      }
    }

    // Update innings 2 if score was entered or existed
    if (inn2Runs.trim() !== '') {
      const bat2 =
        inn2TeamId && inn2TeamId !== (updated.innings1?.battingTeamId || teamAId)
          ? inn2TeamId
          : (updated.innings1?.bowlingTeamId || teamBId);
      const bowl2 = bat2 === teamAId ? teamBId : teamAId;
      const r2 = Number(inn2Runs) || 0;
      const w2 = Number(inn2Wickets) || 0;
      const target = updated.innings1 ? updated.innings1.totalRuns + 1 : undefined;
      if (match.innings2) {
        updated.innings2 = {
          ...match.innings2,
          battingTeamId: bat2,
          bowlingTeamId: bowl2,
          totalRuns: r2,
          totalWickets: Math.min(10, Math.max(0, w2)),
          oversCompletedStr: inn2Overs || '20.0',
          legalBallsBowled: Math.round(oversStrToDecimal(inn2Overs || '20.0') * 6),
          target,
        };
      } else {
        updated.innings2 = buildEmptyInnings(2, bat2, bowl2, r2, w2, inn2Overs || '20.0', target);
      }
    }

    updateMatch(updated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-[#090909]/15 rounded-[12px] max-w-2xl w-full p-6 shadow-2xl space-y-5 my-auto text-[#090909]">
        <div className="flex items-center justify-between border-b border-[#090909]/10 pb-3">
          <h3 className="text-[18px] font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#ff6a17]" />
            Edit Fixture &amp; Match Result
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6f4f4] hover:bg-[#090909] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Match Title & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
                Match Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] text-[#090909] font-medium focus:outline-none focus:border-[#ff6a17]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
                Match Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as MatchStatus)}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] text-[#090909] font-bold focus:outline-none focus:border-[#ff6a17]"
              >
                <option value="scheduled">Scheduled</option>
                <option value="toss">Toss</option>
                <option value="live">Live</option>
                <option value="innings_break">Innings Break</option>
                <option value="completed">Completed (Updates Standings)</option>
                <option value="abandoned">Abandoned (No Result)</option>
              </select>
            </div>
          </div>

          {/* Teams */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
                Team A
              </label>
              <select
                value={teamAId}
                onChange={e => setTeamAId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] text-[#090909] font-bold focus:outline-none focus:border-[#ff6a17]"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
                Team B
              </label>
              <select
                value={teamBId}
                onChange={e => setTeamBId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] text-[#090909] font-bold focus:outline-none focus:border-[#ff6a17]"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stage, Group, Date, Time, Venue */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
                Stage
              </label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value as MatchStage)}
                className="w-full h-9 px-2 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] text-[#090909] font-medium"
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
              <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
                Group
              </label>
              <input
                type="text"
                value={group}
                onChange={e => setGroup(e.target.value)}
                placeholder="e.g. Group A"
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] text-[#090909]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] text-[#090909]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full h-9 px-2.5 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] text-[#090909]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#575252] mb-1">
              Venue / Ground
            </label>
            <input
              type="text"
              value={venue}
              onChange={e => setVenue(e.target.value)}
              className="w-full h-9 px-3 rounded-[6px] border border-[#090909]/20 bg-[#f6f4f4] text-[#090909]"
            />
          </div>

          {/* Direct Score & Result Entry (Auto-Updates Standings & NRR) */}
          <div className="p-4 rounded-[8px] bg-[#f6f4f4] border border-[#090909]/12 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#090909] flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#ff6a17]" />
                Scores &amp; Final Result (Auto-calculates Standings &amp; NRR)
              </span>
              <span className="text-[11px] text-[#736e6e]">Optional for upcoming fixtures</span>
            </div>

            {/* Innings 1 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 sm:col-span-5">
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  1st Innings Batting
                </label>
                <select
                  value={inn1TeamId}
                  onChange={e => setInn1TeamId(e.target.value)}
                  className="w-full h-8 px-2 rounded bg-white border border-[#090909]/15 font-semibold"
                >
                  <option value={teamAId}>{teamA?.name || 'Team A'}</option>
                  <option value={teamBId}>{teamB?.name || 'Team B'}</option>
                </select>
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  Runs
                </label>
                <input
                  type="number"
                  min={0}
                  value={inn1Runs}
                  onChange={e => setInn1Runs(e.target.value)}
                  placeholder="180"
                  className="w-full h-8 px-2 rounded bg-white border border-[#090909]/15 font-mono"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  Wkts
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={inn1Wickets}
                  onChange={e => setInn1Wickets(e.target.value)}
                  placeholder="6"
                  className="w-full h-8 px-2 rounded bg-white border border-[#090909]/15 font-mono"
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  Overs
                </label>
                <input
                  type="text"
                  value={inn1Overs}
                  onChange={e => setInn1Overs(e.target.value)}
                  placeholder="20.0"
                  className="w-full h-8 px-2 rounded bg-white border border-[#090909]/15 font-mono"
                />
              </div>
            </div>

            {/* Innings 2 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-12 sm:col-span-5">
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  2nd Innings Batting
                </label>
                <select
                  value={inn2TeamId}
                  onChange={e => setInn2TeamId(e.target.value)}
                  className="w-full h-8 px-2 rounded bg-white border border-[#090909]/15 font-semibold"
                >
                  <option value={teamBId}>{teamB?.name || 'Team B'}</option>
                  <option value={teamAId}>{teamA?.name || 'Team A'}</option>
                </select>
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  Runs
                </label>
                <input
                  type="number"
                  min={0}
                  value={inn2Runs}
                  onChange={e => setInn2Runs(e.target.value)}
                  placeholder="165"
                  className="w-full h-8 px-2 rounded bg-white border border-[#090909]/15 font-mono"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  Wkts
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={inn2Wickets}
                  onChange={e => setInn2Wickets(e.target.value)}
                  placeholder="8"
                  className="w-full h-8 px-2 rounded bg-white border border-[#090909]/15 font-mono"
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  Overs
                </label>
                <input
                  type="text"
                  value={inn2Overs}
                  onChange={e => setInn2Overs(e.target.value)}
                  placeholder="20.0"
                  className="w-full h-8 px-2 rounded bg-white border border-[#090909]/15 font-mono"
                />
              </div>
            </div>

            {/* Winner & Margin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  Match Winner
                </label>
                <select
                  value={winnerTeamId}
                  onChange={e => setWinnerTeamId(e.target.value)}
                  className="w-full h-8 px-2 rounded bg-white border border-[#090909]/15 font-bold"
                >
                  <option value="">-- Tie / No Winner Yet --</option>
                  <option value={teamAId}>{teamA?.name || 'Team A'}</option>
                  <option value={teamBId}>{teamB?.name || 'Team B'}</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#736e6e] mb-0.5">
                  Result Note / Win Margin
                </label>
                <input
                  type="text"
                  value={winMargin}
                  onChange={e => setWinMargin(e.target.value)}
                  placeholder="e.g. Royal Strikers won by 15 runs"
                  className="w-full h-8 px-2.5 rounded bg-white border border-[#090909]/15"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-[#090909]/10">
            <button
              type="button"
              onClick={onClose}
              className="rally-btn rally-btn-ghost-dark !h-9 !px-4 !text-[12px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rally-btn rally-btn-primary !h-9 !px-5 !text-[12px]"
            >
              <Save className="w-3.5 h-3.5" />
              Save Fixture &amp; Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
