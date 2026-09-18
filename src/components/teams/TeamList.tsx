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
  Lock
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

  // If a team is selected, show its full dedicated page!
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 sport-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-[#CCFF00] text-slate-950 font-black text-xs sport-badge uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a]">
              <Shield className="w-3.5 h-3.5" />
              Tournament Franchises
            </span>
            <span className="text-xs font-black text-slate-500 font-mono">{teams.length} OFFICIAL SQUADS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-cabinet mt-2">
            Franchises & Squad Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Browse all verified squads, view player profiles, or login as Team Captain to manage your roster.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams by name or code (e.g. Dragons, Titans)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl border-2 border-slate-900 bg-slate-50 text-slate-950 font-bold text-xs focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0f172a]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-900 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Role Notice Strip */}
      <div className="p-4 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-2 border-slate-900 shadow-sm text-xs">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-4 h-4 text-[#CCFF00] shrink-0" />
          <span>
            {currentUser.role === 'admin' ? (
              <span><strong>Super Admin Mode:</strong> You have full control to edit all 40 franchise rosters and certify players.</span>
            ) : currentUser.role === 'team' ? (
              <span><strong>Logged in as {currentUser.teamName} Captain:</strong> You have exclusive permission to edit your squad and upload player photos.</span>
            ) : (
              <span><strong>Public View:</strong> Squads are view-only. Team Captains can log in with their secret franchise PIN to edit rosters.</span>
            )}
          </span>
        </div>

        <button
          onClick={() => openAuthModal()}
          className="px-3 py-1.5 rounded-xl bg-[#CCFF00] text-slate-950 font-black text-xs sport-btn shrink-0"
        >
          {currentUser.role === 'spectator' ? 'Captain Login' : 'Switch Account'}
        </button>
      </div>

      {/* Search Result Stats */}
      {searchQuery && (
        <div className="text-xs font-bold text-slate-600 px-2 flex items-center justify-between">
          <span>Showing {filteredTeams.length} of {teams.length} teams matching "{searchQuery}"</span>
          <button onClick={() => setSearchQuery('')} className="text-indigo-600 hover:underline font-black">
            Clear Search
          </button>
        </div>
      )}

      {/* Teams Grid (Clean, Professional Sports Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
          const hasEditPermission = canEditTeam(team.id);

          return (
            <div
              key={team.id}
              className={'bg-white rounded-3xl sport-card overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[6px_6px_0px_#0f172a] transition-all group border-3 ' + (
                hasEditPermission ? 'border-[#CCFF00] ring-2 ring-[#CCFF00]/60' : 'border-slate-950'
              )}
            >
              {/* Card Banner Preview with Stadium Backdrop */}
              <div 
                className="relative h-36 w-full overflow-hidden cursor-pointer bg-slate-950"
                onClick={() => setSelectedTeamId(team.id)}
              >
                <img
                  src={team.bannerUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'}
                  alt={team.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.45]"
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, ' + (team.primaryColor || '#0284c7') + 'aa, ' + (team.secondaryColor || '#38bdf8') + '30, transparent)'
                  }}
                />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {hasEditPermission && (
                    <span className="px-2.5 py-0.5 rounded-xl text-[10px] font-black bg-[#CCFF00] text-slate-950 sport-badge shadow">
                      YOUR SQUAD
                    </span>
                  )}
                </div>

                {/* Team Monogram Badge sitting inside bottom-left */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3">
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center border-2 border-white/40 shadow-xl text-white bg-slate-900/60 backdrop-blur"
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-white drop-shadow-md">
                    <span className="text-lg font-black leading-tight block font-cabinet">{team.name}</span>
                  </div>
                </div>
              </div>

              {/* Card Main Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Team Metadata Box */}
                  <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-500" /> Captain
                      </span>
                      <span className="font-black text-slate-900">{captain ? captain.name : (team.managerName || 'Assigned')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600" /> Home Venue
                      </span>
                      <span className="font-bold text-slate-800 truncate max-w-[160px]">{team.homeGround || 'Apex Oval Complex'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-600" /> Squad Size
                      </span>
                      <span className="font-black text-slate-900 font-mono">{team.players.length} Players</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Navigation CTA */}
                <div className="space-y-2 pt-2 border-t-2 border-slate-100">
                  <button
                    onClick={() => setSelectedTeamId(team.id)}
                    className="w-full py-2.5 rounded-2xl bg-slate-950 group-hover:bg-[#CCFF00] text-white group-hover:text-slate-950 font-black text-xs sport-btn flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_#0f172a]"
                  >
                    <span>{hasEditPermission ? 'Manage Squad & Photos ➔' : 'View Full Squad ➔'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Franchise Modal (Admin Only) */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl sport-card max-w-md w-full p-6 space-y-4 text-slate-900 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black font-cabinet">Register New Franchise</h3>
              <button 
                onClick={() => setShowAddTeamModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 sport-pill flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Franchise Full Name *</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Frankfurt Warriors"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white outline-none font-bold text-xs"
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
                    onChange={(e) => setTeamCode(e.target.value)}
                    placeholder="FWX"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 uppercase font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Captain Name</label>
                  <input
                    type="text"
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                    placeholder="Captain Name"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-100 font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-[#00F59B] sport-btn text-slate-950 font-black"
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
