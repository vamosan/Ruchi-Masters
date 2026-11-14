import React from 'react';
import { ArrowUpRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

/**
 * Compact Pro League Footer
 */
export const Footer: React.FC = () => {
  const { tournament, teams, setActiveTab, openAuthModal } = useTournament();

  const go = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b0f19] text-slate-300 mt-10 border-t border-slate-800">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/10">
          {/* Brand & Title Sponsor */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff6a17] to-amber-500 flex items-center justify-center text-white text-sm font-black">
                🏏
              </div>
              <span className="text-[18px] font-black tracking-tight text-white">
                Ruchi Masters T20
              </span>
            </div>
            <p className="text-[13px] text-slate-400 max-w-sm leading-relaxed">
              Official Frankfurt T20 Cricket Championship Hub — {teams.length} clubs, live ball-by-ball scorecards, ICC Net Run Rate tables, and multi-season Hall of Fame.
            </p>
            <div className="inline-flex items-center gap-2.5 pt-1">
              <div className="bg-white px-2 py-1 rounded">
                <img src="/images/ruchi-sponsor.png" alt="Ruchi Restaurant" className="h-4 object-contain" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Title Sponsor &amp; Hospitality Partner
              </span>
            </div>
          </div>

          {/* Competition */}
          <div className="md:col-span-2 space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Competition
            </div>
            <ul className="space-y-1.5 text-[13px] font-semibold">
              <li>
                <button onClick={() => go('overview')} className="hover:text-[#ff6a17] transition-colors cursor-pointer">
                  Match Center
                </button>
              </li>
              <li>
                <button onClick={() => go('fixtures')} className="hover:text-[#ff6a17] transition-colors cursor-pointer">
                  Fixtures &amp; Results
                </button>
              </li>
              <li>
                <button onClick={() => go('teams')} className="hover:text-[#ff6a17] transition-colors cursor-pointer">
                  Teams ({teams.length})
                </button>
              </li>
              <li>
                <button onClick={() => go('standings')} className="hover:text-[#ff6a17] transition-colors cursor-pointer">
                  Standings &amp; NRR
                </button>
              </li>
            </ul>
          </div>

          {/* Honours & Stats */}
          <div className="md:col-span-2 space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Honours &amp; Live
            </div>
            <ul className="space-y-1.5 text-[13px] font-semibold">
              <li>
                <button onClick={() => go('halloffame')} className="hover:text-[#ff6a17] transition-colors cursor-pointer">
                  Hall of Fame (2022–26)
                </button>
              </li>
              <li>
                <button onClick={() => go('stats')} className="hover:text-[#ff6a17] transition-colors cursor-pointer">
                  Orange &amp; Purple Caps
                </button>
              </li>
              <li>
                <button onClick={() => go('playoffs')} className="hover:text-[#ff6a17] transition-colors cursor-pointer">
                  Finals Bracket
                </button>
              </li>
              <li>
                <button onClick={() => go('live')} className="hover:text-[#ff6a17] transition-colors cursor-pointer">
                  Live Scoring Console
                </button>
              </li>
            </ul>
          </div>

          {/* Club Management */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Team Captains &amp; Admin
            </div>
            <ul className="space-y-2 text-[13px] font-semibold">
              <li>
                <button
                  onClick={() => openAuthModal()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#ff6a17] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Captain / Admin Login</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button onClick={() => go('social')} className="hover:text-[#ff6a17] transition-colors cursor-pointer">
                  Social Matchday Poster Studio
                </button>
              </li>
              <li className="text-slate-500 text-[12px]">
                {tournament.organizerEmail || 'contact@ruchimasters.com'}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-slate-500">
          <div>© {new Date().getFullYear()} Ruchi Masters T20 · Frankfurt, Germany</div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>ICC Net Run Rate &amp; Playing Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
