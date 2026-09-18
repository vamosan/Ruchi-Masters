import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Crown, 
  Lock, 
  KeyRound, 
  UserCheck, 
  LogOut, 
  Check, 
  ArrowRight,
  Sparkles,
  ShieldAlert,
  AlertCircle,
  Search,
  Key,
  HelpCircle,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTeamId?: string | null;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, initialTeamId }) => {
  const { 
    teams, 
    currentUser, 
    loginAsAdmin, 
    loginAsTeam, 
    logout, 
    setTeamPasscode 
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'team' | 'admin'>('team');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialTeamId || teams[0]?.id || '');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  
  // Modes: 'login' | 'setup_pin' | 'reset_pin'
  const [authMode, setAuthMode] = useState<'login' | 'setup_pin' | 'reset_pin'>('login');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const selectedTeam = useMemo(() => teams.find(t => t.id === selectedTeamId) || teams[0], [teams, selectedTeamId]);
  const hasPinConfigured = Boolean(selectedTeam?.passcode || selectedTeam?.isPinSet);

  useEffect(() => {
    if (initialTeamId) {
      setSelectedTeamId(initialTeamId);
      setActiveTab('team');
    }
  }, [initialTeamId]);

  useEffect(() => {
    // When switching teams, check if PIN exists
    setErrorMsg('');
    setPasscode('');
    setConfirmPasscode('');
    if (selectedTeam && !selectedTeam.passcode && !selectedTeam.isPinSet) {
      setAuthMode('setup_pin');
    } else {
      setAuthMode('login');
    }
  }, [selectedTeamId]);

  // Filter 40+ teams smoothly by name or code
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const query = searchQuery.toLowerCase().trim();
    return teams.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.code.toLowerCase().includes(query) ||
      (t.shortName && t.shortName.toLowerCase().includes(query)) ||
      (t.managerName && t.managerName.toLowerCase().includes(query))
    );
  }, [teams, searchQuery]);

  if (!isOpen) return null;

  const handleTeamLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    if (!selectedTeam) {
      setErrorMsg('Please select a valid franchise.');
      return;
    }

    const success = loginAsTeam(selectedTeam.id, passcode);
    if (success) {
      setSuccessMsg('Successfully logged in as ' + selectedTeam.name + ' Captain!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 800);
    } else {
      setErrorMsg('Invalid franchise passcode. Default PIN is 2026. (If needed, click "Reset PIN").');
    }
  };

  const handleSetNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!passcode || passcode.length < 4) {
      setErrorMsg('PIN must be at least 4 digits/characters.');
      return;
    }

    if (passcode !== confirmPasscode) {
      setErrorMsg('PIN confirmation does not match. Please re-enter.');
      return;
    }

    if (!selectedTeam) return;

    // Save newly configured PIN directly on team
    setTeamPasscode(selectedTeam.id, passcode);

    // Immediately log in as team captain
    loginAsTeam(selectedTeam.id, passcode);

    setSuccessMsg('Franchise PIN set! Logged in as ' + selectedTeam.name + ' Captain.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 900);
  };

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const success = loginAsAdmin(passcode);
    if (success) {
      setSuccessMsg('Successfully logged in as Tournament Super Admin!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 800);
    } else {
      setErrorMsg('Invalid admin passcode. (Demo passcode: admin123)');
    }
  };

  const handleLogout = () => {
    logout();
    setSuccessMsg('Logged out to Spectator mode.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 700);
  };

  const captain = selectedTeam?.players.find(p => p.isCaptain || p.id === selectedTeam?.captainId);

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-3 border-slate-950 shadow-[10px_10px_0px_#0f172a] text-slate-900 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Pinned Modal Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#CCFF00] text-slate-950 border border-slate-900 shadow-sm shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-cabinet leading-tight">
                Tournament Access & Security
              </h3>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">RUCHI MASTERS T20 AUTH PORTAL</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 hover:text-white flex items-center justify-center font-bold text-slate-300 transition-colors shrink-0"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active User Status Bar */}
        <div className="p-3 bg-slate-100 border-b-2 border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-500 font-bold shrink-0">Current Session:</span>
            {currentUser.role === 'admin' ? (
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-200 text-amber-950 font-black flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>Super Admin</span>
              </span>
            ) : currentUser.role === 'team' ? (
              <span className="px-2.5 py-0.5 rounded-lg bg-[#CCFF00] text-slate-950 font-black flex items-center gap-1.5 font-cabinet truncate">
                <Crown className="w-3.5 h-3.5" />
                <span className="truncate">{currentUser.teamName} Captain</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-700 font-bold">
                👀 Spectator (Read-Only)
              </span>
            )}
          </div>

          {currentUser.role !== 'spectator' && (
            <button
              onClick={handleLogout}
              className="text-rose-600 hover:text-rose-800 font-black flex items-center gap-1 hover:underline shrink-0 ml-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>

        {/* Role Tab Switcher */}
        <div className="flex border-b-2 border-slate-900 bg-slate-50 text-xs shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('team');
              setErrorMsg('');
              setPasscode('');
            }}
            className={'flex-1 py-3 px-4 font-black flex items-center justify-center gap-2 transition-all ' + (
              activeTab === 'team'
                ? 'bg-white text-slate-950 border-b-3 border-[#CCFF00]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Franchise Captain (40+ Teams)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMsg('');
              setPasscode('');
            }}
            className={'flex-1 py-3 px-4 font-black flex items-center justify-center gap-2 transition-all ' + (
              activeTab === 'admin'
                ? 'bg-white text-slate-950 border-b-3 border-[#FFE600]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            )}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Tournament Admin</span>
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Success / Error Notifications */}
          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-900 text-xs font-black flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-100 border-2 border-rose-400 text-rose-900 text-xs font-black flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: TEAM CAPTAIN PORTAL (SCALABLE 40+ TEAMS SEARCH & PIN SETUP) */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              
              {/* STEP 1: Searchable Dropdown / Selector for 40+ Teams */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Franchise ({teams.length} Teams Registered) *
                </label>
                
                {/* Search Filter Input */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by team name, code (e.g. Hawks, HAW)..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-slate-300 focus:border-slate-950 text-xs font-bold bg-slate-50 text-slate-900 focus:outline-none"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Compact Scrollable List of 40+ Teams */}
                <div className="max-h-36 overflow-y-auto rounded-2xl border-2 border-slate-900 divide-y divide-slate-100 bg-white shadow-inner">
                  {filteredTeams.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-medium">
                      No teams match "{searchQuery}"
                    </div>
                  ) : (
                    filteredTeams.map(team => {
                      const isSelected = selectedTeam?.id === team.id;
                      const hasPin = Boolean(team.passcode || team.isPinSet);
                      return (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => setSelectedTeamId(team.id)}
                          className={'w-full px-3.5 py-2 flex items-center justify-between text-left text-xs transition-colors ' + (
                            isSelected 
                              ? 'bg-[#CCFF00]/40 font-black text-slate-950' 
                              : 'hover:bg-slate-50 text-slate-700'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="min-w-0">
                              <div className="font-bold truncate text-slate-900 font-cabinet text-sm">{team.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">Captain: {team.players.find(p=>p.isCaptain)?.name || team.managerName || 'Assigned'}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {hasPin ? (
                              <span className="text-[10px] text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded-lg flex items-center gap-1" title="PIN Protected">
                                <Lock className="w-2.5 h-2.5" /> PIN Set
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-700 font-black bg-amber-100 px-2 py-0.5 rounded-lg flex items-center gap-1" title="First Time Setup Required">
                                <Sparkles className="w-2.5 h-2.5" /> New
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Selected Team Highlight Banner */}
              {selectedTeam && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-black text-base font-cabinet leading-tight text-[#CCFF00]">{selectedTeam.name}</h4>
                      <div className="text-[11px] text-slate-300 font-medium">Captain on record: <strong className="text-white">{captain?.name || selectedTeam.managerName || 'Team Captain'}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DYNAMIC FLOW - (FIRST-TIME PIN SETUP vs LOGIN vs RESET) */}
              
              {/* FLOW A: FIRST-TIME PIN CREATION */}
              {authMode === 'setup_pin' && (
                <form onSubmit={handleSetNewPin} className="space-y-3 pt-1 border-t-2 border-slate-200">
                  <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 space-y-1">
                    <div className="font-black flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>First-Time Captain Setup: Create Your Secret PIN</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                      No PIN is set yet for <strong>{selectedTeam?.name}</strong>. As the franchise captain, create your 4-digit PIN now to secure your squad editing access.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                        Create 4-Digit PIN *
                      </label>
                      <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="e.g. 5821"
                        maxLength={8}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CCFF00] font-mono text-sm tracking-widest bg-slate-50 text-slate-950"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                        Confirm PIN *
                      </label>
                      <input
                        type="password"
                        value={confirmPasscode}
                        onChange={(e) => setConfirmPasscode(e.target.value)}
                        placeholder="Re-enter PIN"
                        maxLength={8}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CCFF00] font-mono text-sm tracking-widest bg-slate-50 text-slate-950"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#CCFF00] hover:bg-[#bdf000] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] transition-all"
                  >
                    <Key className="w-4 h-4 text-slate-950" />
                    <span>Set PIN & Enter {selectedTeam?.name || 'Squad'}</span>
                  </button>
                </form>
              )}

              {/* FLOW B: NORMAL PIN LOGIN */}
              {authMode === 'login' && (
                <form onSubmit={handleTeamLogin} className="space-y-3 pt-1 border-t-2 border-slate-200">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Enter Captain PIN *
                      </label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('reset_pin')}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                      >
                        Forgot / Reset PIN?
                      </button>
                    </div>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter 4-digit franchise PIN"
                      className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CCFF00] font-mono text-sm tracking-widest bg-slate-50 text-slate-950"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_#CCFF00] transition-all"
                    >
                      <KeyRound className="w-4 h-4 text-[#CCFF00]" />
                      <span>Log In to Manage {selectedTeam?.name || 'Squad'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* FLOW C: PIN RESET */}
              {authMode === 'reset_pin' && (
                <div className="space-y-3 pt-1 border-t-2 border-slate-200">
                  <div className="p-3 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-xs text-indigo-950 space-y-1.5">
                    <div className="font-black flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Reset Franchise PIN</span>
                    </div>
                    <p className="text-[11px] text-indigo-900 leading-relaxed font-medium">
                      To reset the PIN for <strong>{selectedTeam?.name}</strong>, either log in with the Tournament Admin account or set a new PIN directly below:
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('setup_pin');
                      setPasscode('');
                      setConfirmPasscode('');
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                  >
                    <span>Proceed to Set New 4-Digit PIN ➔</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="w-full text-center text-xs text-slate-600 hover:text-slate-900 font-bold py-1 hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: TOURNAMENT ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-100/90 border-2 border-amber-400 text-xs text-amber-950 space-y-1">
                <div className="font-black flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                  <span>Super Admin Master Access:</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  Tournament Super Admin has master authority to manage all 40+ franchise squads, reset team PINs, edit match fixtures, override scores, and manage tournament bylaws.
                </p>
              </div>

              {/* Admin Passcode */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Admin Master Passcode *
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Demo PIN: <strong className="text-slate-950 bg-slate-200 px-1 rounded">admin123</strong></span>
                </div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFE600] font-mono text-sm tracking-widest bg-slate-50 text-slate-950"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#FFE600] hover:bg-[#ebd300] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a] transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Log In as Super Admin</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
