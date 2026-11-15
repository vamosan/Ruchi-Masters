import React, { useState } from 'react';
import {
  Plus,
  Play,
  FileText,
  Trash2,
  Shuffle,
  ArrowUpRight,
  Edit3,
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Match } from '../../types/cricket';
import { ScheduleMatchModal } from './ScheduleMatchModal';
import { EditMatchModal } from './EditMatchModal';
import { DetailedScorecard } from '../scorecard/DetailedScorecard';

export const FixtureList: React.FC = () => {
  const {
    matches,
    teams,
    isAdmin,
    setActiveMatchId,
    setActiveTab,
    deleteMatch,
    autoGenerateRoundRobinFixtures,
  } = useTournament();

  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'upcoming' | 'completed' | 'playoffs'>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [inspectScorecardMatch, setInspectScorecardMatch] = useState<Match | null>(null);
  const adminMode = isAdmin();

  const getTeam = (id: string) => teams.find(t => t.id === id);

  const liveMatches = matches.filter(m => m.status === 'live');
  const completedMatches = matches.filter(m => m.status === 'completed');
  const upcomingMatches = matches.filter(m => m.status === 'scheduled' || m.status === 'toss');
  const playoffMatches = matches.filter(
    m =>
      m.stage === 'Quarter Final' ||
      m.stage === 'Semi Final 1' ||
      m.stage === 'Semi Final 2' ||
      m.stage === '3rd Place Playoff' ||
      m.stage === 'Grand Final'
  );

  const filteredMatches = matches.filter(m => {
    if (activeFilter === 'live') return m.status === 'live';
    if (activeFilter === 'completed') return m.status === 'completed';
    if (activeFilter === 'upcoming') return m.status === 'scheduled' || m.status === 'toss';
    if (activeFilter === 'playoffs') {
      return (
        m.stage === 'Quarter Final' ||
        m.stage === 'Semi Final 1' ||
        m.stage === 'Semi Final 2' ||
        m.stage === '3rd Place Playoff' ||
        m.stage === 'Grand Final'
      );
    }
    return true;
  });

  const filters: { id: typeof activeFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: matches.length },
    { id: 'live', label: 'Live', count: liveMatches.length },
    { id: 'upcoming', label: 'Upcoming', count: upcomingMatches.length },
    { id: 'completed', label: 'Completed', count: completedMatches.length },
    { id: 'playoffs', label: 'Knockouts', count: playoffMatches.length },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#090909]/15 pb-6">
        <div>
          <div className="rally-eyebrow text-[#736e6e]">
            Season 05 · Frankfurt Cricket Ground
          </div>
          <h1 className="rally-h2 mt-1.5 text-[32px] sm:text-[44px] text-[#090909]">
            Schedule
          </h1>
          <p className="mt-1.5 text-[15px] text-[#575252] max-w-xl">
            {matches.length} fixtures across the group stage, quarterfinals, semifinals and the Grand Final.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map(f => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`h-10 px-4 rounded-full text-[14px] font-medium transition-colors flex items-center gap-2 ${
                  active
                    ? 'bg-[#090909] text-[#f6f4f4]'
                    : 'bg-transparent text-[#575252] border border-[#090909]/15 hover:border-[#090909] hover:text-[#090909]'
                }`}
              >
                {f.id === 'live' && liveMatches.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#ff6a17]" />
                )}
                <span>{f.label}</span>
                <span className="text-[12px] opacity-60">{f.count}</span>
              </button>
            );
          })}

          {adminMode && (
            <>
              <button
                onClick={() => autoGenerateRoundRobinFixtures()}
                className="rally-btn rally-btn-ghost-dark !h-10 !px-4"
                title="Auto-generate round-robin fixtures"
              >
                <Shuffle className="w-4 h-4" />
                Auto-Generate
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="rally-btn rally-btn-primary !h-10 !px-4"
              >
                <Plus className="w-4 h-4" />
                Schedule Match
              </button>
            </>
          )}
        </div>
      </div>

      {/* Rally Hairline Schedule List */}
      <div className="border-t border-[#090909]/15">
        {filteredMatches.length === 0 && (
          <div className="py-16 text-center text-[#736e6e] text-[16px]">
            No fixtures match this filter.
          </div>
        )}

        {filteredMatches.map(match => {
          const teamA = getTeam(match.teamAId);
          const teamB = getTeam(match.teamBId);

          const teamAScore =
            match.innings1?.battingTeamId === teamA?.id
              ? match.innings1
              : match.innings2?.battingTeamId === teamA?.id
              ? match.innings2
              : undefined;

          const teamBScore =
            match.innings1?.battingTeamId === teamB?.id
              ? match.innings1
              : match.innings2?.battingTeamId === teamB?.id
              ? match.innings2
              : undefined;

          const isLive = match.status === 'live' || match.status === 'innings_break';

          return (
            <div
              key={match.id}
              className="group grid grid-cols-12 items-center gap-3 py-4 border-b border-[#090909]/15 hover:bg-white/60 transition-colors px-2 -mx-2 rounded-[4px]"
            >
              {/* Col 1: Date & Time / Live Status */}
              <div className="col-span-12 lg:col-span-3 flex flex-wrap items-center gap-2 text-[14px] text-[#575252]">
                {isLive && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff6a17] text-[#090909] text-[11px] font-bold uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#090909]" />
                    Live
                  </span>
                )}
                <span className="font-medium text-[#090909]">{match.date}</span>
                {match.time && <span className="text-[#736e6e]">· {match.time}</span>}
              </div>

              {/* Col 2: Teams & Scores */}
              <div className="col-span-12 lg:col-span-5 space-y-0.5">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <span className="text-[18px] sm:text-[20px] font-bold tracking-[-0.03em] text-[#090909]">
                    {teamA?.name || 'Team 1'}
                  </span>
                  {teamAScore && (
                    <span className="font-mono text-[15px] font-bold text-[#ff6a17]">
                      {teamAScore.totalRuns}/{teamAScore.totalWickets} ({teamAScore.oversCompletedStr})
                    </span>
                  )}
                  <span className="text-[14px] text-[#9a9595] font-medium">vs.</span>
                  <span className="text-[18px] sm:text-[20px] font-bold tracking-[-0.03em] text-[#090909]">
                    {teamB?.name || 'Team 2'}
                  </span>
                  {teamBScore && (
                    <span className="font-mono text-[15px] font-bold text-[#ff6a17]">
                      {teamBScore.totalRuns}/{teamBScore.totalWickets} ({teamBScore.oversCompletedStr})
                    </span>
                  )}
                </div>
                {match.winMargin && (
                  <p className="text-[13px] font-medium text-[#575252]">
                    {match.winMargin}
                  </p>
                )}
              </div>

              {/* Col 3: Stage & Venue */}
              <div className="col-span-7 lg:col-span-2 text-left lg:text-right">
                <div className="text-[14px] font-medium text-[#090909]">
                  {match.stage}
                  {match.group ? ` · ${match.group}` : ''}
                </div>
                <div className="text-[13px] text-[#736e6e] truncate">
                  {match.venue}
                </div>
              </div>

              {/* Col 4: Actions */}
              <div className="col-span-5 lg:col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setInspectScorecardMatch(match)}
                  className="h-9 px-3.5 rounded-full border border-[#090909]/20 hover:border-[#090909] text-[13px] font-medium text-[#090909] inline-flex items-center gap-1.5 transition-colors"
                  title="Full Scorecard"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Scorecard</span>
                </button>

                {(match.status === 'live' || match.status === 'scheduled' || match.status === 'toss') && (
                  <button
                    onClick={() => {
                      setActiveMatchId(match.id);
                      setActiveTab('live');
                    }}
                    className="w-9 h-9 rounded-full bg-[#090909] text-[#f6f4f4] hover:bg-[#ff6a17] hover:text-[#090909] flex items-center justify-center transition-colors shrink-0"
                    title={match.status === 'live' ? 'Open Live Scoring' : 'Start Match'}
                  >
                    {match.status === 'live' ? (
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </button>
                )}

                {adminMode && (
                  <>
                    <button
                      onClick={() => setEditingMatch(match)}
                      className="h-9 px-3 rounded-full bg-[#ff6a17] text-[#090909] hover:bg-[#090909] hover:text-white text-[12px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      title="Edit Fixture, Score & Winner"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${match.title}?`)) {
                          deleteMatch(match.id);
                        }
                      }}
                      className="w-9 h-9 rounded-full border border-[#090909]/15 text-[#736e6e] hover:text-rose-600 hover:border-rose-300 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Match"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Match Modal */}
      <ScheduleMatchModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />

      {/* Edit Fixture & Match Result Modal */}
      <EditMatchModal
        match={editingMatch}
        onClose={() => setEditingMatch(null)}
      />

      {/* Inspect Scorecard Modal */}
      {inspectScorecardMatch && (
        <DetailedScorecard
          match={inspectScorecardMatch}
          onClose={() => setInspectScorecardMatch(null)}
        />
      )}
    </div>
  );
};
