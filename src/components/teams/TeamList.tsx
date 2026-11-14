import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Shield, 
  Plus, 
  MapPin, 
  Trophy, 
  Sparkles, 
  Edit3, 
  ChevronRight,
  Search,
  CheckCircle2,
  Camera,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Crown,
  Flame,
  KeyRound,
  Lock,
  X
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Team } from '../../types/cricket';
import { TeamProfilePage } from './TeamProfilePage';
import { EditTeamModal } from './EditTeamModal';

export const TeamList: React.FC = () => {
  const { teams, currentUser, canEditTeam, isAdmin, openAuthModal, addTeam } = useTournament();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  // New Team Form state
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [homeGround, setHomeGround] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0284c7');
  const [secondaryColor, setSecondaryColor] = useState('#38bdf8');

  // Filter 40 teams by search term
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

  // If a team is selected, show its full dedicated profile page
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
      homeGround: homeGround || 'Apex Oval Complex',
      managerName: captainName || 'Team Captain',
      teamPhotoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80',
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
          economy: 0
        }
      ]
    };

    addTeam(newTeam);
    setShowAddTeamModal(false);
    setTeamName('');
    setTeamCode('');
    setHomeGround('');
    setCaptainName('');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider border border-slate-200">
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              Official Rosters
            </span>
            <span className="text-xs font-mono font-medium text-slate-500">{teams.length} FRANCHISES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 font-cabinet mt-2">
            Franchises & Squad Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal leading-relaxed">
            Browse all certified squads, inspect player profiles, or login as Team Captain to manage your roster.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams by name or code..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-xs focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-900"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Role Notice Strip */}
      <div className="p-4 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            {currentUser.role === 'admin' ? (
              <span><strong className="text-white">Super Admin Mode:</strong> You have full control to edit all 40 franchise rosters and certify players.</span>
            ) : currentUser.role === 'team' ? (
              <span><strong className="text-white">Logged in as {currentUser.teamName} Captain:</strong> You have exclusive permission to edit your squad and upload player photos.</span>
            ) : (
              <span><strong className="text-white">Public Directory:</strong> Squads are view-only. Team Captains can log in with their secret PIN to manage rosters.</span>
            )}
          </span>
        </div>

        <button
          onClick={() => openAuthModal()}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-xs shrink-0 transition-colors"
        >
          {currentUser.role === 'spectator' ? 'Captain Login' : 'Switch Account'}
        </button>
      </div>

      {/* Search Result Stats */}
      {searchQuery && (
        <div className="text-xs font-medium text-slate-600 px-2 flex items-center justify-between">
          <span>Showing {filteredTeams.length} of {teams.length} teams matching "{searchQuery}"</span>
          <button onClick={() => setSearchQuery('')} className="text-amber-600 hover:underline font-semibold">
            Clear Search
          </button>
        </div>
      )}

      {/* Teams Grid (Clean Mobbin-style Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
          const hasEditPermission = canEditTeam(team.id);

          return (
            <div
              key={team.id}
              className={`bg-white rounded-2xl border overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group ${
                hasEditPermission ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-200/80 shadow-xs'
              }`}
            >
              {/* Card Banner Preview */}
              <div 
                className="relative h-32 w-full overflow-hidden cursor-pointer bg-slate-950"
                onClick={() => setSelectedTeamId(team.id)}
              >
                <img
                  src={team.bannerUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'}
                  alt={team.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, ' + (team.primaryColor || '#0284c7') + '88, transparent)'
                  }}
                />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {hasEditPermission && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-sm">
                      YOUR SQUAD
                    </span>
                  )}
                </div>

                {/* Team Monogram Badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-white/20 shadow-md text-white bg-slate-950/70 backdrop-blur-md"
                  >
                    {team.logo || '🏏'}
                  </div>
                  <div className="text-white drop-shadow">
                    <span className="text-base font-bold leading-tight block font-cabinet">{team.name}</span>
                    <span className="text-[10px] font-mono text-slate-300 font-medium">{team.code}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-500" /> Captain
                    </span>
                    <span className="font-semibold text-slate-900">{captain ? captain.name : (team.managerName || 'Assigned')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Home Venue
                    </span>
                    <span className="font-medium text-slate-700 truncate max-w-[150px]">{team.homeGround || 'Frankfurt Cricket Ground'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Squad Size
                    </span>
                    <span className="font-semibold text-slate-900 font-mono">{team.players.length} Athletes</span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedTeamId(team.id)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>{hasEditPermission ? 'Manage Squad & Photos' : 'View Full Squad'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Franchise Modal (Admin Only) */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-slate-900 text-xs border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold font-cabinet">Register New Franchise</h3>
              <button 
                onClick={() => setShowAddTeamModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Franchise Full Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Frankfurt Warriors"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none font-medium text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Team Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
                    placeholder="FWX"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 uppercase font-mono font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Captain Name</label>
                  <input
                    type="text"
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                    placeholder="Captain Name"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Create Team
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
