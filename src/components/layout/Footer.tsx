import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

/**
 * Rally-style pre-footer CTA + editorial multi-column footer.
 */
export const Footer: React.FC = () => {
  const { tournament, teams, setActiveTab, openAuthModal, currentUser } = useTournament();

  const go = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#090909] text-[#f6f4f4] mt-10">
      {/* Pre-Footer Big Editorial CTA ("Ready to Get in the Game?") */}
      <div className="border-b border-white/12">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-12 sm:py-16 text-center flex flex-col items-center">
          <span className="rally-eyebrow text-[#ff6a17]">
            Season 05 Invitational — Frankfurt
          </span>
          <h2 className="rally-display mt-3 text-[36px] sm:text-[56px] lg:text-[72px] max-w-[14ch] text-[#f6f4f4]">
            Ready to get in the game?
          </h2>
          <p className="mt-3 text-[15px] text-[#f6f4f4]/65 max-w-md leading-relaxed">
            {teams.length} clubs. 20 overs. One pitch that decides it all.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => go('fixtures')} className="rally-btn rally-btn-primary">
              View Schedule
            </button>
            <button
              onClick={() => (currentUser.role === 'spectator' ? openAuthModal() : go('teams'))}
              className="rally-btn rally-btn-ghost-light"
            >
              {currentUser.role === 'spectator' ? 'Captain Login' : 'Manage Your Squad'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/12">
          {/* Brand column */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <span className="relative w-7 h-7 rounded-full bg-[#ff6a17] flex items-center justify-center">
                <span className="absolute inset-[6px] rounded-full border-2 border-[#090909] border-dashed opacity-70" />
              </span>
              <span className="text-[19px] font-bold tracking-[-0.03em]">Ruchi Masters</span>
            </div>
            <p className="text-[15px] text-[#f6f4f4]/55 max-w-xs leading-relaxed">
              Season 05 Invitational — Frankfurt, Germany. Presented by Ruchi Restaurant &amp; Catering.
            </p>
            <div className="inline-flex items-center gap-3 pt-1">
              <div className="bg-white px-2.5 py-1 rounded-[4px]">
                <img src="/images/ruchi-sponsor.png" alt="Ruchi Restaurant" className="h-5 object-contain" />
              </div>
              <span className="text-[12px] uppercase tracking-wider text-[#f6f4f4]/50">
                Title Sponsor
              </span>
            </div>
          </div>

          {/* Event links */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[12px] uppercase tracking-wider text-[#f6f4f4]/40 font-medium">
              Event
            </div>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <button onClick={() => go('fixtures')} className="text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors">
                  Schedule
                </button>
              </li>
              <li>
                <button onClick={() => go('teams')} className="text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors">
                  Teams ({teams.length})
                </button>
              </li>
              <li>
                <button onClick={() => go('playoffs')} className="text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors">
                  Bracket
                </button>
              </li>
              <li>
                <button onClick={() => go('standings')} className="text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors">
                  Standings
                </button>
              </li>
            </ul>
          </div>

          {/* Follow / Archive */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[12px] uppercase tracking-wider text-[#f6f4f4]/40 font-medium">
              Archive
            </div>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <button onClick={() => go('halloffame')} className="text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors">
                  Hall of Fame
                </button>
              </li>
              <li>
                <button onClick={() => go('stats')} className="text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors">
                  Stats &amp; Caps
                </button>
              </li>
              <li>
                <button onClick={() => go('live')} className="text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors">
                  Live Scores
                </button>
              </li>
              <li>
                <button onClick={() => go('pickem')} className="text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors">
                  Matchday Pick&apos;Em
                </button>
              </li>
            </ul>
          </div>

          {/* Club / Partner */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[12px] uppercase tracking-wider text-[#f6f4f4]/40 font-medium">
              Captains &amp; Press
            </div>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <button
                  onClick={() => openAuthModal()}
                  className="inline-flex items-center gap-1 text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors"
                >
                  Captain / Admin Login <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button onClick={() => go('social')} className="text-[#f6f4f4]/75 hover:text-[#ff6a17] transition-colors">
                  Social Poster Studio
                </button>
              </li>
              <li className="text-[#f6f4f4]/50 text-[14px] pt-1">
                {tournament.organizerEmail || 'contact@ruchimasters.com'}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Giant Wordmark */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-[#f6f4f4]/45">
          <div>© {new Date().getFullYear()} Ruchi Masters T20. All rights reserved.</div>
          <div>Frankfurt Cricket Ground · ICC Playing Conditions</div>
        </div>
      </div>
    </footer>
  );
};
