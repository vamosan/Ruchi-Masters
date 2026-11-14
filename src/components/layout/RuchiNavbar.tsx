import React, { useEffect, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

/**
 * Rally-style top navigation.
 * Ink background, quiet text links, a single orange pill CTA.
 */
export const RuchiNavbar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, openAuthModal, matches } = useTournament();
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
    { id: 'fixtures', label: 'Schedule' },
    { id: 'teams', label: 'Teams' },
    { id: 'standings', label: 'Standings' },
    { id: 'stats', label: 'Stats' },
    { id: 'playoffs', label: 'Bracket' },
    { id: 'halloffame', label: 'Hall of Fame' },
    { id: 'pickem', label: "Pick'Em" },
  ];
  if (currentUser.role === 'admin') links.push({ id: 'organizer', label: 'Admin' });

  const go = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const accountLabel =
    currentUser.role === 'admin' ? 'Admin' :
    currentUser.role === 'team' ? (currentUser.teamName || 'My Team') :
    'Team Login';

  return (
    <header
      className={`sticky top-0 z-40 bg-[#090909] text-[#f6f4f4] transition-[border-color] duration-300 border-b ${
        scrolled ? 'border-white/10' : 'border-transparent'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-6">
        {/* Wordmark */}
        <button onClick={() => go('overview')} className="flex items-center gap-2.5 shrink-0 group" aria-label="Home">
          <span className="relative w-8 h-8 rounded-full bg-[#ff6a17] flex items-center justify-center">
            <span className="absolute inset-[7px] rounded-full border-2 border-[#090909] border-dashed opacity-70" />
          </span>
          <span className="text-[19px] font-bold tracking-[-0.03em]">
            Ruchi Masters
          </span>
        </button>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => {
            const active = activeTab === l.id;
            return (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`relative px-3.5 py-2 text-[15px] font-medium transition-colors ${
                  active ? 'text-[#f6f4f4]' : 'text-[#f6f4f4]/55 hover:text-[#f6f4f4]'
                }`}
              >
                {l.label}
                {active && <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] bg-[#ff6a17]" />}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            onClick={() => openAuthModal(currentUser.role === 'team' ? currentUser.teamId : undefined)}
            className="px-3 py-2 text-[15px] font-medium text-[#f6f4f4]/70 hover:text-[#f6f4f4] transition-colors max-w-[180px] truncate"
          >
            {accountLabel}
          </button>
          <button onClick={() => go('live')} className="rally-btn rally-btn-primary !h-10 !px-5">
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
        <div className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-[#090909] px-5 pt-4 pb-10 overflow-y-auto border-t border-white/10">
          <div className="flex flex-col">
            {[{ id: 'overview', label: 'Home' }, ...links].map(l => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className={`flex items-center justify-between py-4 border-b border-white/10 text-left text-[28px] font-bold tracking-[-0.03em] ${
                  activeTab === l.id ? 'text-[#ff6a17]' : 'text-[#f6f4f4]'
                }`}
              >
                {l.label}
                <ArrowUpRight className="w-5 h-5 opacity-40" />
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button onClick={() => go('live')} className="rally-btn rally-btn-primary w-full">Live Scores</button>
            <button
              onClick={() => { setMobileOpen(false); openAuthModal(currentUser.role === 'team' ? currentUser.teamId : undefined); }}
              className="rally-btn rally-btn-ghost-light w-full"
            >
              {accountLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
