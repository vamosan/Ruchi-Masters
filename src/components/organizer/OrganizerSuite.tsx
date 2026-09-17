import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Users, 
  Calendar, 
  Plus, 
  Shuffle, 
  Download, 
  Upload, 
  RotateCcw, 
  Megaphone, 
  Trophy, 
  AlertCircle,
  FileCheck,
  Award
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { TournamentWizardModal } from '../tournament/TournamentWizardModal';
import { ScheduleMatchModal } from '../fixtures/ScheduleMatchModal';

export const OrganizerSuite: React.FC = () => {
  const { 
    tournament, 
    teams, 
    matches, 
    autoGenerateRoundRobinFixtures, 
    resetToDemoData, 
    exportTournamentJson,
    setActiveTab
  } = useTournament();

  const [showEditWizard, setShowEditWizard] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const liveMatches = matches.filter(m => m.status === 'live');
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');

  const handleExport = () => {
    const dataStr = exportTournamentJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tournament.id}-tournament-backup.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-amber-500 text-slate-950">
              ORGANIZER CONTROL PANEL
            </span>
            <span className="text-xs text-amber-300 font-bold">Admin Suite</span>
          </div>
          <h2 className="text-2xl font-black text-white">{tournament.name} Command Center</h2>
          <p className="text-xs text-slate-400">
            Full management permissions for squads, live balls, umpire controls, rulebooks, and tournament lifecycle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowEditWizard(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Settings className="w-4 h-4" />
            Edit Tournament Settings
          </button>
        </div>
      </div>

      {/* Organizer Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Registered Teams</div>
          <div className="text-3xl font-black text-white">{teams.length}</div>
          <div className="text-[11px] text-amber-400 font-semibold">{teams.reduce((acc, t) => acc + t.players.length, 0)} total players</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Live Matches</div>
          <div className="text-3xl font-black text-rose-400">{liveMatches.length}</div>
          <div className="text-[11px] text-slate-400">{scheduledMatches.length} matches upcoming</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Completed Matches</div>
          <div className="text-3xl font-black text-emerald-400">{completedMatches.length}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Scores finalized & verified</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Current Phase</div>
          <div className="text-xl font-black text-amber-400 capitalize">{tournament.status.replace('_', ' ')}</div>
          <div className="text-[11px] text-slate-400">{tournament.rules.oversPerInnings} overs match quota</div>
        </div>
      </div>

      {/* Quick Action Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Match Operations */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Calendar className="w-5 h-5" />
            <span>Fixtures & Match Operations</span>
          </div>
          <p className="text-xs text-slate-400">
            Generate round-robin pairings or schedule knockout games with custom venues and timings.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              Schedule Single Match
            </button>
            <button
              onClick={() => {
                autoGenerateRoundRobinFixtures();
                alert('Round-robin league fixtures generated between all teams!');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700"
            >
              <Shuffle className="w-4 h-4 text-emerald-400" />
              Auto-Generate Round Robin Schedule
            </button>
          </div>
        </div>

        {/* Squad Management */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Users className="w-5 h-5" />
            <span>Franchises & Squad Management</span>
          </div>
          <p className="text-xs text-slate-400">
            Manage player rosters, assign jersey numbers, captaincy tags, wicketkeepers and player roles.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => setActiveTab('teams')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700"
            >
              <Users className="w-4 h-4 text-sky-400" />
              Manage Teams & Squads Roster
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700"
            >
              <Megaphone className="w-4 h-4 text-purple-400" />
              Publish Notice / Announcement
            </button>
          </div>
        </div>

        {/* Data Persistence & Backup */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Download className="w-5 h-5" />
            <span>Backup, Export & Data State</span>
          </div>
          <p className="text-xs text-slate-400">
            Export full tournament JSON file for safe offline storage or distribution to scorers.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={handleExport}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export Tournament State (JSON)
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all tournament state to realistic demo matches and teams?')) {
                  resetToDemoData();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 border border-rose-900/60"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Reset to Demo Tournament
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TournamentWizardModal
        isOpen={showEditWizard}
        onClose={() => setShowEditWizard(false)}
      />

      <ScheduleMatchModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </div>
  );
};
