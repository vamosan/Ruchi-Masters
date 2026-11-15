import React, { useState, useMemo, useEffect } from 'react';
import { ArrowUpRight, Swords, Flame, CheckCircle2 } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { calculatePointsTable } from '../../utils/nrrCalculator';

interface PollState {
  matchVote?: 'A' | 'B';
  matchVotesA: number;
  matchVotesB: number;
  groupVote?: string;
  groupVotes: Record<string, number>;
}

const POLL_STORAGE_KEY = 'ruchi_masters_club_polls_v1';

const DEFAULT_POLL_STATE: PollState = {
  matchVotesA: 142,
  matchVotesB: 118,
  groupVotes: {
    'Group A': 94,
    'Group B': 112,
    'Group C': 78,
    'Group D': 86,
  },
};

export const ClubEngagementZone: React.FC = () => {
  const { teams, matches, tournament, openTeamProfile, setActiveTab } = useTournament();

  const [teamAId, setTeamAId] = useState<string>(teams[0]?.id || '');
  const [teamBId, setTeamBId] = useState<string>(teams[1]?.id || teams[0]?.id || '');

  const [polls, setPolls] = useState<PollState>(() => {
    try {
      const saved = localStorage.getItem(POLL_STORAGE_KEY);
      return saved ? { ...DEFAULT_POLL_STATE, ...JSON.parse(saved) } : DEFAULT_POLL_STATE;
    } catch {
      return DEFAULT_POLL_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(polls));
    } catch {
      // ignore storage quota errors
    }
  }, [polls]);

  const standings = useMemo(
    () => calculatePointsTable(teams, matches, tournament.rules),
    [teams, matches, tournament.rules]
  );

  const teamA = teams.find(t => t.id === teamAId) || teams[0];
  const teamB = teams.find(t => t.id === teamBId) || teams[1] || teams[0];

  const statsA = standings.find(s => s.teamId === teamA?.id);
  const statsB = standings.find(s => s.teamId === teamB?.id);

  const captainA =
    teamA?.players.find(p => p.isCaptain)?.name || teamA?.managerName || 'Club Captain';
  const captainB =
    teamB?.players.find(p => p.isCaptain)?.name || teamB?.managerName || 'Club Captain';

  const handleMatchVote = (choice: 'A' | 'B') => {
    if (polls.matchVote === choice) return;
    setPolls(prev => {
      const revertA = prev.matchVote === 'A' ? -1 : 0;
      const revertB = prev.matchVote === 'B' ? -1 : 0;
      return {
        ...prev,
        matchVote: choice,
        matchVotesA: prev.matchVotesA + revertA + (choice === 'A' ? 1 : 0),
        matchVotesB: prev.matchVotesB + revertB + (choice === 'B' ? 1 : 0),
      };
    });
  };

  const handleGroupVote = (grp: string) => {
    if (polls.groupVote === grp) return;
    setPolls(prev => {
      const updated = { ...prev.groupVotes };
      if (prev.groupVote && updated[prev.groupVote] !== undefined) {
        updated[prev.groupVote] = Math.max(0, updated[prev.groupVote] - 1);
      }
      updated[grp] = (updated[grp] || 0) + 1;
      return {
        ...prev,
        groupVote: grp,
        groupVotes: updated,
      };
    });
  };

  const totalMatchVotes = polls.matchVotesA + polls.matchVotesB;
  const pctA = totalMatchVotes ? Math.round((polls.matchVotesA / totalMatchVotes) * 100) : 50;
  const pctB = 100 - pctA;

  const totalGroupVotes = Object.values(polls.groupVotes).reduce((a, b) => a + b, 0);

  return (
    <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pb-10 sm:pb-12">
      <div className="border-t border-[#090909]/15 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 6 Cols: Interactive Head-to-Head Club Comparator */}
          <div className="lg:col-span-6 rounded-[6px] bg-white border border-[#090909]/12 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#090909] text-[#f6f4f4] text-[10px] font-bold uppercase tracking-wider">
                    <Swords className="w-3 h-3 text-[#ff6a17]" /> Tale of the Tape
                  </span>
                  <span className="rally-eyebrow text-[#736e6e]">40-Club Rivalry Matrix</span>
                </div>
              </div>

              <h3 className="rally-h2 text-[24px] sm:text-[28px] mb-4">
                Head-to-head club comparison
              </h3>

              {/* Dual Club Selectors */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#736e6e] mb-1">
                    Select Club A
                  </label>
                  <select
                    value={teamA?.id || ''}
                    onChange={e => setTeamAId(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-[6px] bg-[#f6f4f4] border border-[#090909]/15 text-[13px] font-bold text-[#090909] focus:outline-none focus:border-[#ff6a17]"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.logo} {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#736e6e] mb-1">
                    Select Club B
                  </label>
                  <select
                    value={teamB?.id || ''}
                    onChange={e => setTeamBId(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-[6px] bg-[#f6f4f4] border border-[#090909]/15 text-[13px] font-bold text-[#090909] focus:outline-none focus:border-[#ff6a17]"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.logo} {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Rows */}
              <div className="border-t border-[#090909]/12 text-[13px]">
                {[
                  {
                    label: 'Division Group',
                    valA: teamA?.group || 'Group A',
                    valB: teamB?.group || 'Group B',
                  },
                  {
                    label: 'Points & Wins',
                    valA: `${statsA?.points ?? 0} Pts (${statsA?.won ?? 0}W)`,
                    valB: `${statsB?.points ?? 0} Pts (${statsB?.won ?? 0}W)`,
                  },
                  {
                    label: 'Net Run Rate (NRR)',
                    valA:
                      (statsA?.nrr ?? 0) >= 0
                        ? `+${(statsA?.nrr ?? 0).toFixed(2)}`
                        : (statsA?.nrr ?? 0).toFixed(2),
                    valB:
                      (statsB?.nrr ?? 0) >= 0
                        ? `+${(statsB?.nrr ?? 0).toFixed(2)}`
                        : (statsB?.nrr ?? 0).toFixed(2),
                  },
                  {
                    label: 'Registered Squad',
                    valA: `${teamA?.players.length || 0} Players`,
                    valB: `${teamB?.players.length || 0} Players`,
                  },
                  {
                    label: 'Club Captain',
                    valA: captainA,
                    valB: captainB,
                  },
                ].map(row => (
                  <div
                    key={row.label}
                    className="grid grid-cols-12 items-center py-2.5 border-b border-[#090909]/10"
                  >
                    <div className="col-span-4 font-bold text-[#090909] truncate">{row.valA}</div>
                    <div className="col-span-4 text-center text-[11px] uppercase tracking-wider text-[#736e6e]">
                      {row.label}
                    </div>
                    <div className="col-span-4 text-right font-bold text-[#090909] truncate">
                      {row.valB}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Profile Links */}
            <div className="relative z-10 pt-3 flex items-center justify-between gap-3">
              {teamA && (
                <button
                  onClick={() => openTeamProfile(teamA.id)}
                  className="text-[12px] font-bold text-[#090909] hover:text-[#ff6a17] flex items-center gap-1 cursor-pointer truncate"
                >
                  <span>{teamA.shortName || teamA.name} Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              )}
              {teamB && (
                <button
                  onClick={() => openTeamProfile(teamB.id)}
                  className="text-[12px] font-bold text-[#090909] hover:text-[#ff6a17] flex items-center gap-1 cursor-pointer truncate"
                >
                  <span>{teamB.shortName || teamB.name} Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              )}
            </div>
          </div>

          {/* Right 6 Cols: Locker-Room Community Polls with Outline Batter Action Graphic */}
          <div className="lg:col-span-6 relative overflow-hidden rounded-[6px] bg-[#090909] text-[#f6f4f4] p-5 flex flex-col justify-between">
            {/* White-Outline Cover Drive Batter Graphic on Right Edge */}
            <img
              src="/cricket-action/batter-outline.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -right-4 -bottom-4 h-72 w-auto object-contain opacity-20"
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ff6a17] text-[#090909] text-[10px] font-bold uppercase tracking-wider">
                    <Flame className="w-3 h-3" /> Fan &amp; Player Pulse
                  </span>
                  <span className="rally-eyebrow text-[#f6f4f4]/60">
                    {totalMatchVotes + totalGroupVotes} Community Votes
                  </span>
                </div>
              </div>

              <h3 className="rally-h2 text-[24px] sm:text-[28px] text-[#f6f4f4] mb-4">
                Matchday predictions &amp; polls
              </h3>

              {/* Poll 1: Featured Matchday Vote */}
              <div className="rounded-[6px] bg-white/[0.06] backdrop-blur-[2px] border border-white/10 p-3.5 mb-3.5">
                <div className="flex items-center justify-between text-[11px] text-[#f6f4f4]/60 mb-2">
                  <span className="uppercase tracking-wider font-bold text-[#ff6a17]">
                    Featured Matchday Poll · Who Wins?
                  </span>
                  <span>{totalMatchVotes} votes</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleMatchVote('A')}
                    className={`h-10 px-3 rounded-[6px] border text-left flex items-center justify-between text-[13px] font-bold transition-all cursor-pointer ${
                      polls.matchVote === 'A'
                        ? 'bg-[#ff6a17] text-[#090909] border-[#ff6a17]'
                        : 'bg-white/5 text-[#f6f4f4] border-white/15 hover:border-[#ff6a17]'
                    }`}
                  >
                    <span className="truncate flex items-center gap-1.5">
                      {polls.matchVote === 'A' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      Frankfurt Eagles
                    </span>
                    <span className="font-mono">{pctA}%</span>
                  </button>

                  <button
                    onClick={() => handleMatchVote('B')}
                    className={`h-10 px-3 rounded-[6px] border text-left flex items-center justify-between text-[13px] font-bold transition-all cursor-pointer ${
                      polls.matchVote === 'B'
                        ? 'bg-[#ff6a17] text-[#090909] border-[#ff6a17]'
                        : 'bg-white/5 text-[#f6f4f4] border-white/15 hover:border-[#ff6a17]'
                    }`}
                  >
                    <span className="truncate flex items-center gap-1.5">
                      {polls.matchVote === 'B' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      Sulzbach XI
                    </span>
                    <span className="font-mono">{pctB}%</span>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-white/15 overflow-hidden flex">
                  <div
                    className="h-full bg-[#ff6a17] transition-all duration-300"
                    style={{ width: `${pctA}%` }}
                  />
                </div>
              </div>

              {/* Poll 2: Toughest Group ("Group of Death") */}
              <div className="rounded-[6px] bg-white/[0.06] backdrop-blur-[2px] border border-white/10 p-3.5">
                <div className="flex items-center justify-between text-[11px] text-[#f6f4f4]/60 mb-2">
                  <span className="uppercase tracking-wider font-bold text-[#f6f4f4]">
                    Which Group is the 2026 &ldquo;Group of Death&rdquo;?
                  </span>
                  <span>{totalGroupVotes} votes</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Group A', 'Group B', 'Group C', 'Group D'] as const).map(grp => {
                    const count = polls.groupVotes[grp] || 0;
                    const pct = totalGroupVotes ? Math.round((count / totalGroupVotes) * 100) : 25;
                    const active = polls.groupVote === grp;
                    return (
                      <button
                        key={grp}
                        onClick={() => handleGroupVote(grp)}
                        className={`p-2 rounded-[6px] border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-[#ff6a17] text-[#090909] border-[#ff6a17]'
                            : 'bg-white/5 text-[#f6f4f4] border-white/15 hover:border-[#ff6a17]'
                        }`}
                      >
                        <div className="text-[12px] font-bold flex items-center justify-between">
                          <span>{grp.replace('Group ', 'Grp ')}</span>
                          <span className="font-mono text-[11px]">{pct}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-3 flex items-center justify-between text-[12px] text-[#f6f4f4]/65">
              <span>Tap any option above to cast your club vote</span>
              <button
                onClick={() => {
                  setActiveTab('pickem');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-bold text-[#ff6a17] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open Full Pick&apos;Em Challenge <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
