import React, { useState } from 'react';
import {
  Menu,
  X,
  KeyRound,
  ShieldCheck,
  Radio,
  ChevronRight,
  Users,
  Trophy,
  Calendar,
  Award,
  BarChart3,
  GitBranch,
  Flame,
  LayoutGrid,
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Match } from '../../types/cricket';

/**
 * FotMob × IPL Pro League Navbar + Live Matchday Scoreboard Ticker Strip
 */
export const RuchiNavbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    openAuthModal,
    matches,
    teams,
    setActiveMatchId,
  } = useTournament();

  const [mobileOpen, setMobileOpen] = useState(false);

  const hasLive = matches.some(m => m.status === 'live' || m.status === 'innings_break');
  const getTeam = (id: string) => teams.find(t => t.id === id);

  const links: { id: string; label: string; badge?: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Match Center', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'teams', label: 'Teams', badge: String(teams.length), icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'fixtures', label: 'Fixtures', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'standings', label: 'Standings', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'stats', label: 'Stats & Caps', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'halloffame', label: 'Hall of Fame', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'playoffs', label: 'Bracket', icon: <GitBranch className="w-3.5 h-3.5" /> },
    { id: 'pickem', label: "Pick'Em", icon: <Flame className="w-3.5 h-3.5" /> },
  ];
  if (currentUser.role === 'admin') {
    links.push({ id: 'organizer', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" /> });
  }

  const go = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sort matches: Live first, then scheduled/toss, then completed
  const sortedMatches = [...matches].sort((a, b) => {
    const rank = (m: Match) =>
      m.status === 'live' || m.status === 'innings_break' ? 0 :
      m.status === 'toss' || m.status === 'scheduled' ? 1 : 2;
    return rank(a) - rank(b) || a.matchNumber - b.matchNumber;
  });

  const handleTickerMatchClick = (m: Match) => {
    setActiveMatchId(m.id);
    go(m.status === 'scheduled' ? 'fixtures' : 'live');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19] text-white shadow-md">
      {/* Row 1: Main League Navigation */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Brand Crest */}
        <button
          onClick={() => go('overview')}
          className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6a17] to-amber-500 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform">
            🏏
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-black tracking-[-0.03em] text-white leading-none">
                Ruchi Masters
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#ff6a17] text-white text-[10px] font-extrabold tracking-wider uppercase leading-none">
                T20
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
              Frankfurt Championship Hub
            </div>
          </div>
        </button>

        {/* Desktop Pill Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/[0.05] p-1 rounded-xl border border-white/10">
          {links.map(l => {
            const active = activeTab === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`h-8 px-3 rounded-lg text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#ff6a17] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className={active ? 'text-white' : 'text-slate-400'}>{l.icon}</span>
                <span>{l.label}</span>
                {l.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      active ? 'bg-black/25 text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {l.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Captain Login + Live Scoring Button */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {currentUser.role === 'team' ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => go('teams')}
                className="h-9 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Go to your squad management page"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="max-w-[140px] truncate">{currentUser.teamName}</span>
              </button>
              <button
                onClick={() => openAuthModal(currentUser.teamId)}
                className="h-9 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[12px] font-semibold transition-colors cursor-pointer"
                title="Switch Team or Logout"
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : currentUser.role === 'admin' ? (
            <button
              onClick={() => openAuthModal()}
              className="h-9 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Active</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="h-9 px-3.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[13px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Captain Login</span>
            </button>
          )}

          <button
            onClick={() => go('live')}
            className="h-9 px-3.5 rounded-lg bg-[#ff6a17] hover:bg-[#ea580c] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Radio className={`w-3.5 h-3.5 ${hasLive ? 'animate-pulse' : ''}`} />
            <span>Live Scores</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="xl:hidden w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Row 2: FotMob-Style Live Matchday Scoreboard Ticker Strip */}
      <div className="bg-[#111827] border-t border-b border-white/10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/10 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
              Matches
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {sortedMatches.map(m => {
              const a = getTeam(m.teamAId);
              const b = getTeam(m.teamBId);
              const isLive = m.status === 'live' || m.status === 'innings_break';
              const isDone = m.status === 'completed';

              const scoreA =
                a && m.innings1 && m.innings1.battingTeamId === a.id
                  ? `${m.innings1.totalRuns}/${m.innings1.totalWickets}`
                  : a && m.innings2 && m.innings2.battingTeamId === a.id
                  ? `${m.innings2.totalRuns}/${m.innings2.totalWickets}`
                  : null;

              const scoreB =
                b && m.innings1 && m.innings1.battingTeamId === b.id
                  ? `${m.innings1.totalRuns}/${m.innings1.totalWickets}`
                  : b && m.innings2 && m.innings2.battingTeamId === b.id
                  ? `${m.innings2.totalRuns}/${m.innings2.totalWickets}`
                  : null;

              return (
                <button
                  key={m.id}
                  onClick={() => handleTickerMatchClick(m)}
                  className={`h-7 px-2.5 rounded-md flex items-center gap-2 text-[12px] border transition-colors shrink-0 cursor-pointer ${
                    isLive
                      ? 'bg-emerald-950/60 border-emerald-500/40 hover:bg-emerald-900/60'
                      : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  {/* Status Tag */}
                  {isLive ? (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                      LIVE
                    </span>
                  ) : isDone ? (
                    <span className="text-[10px] font-bold text-slate-400 uppercase">FT</span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-300">{m.time || m.date}</span>
                  )}

                  {/* Team A */}
                  <span className="flex items-center gap-1 font-bold text-white">
                    <span>{a?.logo || '🏏'}</span>
                    <span>{a?.code || 'TMA'}</span>
                    {scoreA && <span className="font-mono text-amber-300">{scoreA}</span>}
                  </span>

                  <span className="text-slate-500 text-[10px]">vs</span>

                  {/* Team B */}
                  <span className="flex items-center gap-1 font-bold text-white">
                    <span>{b?.logo || '🏏'}</span>
                    <span>{b?.code || 'TMB'}</span>
                    {scoreB && <span className="font-mono text-amber-300">{scoreB}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => go('fixtures')}
            className="ml-auto pl-2 text-[11px] font-bold text-[#ff6a17] hover:text-amber-300 flex items-center gap-0.5 shrink-0 cursor-pointer"
          >
            <span>All Fixtures</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Quick Tab Strip */}
      <div className="xl:hidden bg-[#0f172a] border-b border-white/10 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {links.map(l => {
          const active = activeTab === l.id;
          return (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className={`h-7 px-2.5 rounded-lg text-[12px] font-bold flex items-center gap-1 shrink-0 whitespace-nowrap ${
                active ? 'bg-[#ff6a17] text-white' : 'bg-white/5 text-slate-300'
              }`}
            >
              {l.icon}
              <span>{l.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#0b0f19] border-b border-white/15 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`p-3 rounded-xl text-left text-[14px] font-bold flex items-center justify-between border ${
                  activeTab === l.id
                    ? 'bg-[#ff6a17] text-white border-[#ff6a17]'
                    : 'bg-white/5 text-slate-200 border-white/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  {l.icon}
                  {l.label}
                </span>
                {l.badge && <span className="text-xs opacity-75">{l.badge}</span>}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setMobileOpen(false);
                openAuthModal(currentUser.role === 'team' ? currentUser.teamId : undefined);
              }}
              className="flex-1 h-10 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              {currentUser.role === 'team' ? currentUser.teamName : 'Captain Login'}
            </button>
            <button
              onClick={() => go('live')}
              className="flex-1 h-10 rounded-xl bg-[#ff6a17] text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              Live Console
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
