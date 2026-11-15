import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight, KeyRound, UserCheck, ShieldCheck } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

/**
 * Rally-style top navigation with the signature dashed-seam cricket ball mark
 * and direct Captain Login -> Team Profile access.
 */
export const RuchiNavbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setActiveTeamProfileId,
    openTeamProfile,
    currentUser,
    openAuthModal,
    matches,
    teams,
  } = useTournament();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hasLive = matches.some(m => m.status === 'live' || m.status === 'innings_break');

  const links: { id: string; label: string }[] = [
    { id: 'overview', label: 'Home' },
    { id: 'fixtures', label: 'Schedule' },
    { id: 'teams', label: `Teams (${teams.length})` },
    { id: 'standings', label: 'Standings' },
    { id: 'stats', label: 'Stats' },
    { id: 'playoffs', label: 'Bracket' },
    { id: 'halloffame', label: 'Hall of Fame' },
    { id: 'pickem', label: "Pick'Em" },
  ];
  if (currentUser.role === 'admin') links.push({ id: 'organizer', label: 'Admin' });

  const go = (id: string) => {
    if (id === 'teams') {
      setActiveTeamProfileId(null);
    }
    setActiveTab(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-[#090909] text-[#f6f4f4] transition-[border-color] duration-300 border-b ${
        scrolled ? 'border-white/10' : 'border-white/5'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        {/* Rally Cricket Ball Wordmark */}
        <button
          onClick={() => go('overview')}
          className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
          aria-label="Home"
        >
          <span className="relative w-8 h-8 rounded-full bg-[#ff6a17] flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="absolute inset-[6px] rounded-full border-2 border-[#090909] border-dashed opacity-75" />
          </span>
          <span className="text-[19px] font-bold tracking-[-0.03em]">Ruchi Masters</span>
        </button>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {links.map(l => {
            const active = activeTab === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`relative px-3 py-2 text-[14px] font-medium transition-colors cursor-pointer ${
                  active ? 'text-[#f6f4f4]' : 'text-[#f6f4f4]/55 hover:text-[#f6f4f4]'
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute left-3 right-3 -bottom-[1px] h-[2px] bg-[#ff6a17]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right actions: Direct Admin Panel / Team Login / My Profile + Live Scores */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {currentUser.role === 'admin' && (
            <button
              onClick={() => go('organizer')}
              className="h-9 px-3.5 rounded-full bg-white/15 hover:bg-[#ff6a17] hover:text-[#090909] text-[13px] font-bold text-[#ff6a17] transition-colors cursor-pointer flex items-center gap-1.5"
              title="Open Admin Command Center (Edit Fixtures, Standings & Stats)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
          {currentUser.role === 'team' && currentUser.teamId && (
            <button
              onClick={() => openTeamProfile(currentUser.teamId!)}
              className="h-9 px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-[13px] font-bold text-[#ff6a17] transition-colors cursor-pointer flex items-center gap-1.5"
              title="Go directly to your Team Profile"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>
          )}
          <button
            onClick={() => openAuthModal()}
            className="h-9 px-3.5 rounded-full border border-white/25 hover:border-[#ff6a17] hover:text-[#ff6a17] text-[13px] font-medium text-[#f6f4f4] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#ff6a17]" />
            <span>{currentUser.role === 'spectator' ? 'Team Login' : 'Switch Login'}</span>
          </button>
          <button
            onClick={() => go('live')}
            className="rally-btn rally-btn-primary !h-9 !px-4 !text-[13px]"
          >
            {hasLive && <span className="w-1.5 h-1.5 rounded-full bg-[#090909]" />}
            Live Scores
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="lg:hidden w-10 h-10 -mr-2 flex items-center justify-center"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-[#090909] px-5 pt-3 pb-8 overflow-y-auto border-t border-white/10">
          <div className="flex flex-col">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`flex items-center justify-between py-3.5 border-b border-white/10 text-left text-[24px] font-bold tracking-[-0.03em] ${
                  activeTab === l.id ? 'text-[#ff6a17]' : 'text-[#f6f4f4]'
                }`}
              >
                {l.label}
                <ArrowUpRight className="w-5 h-5 opacity-40" />
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            {currentUser.role === 'team' && currentUser.teamId && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openTeamProfile(currentUser.teamId!);
                }}
                className="rally-btn rally-btn-primary w-full"
              >
                <UserCheck className="w-4 h-4" />
                My Team Profile
              </button>
            )}
            <button
              onClick={() => {
                setMobileOpen(false);
                openAuthModal();
              }}
              className="rally-btn rally-btn-ghost-light w-full"
            >
              <KeyRound className="w-4 h-4 text-[#ff6a17]" />
              Team Login
            </button>
            <button onClick={() => go('live')} className="rally-btn rally-btn-primary w-full">
              Live Scores
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
