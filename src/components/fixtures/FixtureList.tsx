import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Play, 
  FileText, 
  Award, 
  Trash2, 
  Shuffle
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Match } from '../../types/cricket';
import { ScheduleMatchModal } from './ScheduleMatchModal';
import { DetailedScorecard } from '../scorecard/DetailedScorecard';

export const FixtureList: React.FC = () => {
  const { 
    matches, 
    teams, 
    viewMode, 
    setActiveMatchId, 
    setActiveTab, 
    deleteMatch,
    autoGenerateRoundRobinFixtures
  } = useTournament();

  const [activeFilter, setActiveFilter] = useState<'all' | 'live' | 'upcoming' | 'completed' | 'playoffs'>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [inspectScorecardMatch, setInspectScorecardMatch] = useState<Match | null>(null);

  const getTeam = (id: string) => teams.find(t => t.id === id);

  const liveMatches = matches.filter(m => m.status === 'live');
  const completedMatches = matches.filter(m => m.status === 'completed');
  const upcomingMatches = matches.filter(m => m.status === 'scheduled' || m.status === 'toss');
  const playoffMatches = matches.filter(m => 
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
      return m.stage === 'Quarter Final' || 
             m.stage === 'Semi Final 1' || 
             m.stage === 'Semi Final 2' || 
             m.stage === '3rd Place Playoff' || 
             m.stage === 'Grand Final';
    }
    return true;
  });

  const getStatusBadge = (status: Match['status']) => {
    switch (status) {
      case 'live':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-200 text-rose-600 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            LIVE NOW
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            FINAL
          </span>
        );
      case 'toss':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            TOSS DONE
          </span>
        );
      case 'abandoned':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            ABANDONED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            UPCOMING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[10px] uppercase tracking-wider font-semibold">
              SCHEDULE & FIXTURES
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 2026 EDITION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-cabinet tracking-tight flex items-center gap-2">
            Match Calendar & Scorecards
          </h2>
          <p className="text-xs text-slate-500">
            {matches.length} tournament matches across group stage, qualifiers and grand final.
          </p>
        </div>

        {/* Action buttons for Organizer */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {viewMode === 'organizer' && (
            <>
              <button
                onClick={() => autoGenerateRoundRobinFixtures()}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                title="Automatically generate round-robin match fixtures between all teams"
              >
                <Shuffle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Auto-Generate Fixtures</span>
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                Schedule Match
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs (Mobbin Segments) */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          All Fixtures ({matches.length})
        </button>
        <button
          onClick={() => setActiveFilter('live')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeFilter === 'live' 
              ? 'bg-rose-600 text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 border border-slate-200/80'
          }`}
        >
          {liveMatches.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>}
          Live Matches ({liveMatches.length})
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'upcoming' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          Upcoming ({upcomingMatches.length})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'completed' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          Completed Results ({completedMatches.length})
        </button>
        <button
          onClick={() => setActiveFilter('playoffs')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'playoffs' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          Playoffs & Finals ({playoffMatches.length})
        </button>
      </div>

      {/* Match Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMatches.map(match => {
          const teamA = getTeam(match.teamAId);
          const teamB = getTeam(match.teamBId);

          const teamAScore = match.innings1?.battingTeamId === teamA?.id 
            ? match.innings1 
            : (match.innings2?.battingTeamId === teamA?.id ? match.innings2 : undefined);

          const teamBScore = match.innings1?.battingTeamId === teamB?.id 
            ? match.innings1 
            : (match.innings2?.battingTeamId === teamB?.id ? match.innings2 : undefined);

          const isPlayoff = match.stage.includes('Final') || match.stage.includes('Playoff');

          return (
            <div
              key={match.id}
              className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between bg-white shadow-sm hover:shadow-md ${
                match.status === 'live' 
                  ? 'border-rose-400 ring-2 ring-rose-500/10' 
                  : isPlayoff
                    ? 'border-amber-300 ring-2 ring-amber-500/5'
                    : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Top Card Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] font-mono">
                    {match.title}
                  </span>
                  {match.group && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-semibold font-mono">
                      {match.group}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(match.status)}
                  {viewMode === 'organizer' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${match.title}?`)) {
                          deleteMatch(match.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Delete Match"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Score Body */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Teams & Scores */}
                <div className="space-y-3">
                  {/* Team A */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100"
                        style={{ backgroundColor: teamA?.primaryColor || '#0f172a' }}
                      >
                        {teamA?.logo || '🏏'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                          <span>{teamA?.name || 'Team 1'}</span>
                          {match.winnerTeamId === teamA?.id && (
                            <span className="text-amber-500 font-bold text-xs" title="Winner">👑 WINNER</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono font-semibold">{teamA?.code}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {teamAScore ? (
                        <div>
                          <span className="text-lg font-black text-slate-900 font-mono">
                            {teamAScore.totalRuns}/{teamAScore.totalWickets}
                          </span>
                          <span className="text-xs text-slate-500 ml-1.5 font-mono">
                            ({teamAScore.oversCompletedStr} ov)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Yet to bat</span>
                      )}
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100"
                        style={{ backgroundColor: teamB?.primaryColor || '#0f172a' }}
                      >
                        {teamB?.logo || '🏏'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                          <span>{teamB?.name || 'Team 2'}</span>
                          {match.winnerTeamId === teamB?.id && (
                            <span className="text-amber-500 font-bold text-xs" title="Winner">👑 WINNER</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono font-semibold">{teamB?.code}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {teamBScore ? (
                        <div>
                          <span className="text-lg font-black text-slate-900 font-mono">
                            {teamBScore.totalRuns}/{teamBScore.totalWickets}
                          </span>
                          <span className="text-xs text-slate-500 ml-1.5 font-mono">
                            ({teamBScore.oversCompletedStr} ov)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Yet to bat</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Result / Status Note */}
                {match.winMargin ? (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{match.winMargin}</span>
                    </div>
                    {match.playerOfTheMatchId && (
                      <span className="text-[11px] font-medium text-amber-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        POTM: {teams.flatMap(t => t.players).find(p => p.id === match.playerOfTheMatchId)?.name || 'Player'}
                      </span>
                    )}
                  </div>
                ) : match.status === 'live' ? (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-4 h-4 animate-pulse text-rose-600" />
                      {match.currentInningsNumber === 2 && match.innings2?.target 
                        ? `Target: ${match.innings2.target} • Need ${Math.max(0, match.innings2.target - match.innings2.totalRuns)} runs off ${(20 * 6) - match.innings2.legalBallsBowled} balls` 
                        : '1st Innings in progress'}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 flex items-center gap-3 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {match.date} at {match.time}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate text-slate-400"><MapPin className="w-3.5 h-3.5" /> {match.venue}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => setInspectScorecardMatch(match)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Scorecard & Stats
                </button>

                {match.status === 'live' ? (
                  <button
                    onClick={() => {
                      setActiveMatchId(match.id);
                      setActiveTab('live');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Enter Live Scoring Console
                  </button>
                ) : match.status === 'scheduled' || match.status === 'toss' ? (
                  <button
                    onClick={() => {
                      setActiveMatchId(match.id);
                      setActiveTab('live');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    Start Toss / Match
                  </button>
                ) : null}
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
