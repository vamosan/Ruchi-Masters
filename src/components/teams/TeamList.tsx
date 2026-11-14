import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  ArrowUpRight,
  Edit3,
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Team } from '../../types/cricket';
import { TeamProfilePage } from './TeamProfilePage';
import { EditTeamModal } from './EditTeamModal';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80';

export const TeamList: React.FC = () => {
  const { teams, hallOfFame, currentUser, canEditTeam, isAdmin, openAuthModal, addTeam } = useTournament();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  // New Team Form state
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [homeGround, setHomeGround] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [primaryColor] = useState('#2c2727');
  const [secondaryColor] = useState('#ff6a17');

  const latestChampionId = hallOfFame[0]?.championTeamId;
  const latestChampionName = hallOfFame[0]?.championTeamName;

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const query = searchQuery.toLowerCase().trim();
    return teams.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.code.toLowerCase().includes(query) ||
      (t.shortName && t.shortName.toLowerCase().includes(query)) ||
      t.players.some(p => p.isCaptain && p.name.toLowerCase().includes(query)) ||
      (t.managerName && t.managerName.toLowerCase().includes(query))
    );
  }, [teams, searchQuery]);

  const selectedTeam = teams.find(t => t.id === selectedTeamId) || null;

  if (selectedTeam) {
    return (
      <TeamProfilePage
        team={selectedTeam}
        onBack={() => setSelectedTeamId(null)}
        onSelectTeam={(t) => setSelectedTeamId(t.id)}
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
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
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
    <div className="space-y-6 pb-12">
      {/* Editorial Header */}
      <div className="border-b border-[#090909]/15 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="rally-eyebrow text-[#736e6e]">
            {teams.length} Clubs · Open &amp; Championship Divisions
          </div>
          <h1 className="rally-h2 mt-1.5 text-[32px] sm:text-[44px] text-[#090909]">
            Meet the competition
          </h1>
          <p className="mt-1.5 text-[15px] text-[#575252] max-w-xl">
            Select any club to inspect the full squad, player statistics and verified roster, or sign in with your captain PIN to upload team photos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#736e6e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search club or captain..."
              className="w-full h-10 pl-9 pr-8 rounded-full border border-[#090909]/20 bg-white text-[14px] text-[#090909] placeholder:text-[#9a9595] focus:outline-none focus:border-[#090909]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#736e6e] hover:text-[#090909]"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => openAuthModal()}
            className="rally-btn rally-btn-primary !h-10 !px-4 !text-[14px]"
          >
            {currentUser.role === 'spectator' ? 'Captain Login' : 'Switch Team'}
          </button>

          {isAdmin() && (
            <button
              onClick={() => setShowAddTeamModal(true)}
              className="rally-btn rally-btn-dark !h-10 !px-4 !text-[14px]"
            >
              <Plus className="w-4 h-4" />
              Add Club
            </button>
          )}
        </div>
      </div>

      {/* Teams Grid (Compact 4–5 Column Editorial Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
        {filteredTeams.map((team) => {
          const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
          const hasEditPermission = canEditTeam(team.id);
          const isDefendingChamp =
            team.id === latestChampionId || team.name === latestChampionName;
          const img = team.teamPhotoUrl || team.bannerUrl;

          return (
            <div key={team.id} className="group flex flex-col">
              <div
                onClick={() => setSelectedTeamId(team.id)}
                className="relative aspect-[16/10] rounded-[6px] overflow-hidden bg-[#2c2727] cursor-pointer"
              >
                {img ? (
                  <img
                    src={img}
                    alt={team.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(160deg, ${team.primaryColor || '#2c2727'} 0%, #090909 85%)`,
                    }}
                  >
                    <span className="text-[44px]">{team.logo || '🏏'}</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/65 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Top Left Status Pill */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
                  {isDefendingChamp && (
                    <span className="px-2 py-0.5 rounded-full bg-[#ff6a17] text-[#090909] text-[10px] font-bold">
                      Champion
                    </span>
                  )}
                  {hasEditPermission && (
                    <span className="px-2 py-0.5 rounded-full bg-[#090909] text-[#f6f4f4] text-[10px] font-bold">
                      Your Squad
                    </span>
                  )}
                </div>

                {/* Top Right Edit Button (if authorized) */}
                {hasEditPermission && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTeam(team);
                    }}
                    title="Edit Franchise Info"
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#f6f4f4] text-[#090909] flex items-center justify-center shadow-sm hover:bg-[#ff6a17] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Bottom Right Hover Arrow */}
                <span className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#f6f4f4] text-[#090909] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              {/* Below-card Typography */}
              <div
                onClick={() => setSelectedTeamId(team.id)}
                className="mt-2 flex items-start justify-between gap-2 cursor-pointer"
              >
                <div className="min-w-0">
                  <h3 className="text-[15px] sm:text-[16px] font-bold tracking-[-0.02em] text-[#090909] group-hover:text-[#ff6a17] transition-colors truncate leading-snug">
                    {team.name}
                  </h3>
                  <p className="text-[12px] text-[#736e6e] truncate">
                    {captain ? `Capt. ${captain.name}` : team.managerName || 'Club Squad'} · {team.players.length}p
                  </p>
                </div>
                <span className="text-[11px] font-mono font-medium text-[#736e6e] mt-0.5 shrink-0">
                  {team.code}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Franchise Modal (Admin Only) */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090909]/80 backdrop-blur-sm">
          <div className="bg-[#f6f4f4] rounded-[10px] max-w-md w-full p-6 space-y-5 text-[#090909] border border-[#090909]/15">
            <div className="flex items-center justify-between border-b border-[#090909]/15 pb-4">
              <h3 className="text-[22px] font-bold tracking-[-0.03em]">Register New Club</h3>
              <button
                onClick={() => setShowAddTeamModal(false)}
                className="w-8 h-8 rounded-full bg-[#090909]/10 flex items-center justify-center text-[#090909]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4 text-[14px]">
              <div>
                <label className="block font-medium mb-1.5">Club Full Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Frankfurt Warriors"
                  className="w-full p-3 rounded-[6px] border border-[#090909]/20 bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1.5">Team Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
                    placeholder="FWX"
                    className="w-full p-3 rounded-[6px] border border-[#090909]/20 bg-white uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1.5">Captain Name</label>
                  <input
                    type="text"
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                    placeholder="Captain Name"
                    className="w-full p-3 rounded-[6px] border border-[#090909]/20 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#090909]/15">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="rally-btn rally-btn-ghost-dark !h-10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rally-btn rally-btn-primary !h-10"
                >
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
        />
      )}
    </div>
  );
};
