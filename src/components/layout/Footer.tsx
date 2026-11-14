import React from 'react';
import { Shield, Mail, Phone, Award, Sparkles, Heart } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export const Footer: React.FC = () => {
  const { tournament } = useTournament();

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Sponsors Showcase Bar */}
        <div className="space-y-4">
          <div className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2">
            <span>Official Tournament Partners & Hospitality</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Title Sponsor Card */}
            <div className="bg-slate-900 border border-slate-800 hover:border-amber-400/50 px-5 py-3 rounded-2xl flex items-center gap-3 transition-colors shadow-xs">
              <div className="bg-white px-2 py-1 rounded-lg">
                <img src="/images/ruchi-sponsor.png" alt="Ruchi Restaurant" className="h-6 object-contain" />
              </div>
              <div className="text-left">
                <div className="text-white font-bold text-xs font-cabinet">Ruchi Restaurant & Catering</div>
                <div className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">Grand Title Sponsor & Hospitality Partner</div>
              </div>
            </div>

            {tournament.sponsors.map(sponsor => (
              <div 
                key={sponsor.id} 
                className="bg-slate-900/60 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-medium text-slate-300 hover:border-slate-700 transition-colors"
              >
                <span className="text-base">{sponsor.logo}</span>
                <div>
                  <div className="text-white font-semibold">{sponsor.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{sponsor.tier} Partner</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Details Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <span className="text-base">🏏</span>
            <span className="text-white font-bold font-cabinet">Ruchi Masters T20</span>
            <span className="text-slate-600">•</span>
            <span>Frankfurt Cricket Ground, Germany</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{tournament.organizerEmail || 'contact@ruchimasters.com'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>ICC Net Run Rate & Playing Conditions Compliant</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
