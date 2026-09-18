import React from 'react';
import { Shield, Mail, Phone, Award, Sparkles } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export const Footer: React.FC = () => {
  const { tournament } = useTournament();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Sponsors Showcase Bar */}
        <div className="space-y-4">
          <div className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Tournament Partners & Sponsors
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Main Title Sponsor Card */}
            <div className="bg-slate-900 border-2 border-slate-800 hover:border-amber-400/50 px-5 py-2.5 rounded-2xl flex items-center gap-3 transition-colors shadow-lg">
              <div className="bg-white px-2 py-1 rounded-lg">
                <img src="/images/ruchi-sponsor.png" alt="Ruchi Sponsor" className="h-6 object-contain" />
              </div>
              <div className="text-left">
                <div className="text-white font-black text-xs font-cabinet">Ruchi Restaurant & Catering</div>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Grand Title Sponsor & Hospitality Partner</div>
              </div>
            </div>

            {tournament.sponsors.map(sponsor => (
              <div 
                key={sponsor.id} 
                className="bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-300 hover:border-slate-700 transition-colors"
              >
                <span className="text-lg">{sponsor.logo}</span>
                <div>
                  <div className="text-white">{sponsor.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">{sponsor.tier} Partner</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏏</span>
            <span className="text-slate-200 font-bold">CricMaster Pro</span>
            <span className="text-slate-500">•</span>
            <span>Comprehensive Cricket Tournament Management Engine</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{tournament.organizerEmail}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{tournament.organizerContact}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>ICC Match Playing Conditions Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
