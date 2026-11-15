import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  ArrowUpRight,
  Edit3,
  KeyRound,
  Camera,
  CheckCircle2,
  Users,
  LayoutGrid,
  List,
  ShieldCheck,
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Team } from '../../types/cricket';
import { TeamProfilePage } from './TeamProfilePage';
import { EditTeamModal } from './EditTeamModal';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80';

export const TeamList: React.FC = () => {
  const {
    teams,
    hallOfFame,
    currentUser,
    canEditTeam,
    isAdmin,
    openAuthModal,
    addTeam,
    activeTeamProfileId: selectedTeamId,
    setActiveTeamProfileId: setSelectedTeamId,
  } = useTournament();
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
  const [quickUnlockId, setQuickUnlockId] = useState<string>(teams[0]?.id || '');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  // New Team Form state
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [homeGround, setHomeGround] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [primaryColor] = useState('#0284c7');
  const [secondaryColor] = useState('#ff6a17');

  const latestChampionId = hallOfFame[0]?.championTeamId;
  const latestChampionName = hallOfFame[0]?.championTeamName;

  const groups = useMemo(() => {
    const g = Array.from(new Set(teams.map(t => t.group).filter(Boolean))) as string[];
    return g;
  }, [teams]);

  const myClub = useMemo(
    () => (currentUser.teamId ? teams.find(t => t.id === currentUser.teamId) : null),
    [teams, currentUser.teamId]
  );

  const filteredTeams = useMemo(() => {
    return teams.filter(t => {
      if (selectedGroup !== 'all' && t.group !== selectedGroup) return false;
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        t.name.toLowerCase().includes(query) ||
        t.code.toLowerCase().includes(query) ||
        (t.shortName && t.shortName.toLowerCase().includes(query)) ||
        t.players.some(p => p.isCaptain && p.name.toLowerCase().includes(query)) ||
        (t.managerName && t.managerName.toLowerCase().includes(query))
      );
    });
  }, [teams, searchQuery, selectedGroup]);

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || null;

  if (selectedTeam) {
    return (
      <TeamProfilePage
        team={selectedTeam}
        onBack={() => setSelectedTeamId(null)}
        onSelectTeam={t => setSelectedTeamId(t.id)}
      />
    );
  }

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !teamCode.trim()) return;

    const teamId = 'team-' + Date.now();
    const newTeam: Team = {
      id: teamId,
      name: teamName,
      shortName: teamName.split(' ')[0] || teamName,
      code: teamCode.toUpperCase().slice(0, 4),
      logo: '🏏',
      primaryColor,
      secondaryColor,
      homeGround: homeGround || 'Frankfurt Cricket Ground',
      managerName: captainName || 'Team Captain',
      teamPhotoUrl: FALLBACK_IMG,
      bannerUrl: FALLBACK_IMG,
      players: [
        {
          id: 'p-' + teamId + '-1',
          teamId,
          name: captainName || 'Team Captain',
          jerseyNumber: 1,
          role: 'pure_batter',
          battingStyle: 'Right-hand Bat',
          bowlingStyle: 'Right-arm medium',
          isCaptain: true,
          photoUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
          idProofNumber: 'RUCHI-T20-' + teamCode.toUpperCase() + '-1001',
          isAuthenticated: true,
          authenticatedAt: new Date().toISOString(),
          authenticatedBy: captainName || 'Team Captain',
          matchesPlayed: 0,
          runsScored: 0,
          wicketsTaken: 0,
          highestScore: 0,
          bestBowling: '0/0',
          strikeRate: 0,
          economy: 0,
        },
      ],
    };

    addTeam(newTeam);
    setShowAddTeamModal(false);
    setTeamName('');
    setTeamCode('');
    setHomeGround('');
    setCaptainName('');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Pinned Captain Bar / Quick Unlock Bar */}
      {myClub ? (
        <div className="rounded-xl bg-[#0b0f19] text-white p-4 border border-emerald-500/40 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow"
              style={{ backgroundColor: myClub.primaryColor || '#ff6a17' }}
            >
              {myClub.logo || '🏏'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">
                  Your Club Unlocked
                </span>
                <span className="text-xs font-mono text-slate-400">{myClub.code}</span>
              </div>
              <div className="text-[17px] font-extrabold text-white mt-0.5">{myClub.name}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedTeamId(myClub.id)}
              className="rally-btn rally-btn-primary !h-9 !px-4 !text-[13px]"
            >
              <Camera className="w-4 h-4" />
              Open Squad &amp; Upload Photos
            </button>
            <button
              onClick={() => setEditingTeam(myClub)}
              className="rally-btn rally-btn-ghost-light !h-9 !px-3.5 !text-[13px]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Club Info
            </button>
            <button
              onClick={() => openAuthModal(myClub.id)}
              className="rally-btn rally-btn-ghost-light !h-9 !px-3 !text-[12px]"
            >
              Switch
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-[#0b0f19] text-white px-4 py-3 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[13px]">
            <KeyRound className="w-4 h-4 text-[#ff6a17] shrink-0" />
            <span>
              <strong className="text-white">Team Captain?</strong> Select your club to unlock photo uploads &amp; roster management:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={quickUnlockId}
              onChange={e => setQuickUnlockId(e.target.value)}
              className="h-8 px-2.5 rounded-lg bg-white/10 border border-white/15 text-white text-[12px] font-bold focus:outline-none focus:border-[#ff6a17] flex-1 md:w-56"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id} className="text-slate-900">
                  {t.logo} {t.name} ({t.code})
                </option>
              ))}
            </select>
            <button
              onClick={() => openAuthModal(quickUnlockId)}
              className="h-8 px-3.5 rounded-lg bg-[#ff6a17] hover:bg-[#ea580c] text-white text-[12px] font-bold shrink-0 cursor-pointer transition-colors"
            >
              Unlock Squad
            </button>
          </div>
        </div>
      )}

      {/* 2. Header + Search + Group Filters + View Mode Switcher */}
      <div className="league-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-[#ff6a17]" />
              <h1 className="text-[20px] sm:text-[22px] font-extrabold text-slate-900 tracking-tight">
                Club Directory &amp; Squads
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold">
                {filteredTeams.length} of {teams.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search club, code, or captain..."
                className="w-full h-9 pl-9 pr-7 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#ff6a17]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Grid vs List Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setDisplayMode('grid')}
                className={`h-8 px-2.5 rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  displayMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
                title="Card Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setDisplayMode('list')}
                className={`h-8 px-2.5 rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  displayMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
                title="Compact Table List"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            {isAdmin() && (
              <button
                onClick={() => setShowAddTeamModal(true)}
                className="rally-btn rally-btn-dark !h-9 !px-3.5 !text-[12px]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Club
              </button>
            )}
          </div>
        </div>

        {/* Group Filter Pills */}
        {groups.length > 0 && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`h-7 px-3 rounded-lg text-[12px] font-bold transition-colors shrink-0 cursor-pointer ${
                selectedGroup === 'all'
                  ? 'bg-[#0b0f19] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Clubs ({teams.length})
            </button>
            {groups.map(g => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`h-7 px-3 rounded-lg text-[12px] font-bold transition-colors shrink-0 cursor-pointer ${
                  selectedGroup === g
                    ? 'bg-[#0b0f19] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g} ({teams.filter(t => t.group === g).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Teams View: Compact 4–5 Column Cards OR Ultra-Dense List */}
      {displayMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {filteredTeams.map(team => {
            const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
            const hasEditPermission = canEditTeam(team.id);
            const isDefendingChamp =
              team.id === latestChampionId || team.name === latestChampionName;
            const img = team.teamPhotoUrl || team.bannerUrl;
            const verifiedCount = team.players.filter(p => p.isAuthenticated).length;

            return (
              <div
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className={`group rounded-xl bg-white border overflow-hidden flex flex-col justify-between transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-md ${
                  hasEditPermission
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Team Color Top Accent Strip */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: team.primaryColor || '#ff6a17' }}
                  />

                  {/* Compact 16:9 Squad Thumbnail */}
                  <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt={team.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                        onError={e => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMG;
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${team.primaryColor || '#1e293b'}, #0f172a)`,
                        }}
                      >
                        <span className="text-4xl">{team.logo || '🏏'}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                    {/* Top Left Badges */}
                    <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1">
                      {isDefendingChamp && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                          🏆 Champ
                        </span>
                      )}
                      {hasEditPermission && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-black uppercase">
                          Unlocked
                        </span>
                      )}
                    </div>

                    {/* Top Right Quick Edit */}
                    {hasEditPermission && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setEditingTeam(team);
                        }}
                        title="Edit Club Info"
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-[#ff6a17] hover:text-white text-slate-900 flex items-center justify-center shadow"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}

                    {/* Club Crest & Name Overlay */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-1.5 text-white">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base shrink-0">{team.logo || '🏏'}</span>
                        <h3 className="text-[13px] sm:text-[14px] font-extrabold truncate leading-tight">
                          {team.name}
                        </h3>
                      </div>
                      <span className="px-1.5 py-0.2 rounded bg-black/60 text-[10px] font-mono font-bold text-amber-300 shrink-0">
                        {team.code}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compact Card Footer */}
                <div className="p-2.5 space-y-1.5 bg-white">
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span className="truncate font-semibold">
                      {captain ? `Capt: ${captain.name}` : team.managerName || 'Club Squad'}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-500 shrink-0">
                      {team.group || 'T20'}
                    </span>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {verifiedCount}/{team.players.length} Players
                    </span>
                    <span className="font-bold text-[#ff6a17] group-hover:underline flex items-center gap-0.5">
                      {hasEditPermission ? 'Manage' : 'Squad'}
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Ultra-Dense List View */
        <div className="league-card overflow-hidden divide-y divide-slate-100">
          {filteredTeams.map(team => {
            const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
            const hasEditPermission = canEditTeam(team.id);
            const verifiedCount = team.players.filter(p => p.isAuthenticated).length;

            return (
              <div
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className="px-4 py-3 hover:bg-slate-50 flex items-center justify-between gap-4 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg text-white shrink-0"
                    style={{ backgroundColor: team.primaryColor || '#0b0f19' }}
                  >
                    {team.logo || '🏏'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-extrabold text-slate-900 truncate">
                        {team.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                        {team.code}
                      </span>
                      {team.group && (
                        <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                          · {team.group}
                        </span>
                      )}
                    </div>
                    <div className="text-[12px] text-slate-500 truncate">
                      Captain: {captain ? captain.name : team.managerName || 'Assigned'} · Venue: {team.homeGround}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-700 hidden sm:inline">
                    {verifiedCount}/{team.players.length} Verified
                  </span>
                  <button className="h-8 px-3 rounded-lg bg-slate-900 hover:bg-[#ff6a17] text-white text-xs font-bold flex items-center gap-1 transition-colors">
                    <span>{hasEditPermission ? 'Manage Squad' : 'View Squad'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register Franchise Modal (Admin Only) */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-slate-900 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold">Register New Club</h3>
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Club Full Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  placeholder="e.g. Frankfurt Warriors"
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Team Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={teamCode}
                    onChange={e => setTeamCode(e.target.value)}
                    placeholder="FWX"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Captain Name</label>
                  <input
                    type="text"
                    value={captainName}
                    onChange={e => setCaptainName(e.target.value)}
                    placeholder="Captain Name"
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="rally-btn rally-btn-ghost-dark !h-9 !text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="rally-btn rally-btn-primary !h-9 !text-xs">
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {editingTeam && <EditTeamModal team={editingTeam} onClose={() => setEditingTeam(null)} />}
    </div>
  );
};
