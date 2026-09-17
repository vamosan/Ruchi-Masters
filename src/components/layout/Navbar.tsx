import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  Radio, 
  TableProperties, 
  Users, 
  Award, 
  GitBranch, 
  ShieldCheck, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export const Navbar: React.FC = () => {
  const { 
    tournament, 
    viewMode, 
    setViewMode, 
    activeTab, 
    setActiveTab, 
    exportTournamentJson, 
    importTournamentJson, 
    resetToDemoData,
    matches
  } = useTournament();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const liveMatchesCount = matches.filter(m => m.status === 'live').length;

  const navTabs = [
    { id: 'overview', label: 'Tournament', icon: Trophy },
    { id: 'fixtures', label: 'Fixtures & Results', icon: Calendar },
    { id: 'live', label: 'Match Center', icon: Radio, badge: liveMatchesCount > 0 ? `${liveMatchesCount} LIVE` : undefined },
    { id: 'standings', label: 'Points Table', icon: TableProperties },
    { id: 'teams', label: 'Teams & Squads', icon: Users },
    { id: 'stats', label: 'Leaderboard', icon: Award },
    { id: 'playoffs', label: 'Playoffs & Finals', icon: GitBranch },
    ...(viewMode === 'organizer' ? [{ id: 'organizer', label: 'Organizer Console', icon: ShieldCheck }] : [])
  ];

  const handleExport = () => {
    const dataStr = exportTournamentJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tournament.id}-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!jsonInput.trim()) return;
    const success = importTournamentJson(jsonInput);
    if (success) {
      setImportStatus('Tournament restored successfully!');
      setTimeout(() => {
        setImportModalOpen(false);
        setImportStatus(null);
        setJsonInput('');
      }, 1200);
    } else {
      setImportStatus('Invalid JSON tournament data schema.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
        {/* Top Ticker / Meta bar */}
        <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-indigo-900 text-white text-xs font-semibold py-1 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="text-amber-200 font-bold uppercase tracking-wider text-[11px]">Tournament Suite</span>
            <span className="hidden sm:inline text-white/70">|</span>
            <span className="truncate text-white/90">{tournament.name} • {tournament.edition} • {tournament.location}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] shrink-0">
            {/* Quick backup / reset buttons */}
            <button 
              onClick={handleExport}
              title="Download Tournament Backup JSON"
              className="hover:text-amber-200 flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              <span className="hidden md:inline">Export Backup</span>
            </button>
            <button 
              onClick={() => setImportModalOpen(true)}
              title="Restore from JSON"
              className="hover:text-amber-200 flex items-center gap-1 transition-colors"
            >
              <Upload className="w-3 h-3" />
              <span className="hidden md:inline">Import</span>
            </button>
            <button 
              onClick={() => {
                if (window.confirm('Reset all match scores and teams to certified demo tournament data?')) {
                  resetToDemoData();
                }
              }}
              title="Reset to Demo State"
              className="hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Main Nav Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
                  🏏
                </div>
              </div>
              <div>
                <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-emerald-300 to-sky-400 bg-clip-text text-transparent flex items-center gap-1.5">
                  CRICMASTER <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">PRO</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Tournament Organizer & Live Engine
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive 
                        ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/80 font-semibold' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white animate-pulse">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: View Mode Toggle & Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              {/* Mode Switcher: Fan View vs Organizer Control */}
              <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setViewMode('spectator')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === 'spectator'
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fan View</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('organizer');
                    if (activeTab === 'overview') setActiveTab('organizer');
                  }}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === 'organizer'
                      ? 'bg-gradient-to-r from-amber-600 to-emerald-600 text-white shadow font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Scorer / Admin</span>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                    isActive ? 'bg-slate-800 text-amber-400 font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* JSON Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                Import Tournament JSON
              </h3>
              <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Paste the exported tournament JSON file content below to restore all tournament fixtures, teams, live innings, and player scorecards.
            </p>

            <textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              placeholder="Paste exported JSON here..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
            />

            {importStatus && (
              <div className={`text-xs p-2.5 rounded-lg font-medium ${importStatus.includes('success') ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-rose-950/80 text-rose-300 border border-rose-800'}`}>
                {importStatus}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
              >
                Import & Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
