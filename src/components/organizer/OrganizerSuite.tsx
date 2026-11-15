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
  Sparkles,
  TableProperties,
  Award,
  Trash2,
  Activity
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { TournamentWizardModal } from '../tournament/TournamentWizardModal';
import { ScheduleMatchModal } from '../fixtures/ScheduleMatchModal';
import { EditMatchModal } from '../fixtures/EditMatchModal';
import { EditStandingsModal } from '../standings/EditStandingsModal';
import { EditPlayerStatsModal } from '../stats/EditPlayerStatsModal';
import { calculatePointsTable } from '../../utils/nrrCalculator';
import { Match, Player, PointsTableEntry, Team } from '../../types/cricket';

type AdminSection = 'overview' | 'fixtures' | 'standings' | 'stats';

export const OrganizerSuite: React.FC = () => {
  const { 
    tournament, 
    teams, 
    matches, 
    autoGenerateRoundRobinFixtures, 
    resetToDemoData, 
    exportTournamentJson,
    setTeamPasscode,
    setActiveTab,
    setActiveMatchId,
    deleteMatch,
  } = useTournament();

  const [adminSection, setAdminSection] = useState<AdminSection>('overview');
  const [showEditWizard, setShowEditWizard] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [searchTeam, setSearchTeam] = useState('');
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingPinTeamId, setEditingPinTeamId] = useState<string | null>(null);
  const [newPinValue, setNewPinValue] = useState('');

  // Fixtures management state
  const [matchFilterStatus, setMatchFilterStatus] = useState<'all' | 'live' | 'scheduled' | 'completed'>('all');
  const [matchSearch, setMatchSearch] = useState('');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  // Standings management state
  const [standingsGroupFilter, setStandingsGroupFilter] = useState<string>('ALL');
  const [editingStandingsEntry, setEditingStandingsEntry] = useState<PointsTableEntry | null>(null);

  // Player stats management state
  const [playerSearch, setPlayerSearch] = useState('');
  const [playerSort, setPlayerSort] = useState<'runs' | 'wickets' | 'sixes' | 'name'>('runs');
  const [editingPlayerInfo, setEditingPlayerInfo] = useState<{
    player: Player;
    team: Team;
    computedFours: number;
    computedSixes: number;
  } | null>(null);

  const liveMatches = matches.filter(m => m.status === 'live');
  const scheduledMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');

  const getTeam = (id?: string) => teams.find(t => t.id === id);

  const filteredMatches = useMemo(() => {
    const q = matchSearch.toLowerCase().trim();
    return matches.filter(m => {
      if (matchFilterStatus !== 'all' && m.status !== matchFilterStatus) return false;
      if (!q) return true;
      const tA = getTeam(m.teamAId);
      const tB = getTeam(m.teamBId);
      return (
        m.title.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q) ||
        (tA?.name.toLowerCase().includes(q) ?? false) ||
        (tA?.code.toLowerCase().includes(q) ?? false) ||
        (tB?.name.toLowerCase().includes(q) ?? false) ||
        (tB?.code.toLowerCase().includes(q) ?? false)
      );
    });
  }, [matches, matchFilterStatus, matchSearch, teams]);

  const pointsTable = useMemo(() => {
    return calculatePointsTable(teams, matches, tournament.rules);
  }, [teams, matches, tournament.rules]);

  const availableGroups = useMemo(() => {
    const set = new Set<string>();
    pointsTable.forEach(p => { if (p.group) set.add(p.group); });
    return Array.from(set).sort();
  }, [pointsTable]);

  const filteredStandings = useMemo(() => {
    if (standingsGroupFilter === 'ALL') return pointsTable;
    return pointsTable.filter(p => (p.group || '') === standingsGroupFilter);
  }, [pointsTable, standingsGroupFilter]);

  const aggregatedPlayers = useMemo(() => {
    const batMap = new Map<string, { runs: number; balls: number; fours: number; sixes: number }>();
    const bowlMap = new Map<string, { wickets: number; runsConceded: number; legalBalls: number }>();

    matches.forEach(m => {
      [m.innings1, m.innings2].forEach(inn => {
        if (!inn) return;
        inn.battingScorecard?.forEach(b => {
          const cur = batMap.get(b.playerId) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
          batMap.set(b.playerId, {
            runs: cur.runs + (b.runs || 0),
            balls: cur.balls + (b.balls || 0),
            fours: cur.fours + (b.fours || 0),
            sixes: cur.sixes + (b.sixes || 0),
          });
        });
        inn.bowlingScorecard?.forEach(bw => {
          const cur = bowlMap.get(bw.playerId) || { wickets: 0, runsConceded: 0, legalBalls: 0 };
          bowlMap.set(bw.playerId, {
            wickets: cur.wickets + (bw.wickets || 0),
            runsConceded: cur.runsConceded + (bw.runsConceded || 0),
            legalBalls: cur.legalBalls + (bw.ballsLegal || 0),
          });
        });
      });
    });

    const rows = teams.flatMap(team =>
      team.players.map(player => {
        const b = batMap.get(player.id);
        const bw = bowlMap.get(player.id);
        const runs = Math.max(player.runsScored || 0, b?.runs || 0);
        const wickets = Math.max(player.wicketsTaken || 0, bw?.wickets || 0);
        const computedFours = b?.fours || 0;
        const computedSixes = b?.sixes || 0;
        const fours = player.fours !== undefined ? player.fours : computedFours;
        const sixes = player.sixes !== undefined ? player.sixes : computedSixes;
        const sr =
          player.strikeRate && player.strikeRate > 0
            ? player.strikeRate
            : b && b.balls > 0
              ? Number(((runs / b.balls) * 100).toFixed(1))
              : 0;
        const econ =
          player.economy && player.economy > 0
            ? player.economy
            : bw && bw.legalBalls > 0
              ? Number(((bw.runsConceded / bw.legalBalls) * 6).toFixed(2))
              : 0;
        return {
          player,
          team,
          runs,
          wickets,
          fours,
          sixes,
          computedFours,
          computedSixes,
          sr,
          econ,
        };
      })
    );

    const q = playerSearch.toLowerCase().trim();
    const filtered = q
      ? rows.filter(
          r =>
            r.player.name.toLowerCase().includes(q) ||
            r.team.name.toLowerCase().includes(q) ||
            r.team.code.toLowerCase().includes(q)
        )
      : rows;

    return filtered
      .sort((a, b) => {
        if (playerSort === 'runs') return b.runs - a.runs || a.player.name.localeCompare(b.player.name);
        if (playerSort === 'wickets') return b.wickets - a.wickets || a.player.name.localeCompare(b.player.name);
        if (playerSort === 'sixes') return b.sixes - a.sixes || b.runs - a.runs;
        return a.player.name.localeCompare(b.player.name);
      })
      .slice(0, 100);
  }, [teams, matches, playerSearch, playerSort]);

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

      {/* 4-Tab Admin Command Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800">
        {[
          { id: 'overview' as const, label: 'Overview & PINs', icon: KeyRound, count: teams.length },
          { id: 'fixtures' as const, label: 'Fixtures & Results', icon: Calendar, count: matches.length },
          { id: 'standings' as const, label: 'Standings & Groups', icon: TableProperties, count: pointsTable.length },
          { id: 'stats' as const, label: 'Player Stats & Caps', icon: Award, count: teams.reduce((acc, t) => acc + t.players.length, 0) },
        ].map(tab => {
          const Icon = tab.icon;
          const active = adminSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminSection(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                active
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  active ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {adminSection === 'overview' && (
        <div className="space-y-8">
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
              <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-300 font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-700">
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
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
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
                            className="w-20 px-2 py-1 rounded bg-slate-900 border border-amber-400 text-amber-300 font-mono text-xs font-bold focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePin(team.id)}
                            className="px-2 py-1 bg-amber-400 text-slate-950 font-bold rounded text-xs"
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
        </div>
      )}

      {/* TAB 2: FIXTURES & RESULTS EDITOR */}
      {adminSection === 'fixtures' && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white">Fixtures, Scores & Match Results</h3>
              <p className="text-xs text-slate-400">
                Edit dates, venues, status, scores, winners, or delete matches. Updating a completed match automatically updates NRR & Points.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Schedule Match
              </button>
              <button
                onClick={() => {
                  autoGenerateRoundRobinFixtures();
                  alert('Round-robin league fixtures generated between all teams!');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
              >
                <Shuffle className="w-4 h-4 text-emerald-400" />
                Auto-Generate Schedule
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'live', 'scheduled', 'completed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setMatchFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                    matchFilterStatus === st
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={matchSearch}
                onChange={e => setMatchSearch(e.target.value)}
                placeholder="Search team, venue, or match title..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredMatches.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                No fixtures match your current filter.
              </div>
            ) : (
              filteredMatches.map(m => {
                const tA = getTeam(m.teamAId);
                const tB = getTeam(m.teamBId);
                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span
                          className={`px-2 py-0.5 rounded uppercase ${
                            m.status === 'live'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : m.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          }`}
                        >
                          {m.status}
                        </span>
                        <span className="text-slate-400">{m.stage}{m.group ? ` • ${m.group}` : ''}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">{m.date} {m.time}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{m.venue}</span>
                      </div>

                      <div className="text-sm font-black text-white flex flex-wrap items-center gap-2">
                        <span>{tA?.logo} {tA?.name || 'TBD'}</span>
                        {m.innings1 && (
                          <span className="text-xs font-mono text-amber-400">
                            ({m.innings1.totalRuns}/{m.innings1.totalWickets}, {m.innings1.oversCompletedStr})
                          </span>
                        )}
                        <span className="text-slate-500 font-bold text-xs">vs</span>
                        <span>{tB?.logo} {tB?.name || 'TBD'}</span>
                        {m.innings2 && (
                          <span className="text-xs font-mono text-amber-400">
                            ({m.innings2.totalRuns}/{m.innings2.totalWickets}, {m.innings2.oversCompletedStr})
                          </span>
                        )}
                      </div>

                      {m.winMargin && (
                        <div className="text-xs text-emerald-400 font-semibold">{m.winMargin}</div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingMatch(m)}
                        className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Match / Result
                      </button>
                      <button
                        onClick={() => {
                          setActiveMatchId(m.id);
                          setActiveTab('live');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                      >
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        Live Scorer
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete fixture "${m.title}"?`)) {
                            deleteMatch(m.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 border border-rose-900/60"
                        title="Delete Match"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STANDINGS & GROUPS EDITOR */}
      {adminSection === 'standings' && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white">Points Table, Groups & NRR Overrides</h3>
              <p className="text-xs text-slate-400">
                Standings auto-calculate from completed matches, or you can manually override Played, Won, Lost, Points, NRR, and Group per club.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setStandingsGroupFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  standingsGroupFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Groups
              </button>
              {availableGroups.map(g => (
                <button
                  key={g}
                  onClick={() => setStandingsGroupFilter(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    standingsGroupFilter === g
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Club</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-3 text-center">P</th>
                  <th className="py-3 px-3 text-center">W</th>
                  <th className="py-3 px-3 text-center">L</th>
                  <th className="py-3 px-3 text-center">NR/T</th>
                  <th className="py-3 px-3 text-center">Pts</th>
                  <th className="py-3 px-3 text-right">NRR</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStandings.map((entry, idx) => {
                  const club = getTeam(entry.teamId);
                  const hasOverride = Boolean(club?.standingsOverride);
                  return (
                    <tr key={entry.teamId} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 font-bold">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{club?.logo || '🏏'}</span>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{entry.teamName}</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                                {entry.teamCode}
                              </span>
                              {hasOverride && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{entry.group || '—'}</td>
                      <td className="py-3 px-3 text-center text-slate-200 font-semibold">{entry.played}</td>
                      <td className="py-3 px-3 text-center text-emerald-400 font-bold">{entry.won}</td>
                      <td className="py-3 px-3 text-center text-rose-400">{entry.lost}</td>
                      <td className="py-3 px-3 text-center text-slate-400">{entry.tied + entry.noResult}</td>
                      <td className="py-3 px-3 text-center text-amber-400 font-black">{entry.points}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-200">
                        {entry.nrr >= 0 ? `+${entry.nrr.toFixed(3)}` : entry.nrr.toFixed(3)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setEditingStandingsEntry(entry)}
                          className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit Row
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PLAYER STATS & CAPS EDITOR */}
      {adminSection === 'stats' && (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white">Player Statistics & Leaderboards Editor</h3>
              <p className="text-xs text-slate-400">
                Search any registered player across all 40 clubs to edit Runs, Wickets, 4s, 6s, Strike Rate, Economy, or Best Bowling. (Showing top 100 matches.)
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {([
                { id: 'runs', label: 'Top Runs' },
                { id: 'wickets', label: 'Top Wickets' },
                { id: 'sixes', label: 'Most Sixes' },
                { id: 'name', label: 'A-Z Name' },
              ] as const).map(s => (
                <button
                  key={s.id}
                  onClick={() => setPlayerSort(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    playerSort === s.id
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={playerSearch}
                  onChange={e => setPlayerSearch(e.target.value)}
                  placeholder="Search player or club..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-3">Club</th>
                  <th className="py-3 px-3 text-center">M</th>
                  <th className="py-3 px-3 text-center">Runs</th>
                  <th className="py-3 px-3 text-center">HS</th>
                  <th className="py-3 px-3 text-center">4s / 6s</th>
                  <th className="py-3 px-3 text-center">SR</th>
                  <th className="py-3 px-3 text-center">Wkts</th>
                  <th className="py-3 px-3 text-center">Econ</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {aggregatedPlayers.map(row => (
                  <tr key={row.player.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{row.player.name}</div>
                      <div className="text-[11px] text-slate-400">{row.player.role}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-semibold">
                      {row.team.logo} {row.team.code}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">{row.player.matchesPlayed || 0}</td>
                    <td className="py-3 px-3 text-center font-black text-amber-400">{row.runs}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{row.player.highestScore || 0}</td>
                    <td className="py-3 px-3 text-center text-slate-300">{row.fours} / {row.sixes}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">{row.sr}</td>
                    <td className="py-3 px-3 text-center font-black text-purple-400">{row.wickets}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">{row.econ}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          setEditingPlayerInfo({
                            player: row.player,
                            team: row.team,
                            computedFours: row.computedFours,
                            computedSixes: row.computedSixes,
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit Stats
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <TournamentWizardModal
        isOpen={showEditWizard}
        onClose={() => setShowEditWizard(false)}
      />

      <ScheduleMatchModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />

      <EditMatchModal
        match={editingMatch}
        onClose={() => setEditingMatch(null)}
      />

      <EditStandingsModal
        entry={editingStandingsEntry}
        onClose={() => setEditingStandingsEntry(null)}
      />

      <EditPlayerStatsModal
        player={editingPlayerInfo?.player || null}
        team={editingPlayerInfo?.team || null}
        computedFours={editingPlayerInfo?.computedFours}
        computedSixes={editingPlayerInfo?.computedSixes}
        onClose={() => setEditingPlayerInfo(null)}
      />
    </div>
  );
};
