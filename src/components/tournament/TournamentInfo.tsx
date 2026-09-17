import React, { useState } from 'react';
import { 
  Trophy, 
  Megaphone, 
  BookOpen, 
  MapPin, 
  Calendar, 
  Award, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Announcement } from '../../types/cricket';

export const TournamentInfo: React.FC = () => {
  const { tournament, viewMode, addAnnouncement, deleteAnnouncement, setActiveTab } = useTournament();

  const [showAddAnnModal, setShowAddAnnModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Announcement['category']>('Important');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('Tournament Director');
  const [newPinned, setNewPinned] = useState(false);

  const handleAddAnn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addAnnouncement({
      title: newTitle,
      category: newCategory,
      content: newContent,
      author: newAuthor || 'Tournament Admin',
      date: new Date().toISOString().slice(0, 10),
      pinned: newPinned
    });

    setNewTitle('');
    setNewContent('');
    setShowAddAnnModal(false);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Schedule': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'Rule': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Ceremony': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Venue': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    }
  };

  const tournamentPhases = [
    { name: 'Phase 1: Registration & Squad Declaration', status: 'completed', date: 'Sep 01 - Sep 08' },
    { name: 'Phase 2: Group Stage Battles', status: 'current', date: 'Sep 10 - Sep 22' },
    { name: 'Phase 3: Semi-Finals (Top 4 Clash)', status: 'upcoming', date: 'Sep 24 - Sep 25' },
    { name: 'Phase 4: Championship Grand Final & Trophy Gala', status: 'upcoming', date: 'Sep 28' },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Action Navigation Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('fixtures')}
          className="glass-card p-5 rounded-2xl border border-slate-700/80 hover:border-amber-500/60 cursor-pointer transition-all hover:scale-[1.01] group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Match Schedule</span>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300">View Fixtures & Results</h3>
            <p className="text-xs text-slate-400">Check dates, scorecards & results</p>
          </div>
          <Calendar className="w-8 h-8 text-amber-400/60 group-hover:text-amber-400 transition-colors" />
        </div>

        <div 
          onClick={() => setActiveTab('live')}
          className="glass-card p-5 rounded-2xl border border-slate-700/80 hover:border-rose-500/60 cursor-pointer transition-all hover:scale-[1.01] group flex items-center justify-between bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              Live Match Center
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-300">Ball-by-Ball Live Scoring</h3>
            <p className="text-xs text-slate-400">Real-time keypad, commentary & stats</p>
          </div>
          <Trophy className="w-8 h-8 text-rose-400/60 group-hover:text-rose-400 transition-colors" />
        </div>

        <div 
          onClick={() => setActiveTab('standings')}
          className="glass-card p-5 rounded-2xl border border-slate-700/80 hover:border-emerald-500/60 cursor-pointer transition-all hover:scale-[1.01] group flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Points & NRR</span>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300">Live Points Table</h3>
            <p className="text-xs text-slate-400">Net run rates & playoff qualifications</p>
          </div>
          <Award className="w-8 h-8 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" />
        </div>
      </div>

      {/* Tournament Lifecycle & Timeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          Tournament Progression Timeline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tournamentPhases.map((phase, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
                phase.status === 'current' 
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-glow-gold' 
                  : phase.status === 'completed'
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-800/40 border-slate-700/60 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">STAGE 0{idx + 1}</span>
                {phase.status === 'completed' && <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Done</span>}
                {phase.status === 'current' && <span className="text-xs font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full animate-pulse">ACTIVE</span>}
                {phase.status === 'upcoming' && <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Upcoming</span>}
              </div>
              <div className="font-bold text-sm text-white">{phase.name}</div>
              <div className="text-xs text-slate-400">{phase.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Announcements & Certified Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Announcements & Bulletin (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              Tournament Noticeboard & Bulletins
            </h2>
            {viewMode === 'organizer' && (
              <button
                onClick={() => setShowAddAnnModal(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Post Announcement
              </button>
            )}
          </div>

          <div className="space-y-3">
            {tournament.announcements.map((ann) => (
              <div 
                key={ann.id}
                className={`glass-panel p-5 rounded-xl border transition-all ${
                  ann.pinned 
                    ? 'border-amber-500/50 bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {ann.pinned && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                          PINNED
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getCategoryBadgeClass(ann.category)}`}>
                        {ann.category}
                      </span>
                      <span className="text-xs text-slate-400">{ann.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {ann.title}
                    </h3>
                  </div>

                  {viewMode === 'organizer' && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {ann.content}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Issued by: <strong>{ann.author}</strong></span>
                  <span className="text-[11px] text-slate-400">CricMaster Verified Notice</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Rules & Match Playing Conditions (1 col) */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Playing Conditions & Rules
          </h2>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="space-y-3 divide-y divide-slate-800 text-xs">
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Match Format</span>
                <span className="font-bold text-white">{tournament.format} ({tournament.rules.oversPerInnings} Overs)</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Powerplay Overs</span>
                <span className="font-bold text-amber-400">Overs 1 to {tournament.rules.powerplayOvers}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Max Bowler Quota</span>
                <span className="font-bold text-white">{tournament.rules.maxOversPerBowler} Overs max / bowler</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Points for Win</span>
                <span className="font-bold text-emerald-400">+{tournament.rules.pointsForWin} Points</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Points for Tie / No Result</span>
                <span className="font-bold text-sky-400">+{tournament.rules.pointsForTie} Point</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Free Hit on No Ball</span>
                <span className="font-bold text-emerald-400">{tournament.rules.freeHitOnNoBall ? 'Enabled (All front foot NB)' : 'Disabled'}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Super Over for Ties</span>
                <span className="font-bold text-amber-400">{tournament.rules.superOverForTies ? 'Yes (Knockouts & League)' : 'Points Shared'}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-medium">Weather Interruptions</span>
                <span className="font-bold text-white">{tournament.rules.dlsMethodEnabled ? 'ICC DLS / VJD Method' : 'Overs Reduction'}</span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-1 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Certified NRR Regulation
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                If a team is bowled all out before their full quota of overs, Net Run Rate calculation counts their full quota of overs ({tournament.rules.oversPerInnings}.0).
              </p>
            </div>
          </div>

          {/* Venues Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Certified Host Stadiums
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Apex Oval Complex</div>
                  <div className="text-[11px] text-slate-400">Capacity: 45,000 • Finals Ground</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">Pace & Bounce</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Eden Gardens Park</div>
                  <div className="text-[11px] text-slate-400">Capacity: 66,000 • Semi Finals</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold text-[10px]">Spin Friendly</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Wankhede Arena</div>
                  <div className="text-[11px] text-slate-400">Capacity: 33,000 • League Host</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">High Scoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Announcement Modal */}
      {showAddAnnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              Publish New Tournament Announcement
            </h3>

            <form onSubmit={handleAddAnn} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Revision for Match 4"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Schedule">Schedule</option>
                    <option value="Rule">Rule Update</option>
                    <option value="Venue">Venue / Weather</option>
                    <option value="Ceremony">Ceremony & Awards</option>
                    <option value="Important">Important</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Issuer / Author</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Notice Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide complete announcement details, revised timings, venue changes, or award announcements..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinnedCheck"
                  checked={newPinned}
                  onChange={e => setNewPinned(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="pinnedCheck" className="text-slate-300 cursor-pointer select-none">
                  Pin to top of noticeboard
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAnnModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
