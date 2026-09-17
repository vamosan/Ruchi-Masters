import React, { useState } from 'react';
import { Trophy, Settings, X, Save, AlertCircle } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Tournament, MatchFormat } from '../../types/cricket';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TournamentWizardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { tournament, updateTournament } = useTournament();

  const [formData, setFormData] = useState<Tournament>({ ...tournament });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTournament(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Configure Tournament Parameters</h2>
              <p className="text-xs text-slate-400">Rules, format, dates, overs quota and scoring options</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Basic Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">1. General Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tournament Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Edition / Season</label>
                <input
                  type="text"
                  value={formData.edition}
                  onChange={e => setFormData({ ...formData, edition: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Tagline & Summary</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Match Format</label>
                <select
                  value={formData.format}
                  onChange={e => {
                    const fmt = e.target.value as MatchFormat;
                    let overs = 20;
                    let maxBowler = 4;
                    let pp = 6;
                    if (fmt === 'T10') { overs = 10; maxBowler = 2; pp = 3; }
                    else if (fmt === 'ODI_50') { overs = 50; maxBowler = 10; pp = 10; }
                    else if (fmt === 'HUNDRED') { overs = 20; maxBowler = 4; pp = 5; }
                    else if (fmt === 'BOX_CRICKET') { overs = 8; maxBowler = 2; pp = 2; }
                    
                    setFormData({
                      ...formData,
                      format: fmt,
                      rules: {
                        ...formData.rules,
                        oversPerInnings: overs,
                        maxOversPerBowler: maxBowler,
                        powerplayOvers: pp,
                      }
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="T20">T20 (20 Overs)</option>
                  <option value="T10">T10 (10 Overs)</option>
                  <option value="ODI_50">ODI (50 Overs)</option>
                  <option value="HUNDRED">The Hundred</option>
                  <option value="BOX_CRICKET">Box Cricket (8 Overs)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Primary Host Venue / Complex</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Playing Rules */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">2. Match Playing Rules & Points Formula</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Overs / Innings</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={formData.rules.oversPerInnings}
                  onChange={e => setFormData({
                    ...formData,
                    rules: { ...formData.rules, oversPerInnings: parseInt(e.target.value, 10) || 20 }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Max Overs / Bowler</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.rules.maxOversPerBowler}
                  onChange={e => setFormData({
                    ...formData,
                    rules: { ...formData.rules, maxOversPerBowler: parseInt(e.target.value, 10) || 4 }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Powerplay Overs</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={formData.rules.powerplayOvers}
                  onChange={e => setFormData({
                    ...formData,
                    rules: { ...formData.rules, powerplayOvers: parseInt(e.target.value, 10) || 6 }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Pts for Win</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.rules.pointsForWin}
                  onChange={e => setFormData({
                    ...formData,
                    rules: { ...formData.rules, pointsForWin: parseInt(e.target.value, 10) || 2 }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rules.freeHitOnNoBall}
                  onChange={e => setFormData({
                    ...formData,
                    rules: { ...formData.rules, freeHitOnNoBall: e.target.checked }
                  })}
                  className="rounded text-amber-500 bg-slate-900 border-slate-700"
                />
                <span className="text-slate-300">Free Hit on No Ball</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rules.superOverForTies}
                  onChange={e => setFormData({
                    ...formData,
                    rules: { ...formData.rules, superOverForTies: e.target.checked }
                  })}
                  className="rounded text-amber-500 bg-slate-900 border-slate-700"
                />
                <span className="text-slate-300">Super Over for Ties</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rules.dlsMethodEnabled}
                  onChange={e => setFormData({
                    ...formData,
                    rules: { ...formData.rules, dlsMethodEnabled: e.target.checked }
                  })}
                  className="rounded text-amber-500 bg-slate-900 border-slate-700"
                />
                <span className="text-slate-300">DLS Rain Calculation</span>
              </label>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="font-bold text-sky-400 uppercase tracking-wider text-[11px]">3. Organizer Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Organizing Body</label>
                <input
                  type="text"
                  value={formData.organizerName}
                  onChange={e => setFormData({ ...formData, organizerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.organizerEmail}
                  onChange={e => setFormData({ ...formData, organizerEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.organizerContact}
                  onChange={e => setFormData({ ...formData, organizerContact: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Tournament Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
