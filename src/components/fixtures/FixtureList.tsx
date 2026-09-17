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
  Sparkles,
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
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white flex items-center gap-1.5 animate-pulse shadow-sm shadow-rose-900">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            LIVE
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            COMPLETED
          </span>
        );
      case 'toss':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            TOSS DONE
          </span>
        );
      case 'abandoned':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-300">
            ABANDONED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            UPCOMING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            Tournament Match Schedule & Results
          </h2>
          <p className="text-xs text-slate-400">
            Total {matches.length} matches • Group stage round robin, semi-finals and grand final
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {viewMode === 'organizer' && (
            <>
              <button
                onClick={() => autoGenerateRoundRobinFixtures()}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Automatically generate round-robin match fixtures between all teams"
              >
                <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Auto-Generate Fixtures</span>
              </button>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                Schedule Match
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all' 
              ? 'bg-slate-800 text-amber-400 border border-slate-700' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          All Fixtures ({matches.length})
        </button>
        <button
          onClick={() => setActiveFilter('live')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeFilter === 'live' 
              ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold' 
              : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/50'
          }`}
        >
          {liveMatches.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
          Live ({liveMatches.length})
        </button>
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'upcoming' 
              ? 'bg-slate-800 text-sky-400 border border-slate-700' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Upcoming ({upcomingMatches.length})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'completed' 
              ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          Results ({completedMatches.length})
        </button>
        <button
          onClick={() => setActiveFilter('playoffs')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'playoffs' 
              ? 'bg-slate-800 text-purple-400 border border-slate-700' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
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
              className={`glass-panel rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                match.status === 'live' 
                  ? 'border-rose-500/50 shadow-lg shadow-rose-950/40 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20' 
                  : isPlayoff
                    ? 'border-purple-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/10'
                    : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Card Header */}
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between text-xs bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400 uppercase tracking-wider">{match.title}</span>
                  {match.group && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
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
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete Match"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Score Body */}
              <div className="p-5 space-y-4">
                {/* Teams & Scores */}
                <div className="space-y-3">
                  {/* Team A */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow"
                        style={{ backgroundColor: teamA?.primaryColor || '#1e293b' }}
                      >
                        {teamA?.logo || '🏏'}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                          <span>{teamA?.name || 'Team 1'}</span>
                          {match.winnerTeamId === teamA?.id && (
                            <span className="text-amber-400" title="Winner">👑</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{teamA?.code}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {teamAScore ? (
                        <div>
                          <span className="text-lg font-black text-white font-mono">
                            {teamAScore.totalRuns}/{teamAScore.totalWickets}
                          </span>
                          <span className="text-xs text-slate-400 ml-1.5 font-mono">
                            ({teamAScore.oversCompletedStr} ov)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Yet to bat</span>
                      )}
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow"
                        style={{ backgroundColor: teamB?.primaryColor || '#1e293b' }}
                      >
                        {teamB?.logo || '🏏'}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                          <span>{teamB?.name || 'Team 2'}</span>
                          {match.winnerTeamId === teamB?.id && (
                            <span className="text-amber-400" title="Winner">👑</span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{teamB?.code}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      {teamBScore ? (
                        <div>
                          <span className="text-lg font-black text-white font-mono">
                            {teamBScore.totalRuns}/{teamBScore.totalWickets}
                          </span>
                          <span className="text-xs text-slate-400 ml-1.5 font-mono">
                            ({teamBScore.oversCompletedStr} ov)
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Yet to bat</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Result / Status Note */}
                {match.winMargin ? (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs font-bold text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{match.winMargin}</span>
                    </div>
                    {match.playerOfTheMatchId && (
                      <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-400" />
                        POTM: {teams.flatMap(t => t.players).find(p => p.id === match.playerOfTheMatchId)?.name || 'Player'}
                      </span>
                    )}
                  </div>
                ) : match.status === 'live' ? (
                  <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs font-bold text-rose-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                      {match.currentInningsNumber === 2 && match.innings2?.target 
                        ? `Target: ${match.innings2.target} • Need ${Math.max(0, match.innings2.target - match.innings2.totalRuns)} runs off ${(20 * 6) - match.innings2.legalBallsBowled} balls` 
                        : '1st Innings in progress'}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {match.date} at {match.time}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {match.venue}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{match.venue}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Scorecard button */}
                  {(match.innings1 || match.status === 'completed') && (
                    <button
                      onClick={() => setInspectScorecardMatch(match)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Scorecard
                    </button>
                  )}

                  {/* Live Match Center / Scorer button */}
                  <button
                    onClick={() => {
                      setActiveMatchId(match.id);
                      setActiveTab('live');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow transition-all ${
                      match.status === 'live'
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50'
                        : viewMode === 'organizer' && match.status === 'scheduled'
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {match.status === 'live' ? (
                      <>
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        Live Center
                      </>
                    ) : viewMode === 'organizer' && match.status === 'scheduled' ? (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Start Match
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Match Center
                      </>
                    )}
                  </button>
                </div>
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

      {/* Detailed Scorecard Modal */}
      {inspectScorecardMatch && (
        <DetailedScorecard
          match={inspectScorecardMatch}
          onClose={() => setInspectScorecardMatch(null)}
        />
      )}
    </div>
  );
};
