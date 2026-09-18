import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Users, 
  Calendar, 
  Plus, 
  Shuffle, 
  Download, 
  RotateCcw, 
  Megaphone, 
  KeyRound,
  Search,
  Copy,
  Check,
  Eye,
  EyeOff,
  Edit2,
  Share2,
  ExternalLink,
  Shield,
  Sparkles
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
    setTeamPasscode,
    setActiveTab
  } = useTournament();

  const [showEditWizard, setShowEditWizard] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [searchTeam, setSearchTeam] = useState('');
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingPinTeamId, setEditingPinTeamId] = useState<string | null>(null);
  const [newPinValue, setNewPinValue] = useState('');

  const liveMatches = matches.filter(m => m.status === 'live');
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');

  const filteredTeams = useMemo(() => {
    if (!searchTeam.trim()) return teams;
    const q = searchTeam.toLowerCase().trim();
    return teams.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.code.toLowerCase().includes(q) ||
      t.group?.toLowerCase().includes(q) ||
      t.players.some(p => p.isCaptain && p.name.toLowerCase().includes(q))
    );
  }, [teams, searchTeam]);

  const togglePinReveal = (teamId: string) => {
    setRevealedPins(prev => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  const copyPinText = (team: typeof teams[0]) => {
    const pin = team.passcode || '2026';
    const text = `🏏 *Ruchi Masters T20 2026 - Captain Access*\n\nFranchise: *${team.name}* (${team.code})\nCaptain PIN: *${pin}*\nPortal: https://www.ruchimasters.com\n\nLogin to manage your squad roster!`;
    navigator.clipboard.writeText(text);
    setCopiedId(team.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSavePin = (teamId: string) => {
    if (!newPinValue || newPinValue.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    setTeamPasscode(teamId, newPinValue);
    setEditingPinTeamId(null);
    setNewPinValue('');
  };

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
            Super Admin permissions: 40 franchise squads, captain PIN management, fixtures, and scoring control.
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
          <div className="text-[11px] text-amber-400 font-semibold">{teams.reduce((acc, t) => acc + t.players.length, 0)} verified players</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Live Matches</div>
          <div className="text-3xl font-black text-rose-400">{liveMatches.length}</div>
          <div className="text-[11px] text-slate-400">{scheduledMatches.length} matches upcoming</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Completed Matches</div>
          <div className="text-3xl font-black text-emerald-400">{completedMatches.length}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Scores finalized</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase">Default Captain PIN</div>
          <div className="text-2xl font-black text-amber-400 font-mono tracking-widest">2026</div>
          <div className="text-[11px] text-slate-400">Captains can change anytime</div>
        </div>
      </div>

      {/* SECTION: 40 TEAMS CAPTAIN PIN & SQUAD MANAGER */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-[#CCFF00] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Captain Access Portal
              </span>
              <span className="text-xs font-bold text-slate-400">40 Franchises</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              Franchise Captain PIN & Squad Directory
            </h3>
            <p className="text-xs text-slate-400">
              Share PINs with team captains via WhatsApp or copy below. Super Admin can view, edit, or reset any team's PIN anytime.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTeam}
              onChange={(e) => setSearchTeam(e.target.value)}
              placeholder="Filter 40 teams by name or code..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium focus:outline-none focus:border-[#CCFF00]"
            />
            {searchTeam && (
              <button 
                onClick={() => setSearchTeam('')}
                className="absolute right-3 top-2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 40 Teams PIN Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Franchise</th>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Captain on Record</th>
                <th className="py-3 px-4">Players</th>
                <th className="py-3 px-4">Captain PIN</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTeams.map((team, idx) => {
                const captain = team.players.find(p => p.isCaptain);
                const pin = team.passcode || '2026';
                const isRevealed = revealedPins[team.id];
                const isEditing = editingPinTeamId === team.id;
                const isCopied = copiedId === team.id;

                return (
                  <tr key={team.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 font-bold">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{team.logo}</span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{team.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 font-bold">
                              {team.code}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{team.slogan}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-amber-300 font-bold text-[11px]">
                        {team.group || 'Group A'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{captain?.name || team.managerName || 'Assigned'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Jersey #{captain?.jerseyNumber || 1}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-300 font-mono font-bold text-[11px]">
                        {team.players.length} players
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={newPinValue}
                            onChange={(e) => setNewPinValue(e.target.value)}
                            placeholder="New PIN"
                            maxLength={8}
                            className="w-20 px-2 py-1 rounded bg-slate-900 border border-[#CCFF00] text-[#CCFF00] font-mono text-xs font-bold focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePin(team.id)}
                            className="px-2 py-1 bg-[#CCFF00] text-slate-950 font-bold rounded text-xs"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingPinTeamId(null)}
                            className="px-2 py-1 bg-slate-800 text-slate-300 font-bold rounded text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                            {isRevealed ? pin : '••••'}
                          </span>
                          <button
                            onClick={() => togglePinReveal(team.id)}
                            className="p-1 rounded text-slate-400 hover:text-white"
                            title={isRevealed ? 'Hide PIN' : 'Show PIN'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                          <button
                            onClick={() => {
                              setEditingPinTeamId(team.id);
                              setNewPinValue(pin);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-amber-400"
                            title="Edit PIN"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyPinText(team)}
                          className={'px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ' + (
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          )}
                          title="Copy WhatsApp invite with PIN"
                        >
                          {isCopied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3 text-emerald-400" />}
                          <span>{isCopied ? 'Copied!' : 'Share PIN'}</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('teams')}
                          className="px-2.5 py-1 rounded-lg bg-sky-600/30 hover:bg-sky-600 text-sky-200 text-xs font-bold flex items-center gap-1 border border-sky-500/40"
                          title="View / Edit Squad"
                        >
                          <span>Squad</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                if (window.confirm('Reset all tournament state to official 40 teams and matches?')) {
                  resetToDemoData();
                }
              }}
              className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 border border-rose-900/60"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              Reset to Official 40 Teams
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
