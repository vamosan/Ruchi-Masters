import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Plus, 
  MapPin, 
  Trophy, 
  Sparkles, 
  Edit3, 
  Trash2, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Camera,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  ArrowRight,
  Crown,
  Flame,
  Zap,
  Lock,
  KeyRound
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Team } from '../../types/cricket';
import { TeamProfilePage } from './TeamProfilePage';
import { EditTeamModal } from './EditTeamModal';

export const TeamList: React.FC = () => {
  const { teams, currentUser, canEditTeam, isAdmin, openAuthModal, addTeam, deleteTeam } = useTournament();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);

  // New Team Form state
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [homeGround, setHomeGround] = useState('');
  const [slogan, setSlogan] = useState('');
  const [coach, setCoach] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [logo, setLogo] = useState('🏏');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [group, setGroup] = useState('Group A');

  const groups = Array.from(new Set(teams.map(t => t.group).filter(Boolean)));

  const filteredTeams = teams.filter(t => {
    if (filterGroup === 'all') return true;
    return t.group === filterGroup;
  });

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
      logo: logo || '🏏',
      primaryColor,
      secondaryColor,
      homeGround: homeGround || 'City Stadium',
      slogan: slogan || 'Play Bold, Strike Hard',
      coach: coach || undefined,
      managerName: captainName || 'Team Captain',
      managerEmail: captainEmail || undefined,
      managerPhone: captainPhone || undefined,
      teamPhotoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80',
      group,
      players: [
        {
          id: 'p-' + teamId + '-1',
          teamId,
          name: captainName || 'Team Captain',
          jerseyNumber: 18,
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
    setSlogan('');
    setCoach('');
    setCaptainName('');
    setCaptainEmail('');
    setCaptainPhone('');
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header & Group Filter Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 sport-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-[#CCFF00] text-slate-950 font-black text-xs sport-badge uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a]">
              <Flame className="w-3.5 h-3.5" />
              Franchises Hub
            </span>
            <span className="text-xs font-black text-slate-500 font-mono">25-PLAYER SQUADS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-cabinet mt-2">
            Tournament Squads & Franchises
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            {teams.length} franchises competing in Ruchi Masters T20 • Each team captain has exclusive management permissions for their own franchise.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Group Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-900 text-xs">
            <button
              onClick={() => setFilterGroup('all')}
              className={'px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ' + (
                filterGroup === 'all' 
                  ? 'bg-slate-950 text-white shadow-[2px_2px_0px_#CCFF00]' 
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
              )}
            >
              All Groups
            </button>
            {groups.map(g => (
              <button
                key={g}
                onClick={() => setFilterGroup(g!)}
                className={'px-3.5 py-1.5 rounded-xl font-black text-xs transition-all ' + (
                  filterGroup === g 
                    ? 'bg-slate-950 text-white shadow-[2px_2px_0px_#CCFF00]' 
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                )}
              >
                {g}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (isAdmin()) {
                setShowAddTeamModal(true);
              } else {
                openAuthModal();
              }
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#00F59B] text-slate-950 font-black text-xs sport-btn flex items-center gap-1.5 shadow-[3px_3px_0px_#0f172a]"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdmin() ? 'Register Franchise' : 'Admin: Register Team'}</span>
          </button>
        </div>
      </div>

      {/* Role Notice Strip */}
      <div className="p-4 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-2 border-slate-900 shadow-sm text-xs">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-4 h-4 text-[#CCFF00] shrink-0" />
          <span>
            {currentUser.role === 'admin' ? (
              <span><strong>Logged in as Super Admin:</strong> You have full control to manage and edit all franchise rosters.</span>
            ) : currentUser.role === 'team' ? (
              <span><strong>Logged in as {currentUser.teamName} Captain:</strong> You can edit your squad and upload player verification photos. Other squads are in view-only mode.</span>
            ) : (
              <span><strong>Viewing as Spectator (Public Mode):</strong> Squads and rosters are view-only. Log in as your Team Captain or Admin to edit details.</span>
            )}
          </span>
        </div>

        <button
          onClick={() => openAuthModal()}
          className="px-3 py-1 rounded-xl bg-[#CCFF00] text-slate-950 font-black text-xs sport-btn shrink-0"
        >
          {currentUser.role === 'spectator' ? 'Captain / Admin Login' : 'Switch Role'}
        </button>
      </div>

      {/* Teams Grid (Sporty Trading Cards with Permission Tags) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const captain = team.players.find(p => p.isCaptain || p.id === team.captainId);
          const authenticatedCount = team.players.filter(p => p.isAuthenticated).length;
          const hasEditPermission = canEditTeam(team.id);

          return (
            <div
              key={team.id}
              className={'bg-white rounded-3xl sport-card overflow-hidden flex flex-col justify-between hover:-translate-y-2 hover:shadow-[8px_8px_0px_#0f172a] transition-all group border-3 ' + (
                hasEditPermission ? 'border-amber-400 ring-2 ring-amber-300/50' : 'border-slate-950'
              )}
            >
              {/* Card Banner Preview with Stadium Backdrop */}
              <div 
                className="relative h-40 w-full overflow-hidden cursor-pointer bg-slate-950"
                onClick={() => setSelectedTeamId(team.id)}
              >
                <img
                  src={team.bannerUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'}
                  alt={team.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 brightness-[0.55]"
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, ' + (team.primaryColor || '#2563eb') + '88, ' + (team.secondaryColor || '#f59e0b') + '40, transparent)'
                  }}
                />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {hasEditPermission ? (
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-[#CCFF00] text-slate-950 sport-badge shadow animate-pulse">
                      👑 YOUR SQUAD
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-black/70 backdrop-blur text-slate-300 border border-white/20">
                      👀 VIEW ONLY
                    </span>
                  )}

                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-white text-slate-950 shadow border-2 border-slate-950 font-mono">
                    {team.code}
                  </span>
                </div>

                {/* Team Mascot Avatar sitting cleanly inside bottom-left */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3">
                  <div 
                    className="w-13 h-13 rounded-2xl flex items-center justify-center text-3xl border-2 border-white shadow-xl bg-white/20 backdrop-blur"
                    style={{ backgroundColor: (team.primaryColor || '#2563eb') + 'ee' }}
                  >
                    {team.logo}
                  </div>
                  <div className="text-white drop-shadow-md">
                    <span className="text-[10px] font-black uppercase tracking-wider block text-amber-300 font-mono">FRANCHISE</span>
                    <span className="text-base font-black leading-tight block font-cabinet">{team.name}</span>
                  </div>
                </div>
              </div>

              {/* Card Main Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-amber-600 font-bold italic truncate">
                        "{team.slogan || 'Play Bold, Strike Hard'}"
                      </p>
                    </div>

                    {hasEditPermission ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTeam(team);
                        }}
                        className="p-1.5 rounded-xl bg-[#FFE600] hover:bg-[#ebd300] text-slate-950 transition-colors border-2 border-slate-900 shadow-[1px_1px_0px_#0f172a]"
                        title="Edit Team Profile & Picture"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAuthModal(team.id);
                        }}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-[#CCFF00] text-slate-600 hover:text-slate-950 transition-colors border border-slate-300"
                        title={'Log in as ' + team.name + ' Captain to edit'}
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Team Metadata Box */}
                  <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-900/40 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-amber-500" /> Captain
                      </span>
                      <span className="font-black text-slate-900">{captain ? captain.name : (team.managerName || 'TBD')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600" /> Home Ground
                      </span>
                      <span className="font-bold text-slate-800 truncate max-w-[160px]">{team.homeGround}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-bold flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-600" /> Squad Roster
                      </span>
                      <span className="font-black text-slate-900 font-mono">{team.players.length} Players</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Captain Verification & Navigation CTA */}
                <div className="space-y-3 pt-2 border-t-2 border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium truncate">
                      Captain: <strong className="text-slate-900">{captain?.name || team.managerName || 'TBD'}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 shrink-0 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{authenticatedCount}/{team.players.length} Auth</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedTeamId(team.id)}
                    className="w-full py-2.5 rounded-2xl bg-slate-950 group-hover:bg-[#CCFF00] text-white group-hover:text-slate-950 font-black text-xs sport-btn flex items-center justify-center gap-2 transition-all shadow-[3px_3px_0px_#0f172a]"
                  >
                    <span>{hasEditPermission ? 'Manage Squad & Photos ➔' : 'View Squad & Passports ➔'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Franchise Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl sport-card max-w-md w-full p-6 space-y-4 text-slate-900 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏏</span>
                <h3 className="text-lg font-black font-cabinet">Register New Franchise</h3>
              </div>
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
                  placeholder="e.g. Hyderabad Hawks"
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
                    placeholder="e.g. HAWK"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white outline-none font-bold uppercase text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Group</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white outline-none font-bold text-xs"
                  >
                    <option value="Group A">Group A</option>
                    <option value="Group B">Group B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Team Slogan / Motto</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="e.g. Fly High, Strike Deep"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white outline-none font-bold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Home Ground Stadium</label>
                <input
                  type="text"
                  value={homeGround}
                  onChange={(e) => setHomeGround(e.target.value)}
                  placeholder="e.g. Rajiv Gandhi International Stadium"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white outline-none font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Franchise Captain</label>
                  <input
                    type="text"
                    value={captainName}
                    onChange={(e) => setCaptainName(e.target.value)}
                    placeholder="Captain Name"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white outline-none font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Head Coach</label>
                  <input
                    type="text"
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    placeholder="Coach Name"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 focus:bg-white outline-none font-bold text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00F59B] sport-btn font-black text-slate-950"
                >
                  Create Franchise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Modal Triggered Directly from Grid */}
      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
        />
      )}
    </div>
  );
};
