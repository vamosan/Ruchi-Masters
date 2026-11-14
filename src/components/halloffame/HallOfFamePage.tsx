import React, { useState, useRef, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Crown, 
  Calendar, 
  Award, 
  Users, 
  Flame, 
  Upload, 
  Camera, 
  Video, 
  Plus, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  X, 
  Share2, 
  ExternalLink,
  Zap,
  MapPin,
  Clock,
  Edit3,
  Trash2,
  Lock,
  Radio,
  Move,
  Sliders,
  CheckCheck,
  Play,
  Download,
  Copy,
  FileText,
  Database,
  Medal,
  ArrowUpRight,
  Shield
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { HallOfFameEntry, HallOfFameMedia } from '../../types/cricket';
import { processBannerPhoto } from '../../utils/imageUtils';

export const HallOfFamePage: React.FC = () => {
  const { 
    hallOfFame, 
    addMediaToHallOfFame, 
    updateMediaInHallOfFame,
    deleteMediaFromHallOfFame,
    addHallOfFameEntry, 
    currentUser, 
    teams, 
    openAuthModal 
  } = useTournament();

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return hallOfFame[0]?.year || 2026;
  });

  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [showAddChampionModal, setShowAddChampionModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isEditingYear, setIsEditingYear] = useState(false);
  const [isCurrentActiveSeason, setIsCurrentActiveSeason] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeVideoUrl) setActiveVideoUrl(null);
        if (showAddMediaModal) {
          setShowAddMediaModal(false);
          setEditingMediaId(null);
        }
        if (showAddChampionModal) setShowAddChampionModal(false);
        if (showSyncModal) setShowSyncModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoUrl, showAddMediaModal, showAddChampionModal, showSyncModal]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(hallOfFame, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(hallOfFame, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruchi-masters-hall-of-fame-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? match[1] : null;
  };

  // Media Form State
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  // Interactive Image Repositioning Mode State
  const [isAdjustingImage, setIsAdjustingImage] = useState(false);
  const [tempPosY, setTempPosY] = useState<number>(50);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [newTrophyPhotoPosY, setNewTrophyPhotoPosY] = useState<number>(50);
  const dragStartY = useRef<number>(0);
  const startPosY = useRef<number>(50);

  // New Year Champion State (for Admin or new seasons)
  const [newYear, setNewYear] = useState<number>(2026);
  const [newChampionTeamId, setNewChampionTeamId] = useState(teams[0]?.id || '');
  const [newRunnerUp, setNewRunnerUp] = useState('');
  const [newSecondRunnerUp, setNewSecondRunnerUp] = useState('');
  const [newFinalScore, setNewFinalScore] = useState('');
  const [newMargin, setNewMargin] = useState('');
  const [newVenue, setNewVenue] = useState('Frankfurt Cricket Ground, Germany');
  const [newCaptain, setNewCaptain] = useState('');
  const [newCaptainBio, setNewCaptainBio] = useState('');
  const [newMvp, setNewMvp] = useState('');
  const [newOrangeCap, setNewOrangeCap] = useState('');
  const [newPurpleCap, setNewPurpleCap] = useState('');
  const [newBestWicketKeeper, setNewBestWicketKeeper] = useState('');
  const [newBestFielder, setNewBestFielder] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newTrophyPhoto, setNewTrophyPhoto] = useState('');
  const [newCricHeroesUrl, setNewCricHeroesUrl] = useState('');

  const currentEntry = hallOfFame.find(e => e.year === selectedYear) || hallOfFame[0];

  const handleOpenAddMedia = () => {
    setEditingMediaId(null);
    setMediaType('image');
    setMediaTitle('');
    setMediaUrl('');
    setMediaCaption('');
    setShowAddMediaModal(true);
  };

  const handleOpenEditMedia = (item: HallOfFameMedia) => {
    setEditingMediaId(item.id);
    setMediaType(item.type);
    setMediaTitle(item.title);
    setMediaUrl(item.url);
    setMediaCaption(item.caption || '');
    setShowAddMediaModal(true);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaUrl.trim() || !currentEntry) return;

    if (editingMediaId) {
      updateMediaInHallOfFame(currentEntry.year, editingMediaId, {
        title: mediaTitle.trim(),
        url: mediaUrl.trim(),
        caption: mediaCaption.trim() || undefined,
        type: mediaType
      });
    } else {
      const newMedia: HallOfFameMedia = {
        id: 'med-' + Date.now(),
        title: mediaTitle.trim(),
        url: mediaUrl.trim(),
        caption: mediaCaption.trim() || undefined,
        type: mediaType
      };
      addMediaToHallOfFame(currentEntry.year, newMedia);
    }

    setEditingMediaId(null);
    setMediaTitle('');
    setMediaUrl('');
    setMediaCaption('');
    setShowAddMediaModal(false);
  };

  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const base64 = await processBannerPhoto(file);
      setMediaUrl(base64);
      if (!mediaTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setMediaTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err) {
      console.error('Failed to process image file', err);
      alert('Could not process this image file. Please try another image.');
    }
  };

  const handleStartAdjustImage = () => {
    setTempPosY(currentEntry?.trophyPhotoPosY ?? 50);
    setIsAdjustingImage(true);
  };

  const handleSaveAdjustImage = () => {
    if (!currentEntry) return;
    addHallOfFameEntry({
      ...currentEntry,
      trophyPhotoPosY: tempPosY
    });
    setIsAdjustingImage(false);
  };

  const handleMouseDownImage = (e: React.MouseEvent) => {
    if (!isAdjustingImage) return;
    e.preventDefault();
    setIsDraggingImage(true);
    dragStartY.current = e.clientY;
    startPosY.current = tempPosY;
  };

  const handleMouseMoveImage = (e: React.MouseEvent) => {
    if (!isDraggingImage) return;
    const deltaY = e.clientY - dragStartY.current;
    const newPos = Math.max(0, Math.min(100, Math.round(startPosY.current - (deltaY * 0.3))));
    setTempPosY(newPos);
  };

  const handleMouseUpImage = () => {
    setIsDraggingImage(false);
  };

  const handleTouchStartImage = (e: React.TouchEvent) => {
    if (!isAdjustingImage) return;
    setIsDraggingImage(true);
    dragStartY.current = e.touches[0].clientY;
    startPosY.current = tempPosY;
  };

  const handleTouchMoveImage = (e: React.TouchEvent) => {
    if (!isDraggingImage) return;
    const deltaY = e.touches[0].clientY - dragStartY.current;
    const newPos = Math.max(0, Math.min(100, Math.round(startPosY.current - (deltaY * 0.3))));
    setTempPosY(newPos);
  };

  const handleTouchEndImage = () => {
    setIsDraggingImage(false);
  };

  const handleOpenAddYear = () => {
    setIsEditingYear(false);
    setNewYear(new Date().getFullYear());
    setIsCurrentActiveSeason(false);
    setNewChampionTeamId(teams[0]?.id || '');
    setNewRunnerUp('');
    setNewSecondRunnerUp('');
    setNewFinalScore('');
    setNewMargin('');
    setNewVenue('Frankfurt Cricket Ground, Germany');
    setNewCaptain('');
    setNewCaptainBio('');
    setNewMvp('');
    setNewOrangeCap('');
    setNewPurpleCap('');
    setNewBestWicketKeeper('');
    setNewBestFielder('');
    setNewStory('');
    setNewTrophyPhoto('');
    setNewTrophyPhotoPosY(50);
    setNewCricHeroesUrl('');
    setShowAddChampionModal(true);
  };

  const handleOpenEditYear = (entry: HallOfFameEntry) => {
    setIsEditingYear(true);
    setNewYear(entry.year);
    setIsCurrentActiveSeason(entry.finalScore.includes('In Progress') || entry.margin.includes('In Progress'));
    setNewChampionTeamId(entry.championTeamId);
    setNewRunnerUp(entry.runnerUpTeamName);
    setNewSecondRunnerUp(entry.secondRunnerUpTeamName || '');
    setNewFinalScore(entry.finalScore);
    setNewMargin(entry.margin);
    setNewVenue(entry.venue);
    setNewCaptain(entry.captainName);
    setNewCaptainBio(entry.captainBio || ('Led ' + entry.championTeamName + ' to championship glory in ' + entry.year + '.'));
    setNewMvp(entry.playerOfTheTournament || '');
    setNewOrangeCap(entry.highestRunScorer || '');
    setNewPurpleCap(entry.highestWicketTaker || '');
    setNewBestWicketKeeper(entry.bestWicketKeeper || '');
    setNewBestFielder(entry.bestFielder || '');
    setNewStory(entry.story);
    setNewTrophyPhoto(entry.trophyPhotoUrl);
    setNewTrophyPhotoPosY(entry.trophyPhotoPosY ?? 50);
    setNewCricHeroesUrl(entry.cricHeroesMatchUrl || '');
    setShowAddChampionModal(true);
  };

  const handleAddChampion = (e: React.FormEvent) => {
    e.preventDefault();
    const champTeam = teams.find(t => t.id === newChampionTeamId) || teams[0];

    let entryFinalScore = newFinalScore.trim();
    let entryMargin = newMargin.trim();
    let entryStory = newStory.trim();

    if (isCurrentActiveSeason) {
      if (!entryFinalScore) entryFinalScore = '2026 Championship Tournament In Progress';
      if (!entryMargin) entryMargin = 'Battle for the Cup Underway';
      if (!entryStory) entryStory = 'The ' + newYear + ' edition of Ruchi Masters T20 is currently live with 40 elite franchises battling for the ultimate trophy.';
    } else {
      if (!entryFinalScore) entryFinalScore = champTeam.name + ' won the championship';
      if (!entryMargin) entryMargin = 'Won Grand Final';
      if (!entryStory) entryStory = champTeam.name + ' lifted the ' + newYear + ' Ruchi Masters T20 Championship.';
    }

    const newEntry: HallOfFameEntry = {
      id: 'hof-' + newYear,
      year: Number(newYear),
      editionName: isEditingYear && currentEntry ? currentEntry.editionName : ('Ruchi Masters T20 ' + newYear + ' (5th Edition)'),
      championTeamId: champTeam.id,
      championTeamName: champTeam.name,
      championLogo: champTeam.logo,
      runnerUpTeamName: newRunnerUp.trim() || (isCurrentActiveSeason ? 'Top Contenders' : 'Finalist Squad'),
      secondRunnerUpTeamName: newSecondRunnerUp.trim() || undefined,
      finalScore: entryFinalScore,
      margin: entryMargin,
      venue: newVenue.trim() || 'Apex National Stadium',
      captainName: newCaptain.trim() || champTeam.players.find(p=>p.isCaptain)?.name || champTeam.managerName || 'Captain',
      captainBio: newCaptainBio.trim() || undefined,
      cricHeroesMatchUrl: newCricHeroesUrl.trim() || undefined,
      cricHeroesMatchId: newCricHeroesUrl.trim() ? (newCricHeroesUrl.match(/scorecard\/(\d+)/)?.[1] || undefined) : undefined,
      playerOfTheTournament: newMvp.trim() || undefined,
      highestRunScorer: newOrangeCap.trim() || undefined,
      highestWicketTaker: newPurpleCap.trim() || undefined,
      bestWicketKeeper: newBestWicketKeeper.trim() || undefined,
      bestFielder: newBestFielder.trim() || undefined,
      trophyPhotoUrl: newTrophyPhoto.trim() || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
      trophyPhotoPosY: newTrophyPhotoPosY,
      celebrationBannerUrl: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=1200&q=80',
      story: entryStory,
      media: isEditingYear && currentEntry ? currentEntry.media : []
    };

    addHallOfFameEntry(newEntry);
    setSelectedYear(Number(newYear));
    setShowAddChampionModal(false);
  };

  const handleTrophyPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !currentEntry) return;

    try {
      const base64 = await processBannerPhoto(file);
      addHallOfFameEntry({
        ...currentEntry,
        trophyPhotoUrl: base64
      });
    } catch (err) {
      console.error('Failed to upload trophy photo', err);
      alert('Could not upload this image. Please try another image.');
    }
  };

  const handleSampleImage = (type: 'trophy' | 'presentation' | 'team' | 'celebration' | 'highlights') => {
    if (type === 'trophy') {
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80');
      setMediaTitle('5th Edition Grand Trophy Presentation');
      setMediaCaption('Frankfurt Spartans lifting the 2026 Ruchi Masters 5th Edition Championship Trophy.');
    } else if (type === 'presentation') {
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80');
      setMediaTitle('Presentation Ceremony & Individual Honors');
      setMediaCaption('Chief guests presenting awards to tournament winners, MVP, Orange Cap and Purple Cap champions.');
    } else if (type === 'team') {
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=800&q=80');
      setMediaTitle('Frankfurt Spartans Championship Squad Photo');
      setMediaCaption('Winning squad, team management and support staff celebrating the 2026 title.');
    } else if (type === 'celebration') {
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80');
      setMediaTitle('Victory Celebrations & Fireworks');
      setMediaCaption('Jubilant scenes and victory lap after winning the championship final.');
    } else if (type === 'highlights') {
      setMediaType('video');
      setMediaUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      setMediaTitle('2026 Grand Finale Match Highlights & Moments');
      setMediaCaption('Complete thrilling highlights and key turning points of the final match.');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. Top Editorial Sports Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white p-7 sm:p-10 border border-slate-800 shadow-xl overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Championship Wall of Fame
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-xs font-medium">
              EST. 2022 • FRANKFURT, GERMANY
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-cabinet leading-tight">
            Legacy of <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">Champions</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-2xl leading-relaxed">
            Honoring the dynasties, captains, and unforgettable tournament triumphs of Ruchi Masters T20. Browse past editions, review verified CricHeroes scorecards, and celebrate each championship journey.
          </p>

          {/* Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            
            {/* Primary Add/Crown Year Button */}
            <button
              onClick={handleOpenAddYear}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs tracking-wide shadow-sm hover:shadow transition-all duration-200"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Crown New Champion</span>
            </button>

            {/* Upload Media Button */}
            <button
              onClick={() => {
                if (currentUser.role === 'spectator') {
                  openAuthModal();
                } else {
                  handleOpenAddMedia();
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs tracking-wide backdrop-blur-md transition-all duration-200"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span>Upload Media ({selectedYear})</span>
            </button>

            {/* Sync / Export Updates Button */}
            <button
              onClick={() => setShowSyncModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-semibold text-xs tracking-wide transition-all duration-200"
              title="Backup, export, or sync changes"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Sync & Export</span>
            </button>

          </div>
        </div>
      </div>

      {/* 2. Year Timeline Segmented Navigation (Mobbin-style) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenAddYear}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
            title="Add new championship season"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Season</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 shrink-0" />
        </div>

        {/* Year Segmented Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {hallOfFame.map((entry) => {
            const isSelected = selectedYear === entry.year;
            return (
              <button
                key={entry.year}
                onClick={() => setSelectedYear(entry.year)}
                className={`px-4 py-2 rounded-xl text-xs font-medium shrink-0 flex items-center gap-2.5 transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                }`}
              >
                <span className="text-base">{entry.championLogo}</span>
                <span className="font-cabinet font-bold text-sm">{entry.year}</span>
                <span className={`text-[11px] truncate max-w-[140px] hidden sm:inline ${
                  isSelected ? 'text-amber-300' : 'text-slate-500'
                }`}>
                  {entry.championTeamName}
                </span>
                {isSelected && (
                  <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center pr-2 shrink-0">
          <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {hallOfFame.length} Seasons Archived
          </span>
        </div>
      </div>

      {/* 3. Main Champion Showcase for Selected Year */}
      {currentEntry && (
        <div className="space-y-8">
          
          {/* Official Tournament Podium: 1st, 2nd & 3rd Place (B3X Sports Editorial Style) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Medal className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold tracking-wider uppercase text-slate-900 font-cabinet">
                  Official {currentEntry.year} Championship Podium
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleOpenEditYear(currentEntry)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 text-xs font-medium border border-slate-200/80 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Podium Winners</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* 1st Place - Champion (Gold) */}
              <div 
                onClick={() => handleOpenEditYear(currentEntry)}
                className="relative rounded-2xl p-5 bg-gradient-to-b from-amber-50/80 via-white to-white border border-amber-300/80 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none" />
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-black text-lg border border-amber-300/60 shadow-xs">
                    🥇
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                      Champion
                    </span>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-950 border border-amber-200 flex items-center justify-center shadow-xs transition-colors"
                      title="Edit 1st Place"
                    >
                      <Edit3 className="w-3 h-3 text-amber-700" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">1st Place • Winner</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentEntry.championLogo}</span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors font-cabinet">
                      {currentEntry.championTeamName}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium pt-1">
                    {currentEntry.margin} • <span className="text-slate-900 font-semibold">{currentEntry.finalScore}</span>
                  </p>
                </div>
              </div>

              {/* 2nd Place - Runner Up (Silver) */}
              <div 
                onClick={() => handleOpenEditYear(currentEntry)}
                className="relative rounded-2xl p-5 bg-gradient-to-b from-slate-100/60 via-white to-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/60 text-slate-700 flex items-center justify-center font-black text-lg border border-slate-300/80 shadow-xs">
                    🥈
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                      Finalist
                    </span>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-950 border border-slate-200 flex items-center justify-center shadow-xs transition-colors"
                      title="Edit 2nd Place"
                    >
                      <Edit3 className="w-3 h-3 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">2nd Place • Runner Up</span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors font-cabinet">
                    {currentEntry.runnerUpTeamName}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    Grand Finalists • {currentEntry.venue}
                  </p>
                </div>
              </div>

              {/* 3rd Place - 2nd Runner Up (Bronze) */}
              <div 
                onClick={() => handleOpenEditYear(currentEntry)}
                className="relative rounded-2xl p-5 bg-gradient-to-b from-orange-50/50 via-white to-white border border-orange-200/80 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-200/50 text-amber-800 flex items-center justify-center font-black text-lg border border-orange-300/60 shadow-xs">
                    🥉
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                      Semi-Finalist
                    </span>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-950 border border-orange-200 flex items-center justify-center shadow-xs transition-colors"
                      title="Edit 3rd Place"
                    >
                      <Edit3 className="w-3 h-3 text-amber-800" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">3rd Position • 2nd Runner Up</span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-800 transition-colors font-cabinet">
                    {currentEntry.secondRunnerUpTeamName || 'Tournament Semi-Finalists'}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    Podium Finishers • Ruchi Masters {currentEntry.year}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Champion Banner Photo & Story Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left 2 Columns: Framed High-Res Banner & Match Narrative */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Repositioning Active Floating Control Panel */}
              {isAdjustingImage && (
                <div className="p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                      <Move className="w-4 h-4 text-amber-400" />
                      <span>Drag photo to recenter or adjust position slider below:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveAdjustImage}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Save Position</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAdjustingImage(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 shrink-0">Vertical: {tempPosY}%</span>
                      <input 
                        type="range" 
                        min={0} 
                        max={100} 
                        value={tempPosY}
                        onChange={(e) => setTempPosY(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg" 
                      />
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setTempPosY(15)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${tempPosY <= 25 ? 'bg-amber-400 text-slate-950 font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        Top
                      </button>
                      <button
                        type="button"
                        onClick={() => setTempPosY(50)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${tempPosY > 25 && tempPosY < 75 ? 'bg-amber-400 text-slate-950 font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        Center
                      </button>
                      <button
                        type="button"
                        onClick={() => setTempPosY(85)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${tempPosY >= 75 ? 'bg-amber-400 text-slate-950 font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                      >
                        Bottom
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* High-Resolution Framed Banner */}
              <div 
                className={`relative rounded-2xl overflow-hidden border border-slate-200/90 h-80 sm:h-[420px] bg-slate-950 group shadow-sm select-none ${
                  isAdjustingImage ? 'cursor-grab active:cursor-grabbing ring-2 ring-amber-400' : ''
                }`}
                onMouseDown={handleMouseDownImage}
                onMouseMove={handleMouseMoveImage}
                onMouseUp={handleMouseUpImage}
                onMouseLeave={handleMouseUpImage}
                onTouchStart={handleTouchStartImage}
                onTouchMove={handleTouchMoveImage}
                onTouchEnd={handleTouchEndImage}
              >
                <img 
                  src={currentEntry.trophyPhotoUrl} 
                  alt={currentEntry.championTeamName} 
                  style={{
                    objectPosition: `center ${isAdjustingImage ? tempPosY : (currentEntry.trophyPhotoPosY ?? 50)}%`
                  }}
                  className={`w-full h-full object-cover transition-transform duration-500 opacity-90 pointer-events-none ${
                    isAdjustingImage ? 'scale-105' : 'group-hover:scale-101'
                  }`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {/* Editorial Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />
                
                {/* Banner Caption & Controls */}
                <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                        <Trophy className="w-3.5 h-3.5" />
                        {currentEntry.year} Official Trophy Lift
                      </span>
                      {currentEntry.cricHeroesMatchUrl && (
                        <a
                          href={currentEntry.cricHeroesMatchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-950 text-cyan-300 font-semibold text-[11px] border border-cyan-400/30 inline-flex items-center gap-1 backdrop-blur-md transition-colors"
                        >
                          <span>CricHeroes Verified</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-cabinet text-white">
                      {currentEntry.editionName}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      Venue: {currentEntry.venue} • Final Score: <span className="text-white font-semibold">{currentEntry.finalScore}</span>
                    </p>
                  </div>

                  {/* Floating Circular Action Pill (Mobbin-style) */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto bg-slate-900/80 p-1.5 rounded-full border border-white/15 backdrop-blur-md shadow-lg">
                    <button
                      type="button"
                      onClick={handleStartAdjustImage}
                      title="Drag / Recenter Image"
                      className={`w-8 h-8 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 ${
                        isAdjustingImage 
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-white shadow-md' 
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <Move className="w-4 h-4 text-amber-300" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditYear(currentEntry)}
                      title="Edit Season Details"
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 shadow-md"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <label 
                      title="Change Trophy Image"
                      className="cursor-pointer w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-300 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 shadow-md"
                    >
                      <Camera className="w-4 h-4 text-slate-950" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleTrophyPhotoUpload} 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Championship Winning Journey Story */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-sm text-slate-900 font-cabinet uppercase tracking-wider">
                      Championship Winning Journey
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEditYear(currentEntry)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 className="w-3 h-3 text-amber-600" />
                    <span>Edit Story</span>
                  </button>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {currentEntry.story}
                </p>
              </div>
            </div>

            {/* Right Column: Captain & Individual Accolades */}
            <div className="space-y-5">
              
              {/* Winning Captain Spotlight */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    Winning Captain
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEditYear(currentEntry)}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                    title="Edit Captain"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold font-cabinet text-white">
                    {currentEntry.captainName}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {currentEntry.captainBio || (`Led ${currentEntry.championTeamName} to championship glory in ${currentEntry.year}.`)}
                  </p>
                </div>
              </div>

              {/* Tournament Honors & Accolades (Opta / Broadcast Editorial Style) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-cabinet">
                      Tournament Accolades & Caps
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEditYear(currentEntry)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* MVP */}
                  {currentEntry.playerOfTheTournament && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                      <div className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <span>⭐</span>
                        <span>Player of the Tournament (MVP)</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{currentEntry.playerOfTheTournament}</div>
                    </div>
                  )}

                  {/* Orange Cap */}
                  {currentEntry.highestRunScorer && (
                    <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 space-y-0.5">
                      <div className="text-[10px] text-orange-800 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <span>🏏</span>
                        <span>Orange Cap • Leading Run Scorer</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{currentEntry.highestRunScorer}</div>
                    </div>
                  )}

                  {/* Purple Cap */}
                  {currentEntry.highestWicketTaker && (
                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-0.5">
                      <div className="text-[10px] text-purple-800 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <span>🎯</span>
                        <span>Purple Cap • Leading Wicket Taker</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{currentEntry.highestWicketTaker}</div>
                    </div>
                  )}

                  {/* Best WK */}
                  {currentEntry.bestWicketKeeper && (
                    <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-100 space-y-0.5">
                      <div className="text-[10px] text-cyan-800 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <span>🧤</span>
                        <span>Best Wicket Keeper (WK)</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{currentEntry.bestWicketKeeper}</div>
                    </div>
                  )}

                  {/* Best Fielder */}
                  {currentEntry.bestFielder && (
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-0.5">
                      <div className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <span>🦅</span>
                        <span>Best Fielder</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{currentEntry.bestFielder}</div>
                    </div>
                  )}

                  {currentEntry.cricHeroesMatchUrl && (
                    <div className="pt-2">
                      <a
                        href={currentEntry.cricHeroesMatchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-600 transition-colors"
                      >
                        <span>Full Match Scorecard on CricHeroes</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload CTA Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center mx-auto shadow-xs">
                  <Camera className="w-5 h-5 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">Have media from {currentEntry.year}?</h5>
                  <p className="text-[11px] text-slate-500">Upload high-res team photos or YouTube reels to this gallery.</p>
                </div>
                <button
                  onClick={() => {
                    if (currentUser.role === 'spectator') {
                      openAuthModal();
                    } else {
                      setShowAddMediaModal(true);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  Add Photo / Video Link
                </button>
              </div>

            </div>

          </div>

          {/* 5. Photo & Video Memory Gallery (Mobbin-style Grid) */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-cabinet text-slate-900">
                  {currentEntry.year} Championship Gallery
                </h3>
                <p className="text-xs text-slate-500">
                  Celebration reels, presentation ceremony snapshots, and historic highlights ({currentEntry.media.length} items)
                </p>
              </div>

              <button
                onClick={() => {
                  if (currentUser.role === 'spectator') {
                    openAuthModal();
                  } else {
                    handleOpenAddMedia();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo / Video</span>
              </button>
            </div>

            {currentEntry.media.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 space-y-3">
                <Camera className="w-8 h-8 mx-auto text-slate-400" />
                <div className="font-semibold text-sm text-slate-700">No media uploaded yet for {currentEntry.year}</div>
                <p className="text-xs max-w-sm mx-auto text-slate-500">
                  Upload championship victory celebration photos or YouTube highlight links for this season.
                </p>
                <button
                  onClick={() => {
                    if (currentUser.role === 'spectator') openAuthModal();
                    else handleOpenAddMedia();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-sm"
                >
                  Upload First Memory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEntry.media.map((item) => {
                  const ytId = item.type === 'video' ? getYouTubeId(item.url) : null;
                  return (
                    <div 
                      key={item.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-slate-950 overflow-hidden">
                        {item.type === 'video' ? (
                          ytId ? (
                            <div 
                              onClick={() => {
                                setActiveVideoUrl(item.url);
                                setActiveVideoTitle(item.title);
                              }}
                              className="relative w-full h-full cursor-pointer group/vid overflow-hidden"
                            >
                              <img 
                                src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                                alt={item.title} 
                                className="w-full h-full object-cover group-hover/vid:scale-105 transition-transform duration-500" 
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                              <div className="absolute inset-0 bg-slate-950/40 group-hover/vid:bg-slate-950/20 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-slate-950/80 group-hover/vid:bg-rose-600 text-white flex items-center justify-center shadow-xl border border-white/20 transition-all group-hover/vid:scale-110">
                                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center space-y-2">
                              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shadow-md">
                                <Video className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-xs font-semibold text-slate-200">Video Highlight Reel</span>
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[11px] text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
                              >
                                <span>Open Video Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )
                        ) : (
                          <>
                            <img 
                              src={item.url} 
                              alt={item.title} 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80';
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                          </>
                        )}

                        {/* Top Left Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 rounded-full bg-slate-950/70 text-white text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md border border-white/10">
                            {item.type === 'video' ? '🎬 Video Reel' : '📸 Photo'}
                          </span>
                        </div>

                        {/* Top Right Floating Action Buttons (Mobbin Umbro style) */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditMedia(item);
                            }}
                            title="Edit details"
                            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-center justify-center transition-all hover:scale-105"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Remove "${item.title}" from gallery?`)) {
                                deleteMediaFromHallOfFame(currentEntry.year, item.id);
                              }
                            }}
                            title="Delete media"
                            className="w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-center justify-center transition-all hover:scale-105"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-slate-900 font-cabinet group-hover:text-amber-600 transition-colors line-clamp-1">
                            {item.title}
                          </h4>
                          {item.caption && (
                            <p className="text-xs text-slate-500 font-normal line-clamp-2 leading-relaxed">
                              {item.caption}
                            </p>
                          )}
                        </div>

                        {/* Bottom Row */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditMedia(item);
                            }}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-slate-400" />
                            <span>{item.type === 'video' ? 'Edit Link' : 'Edit Details'}</span>
                          </button>

                          {item.type === 'video' && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveVideoUrl(item.url);
                                setActiveVideoTitle(item.title);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                            >
                              <Play className="w-3 h-3 fill-rose-600 text-rose-600" />
                              <span>Play Reel</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 6. MODAL: UPLOAD / EDIT PHOTO & VIDEO MEMORY */}
      {showAddMediaModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddMediaModal(false);
              setEditingMediaId(null);
            }
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl text-slate-900 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  {editingMediaId ? <Edit3 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-cabinet leading-tight">
                    {editingMediaId ? 'Edit Championship Media' : `Upload ${selectedYear} Media`}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {editingMediaId ? 'Update photo, video reel & caption' : 'Add celebration snapshots & highlights'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowAddMediaModal(false);
                  setEditingMediaId(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMedia} className="p-6 space-y-4">
              
              {/* Media Type Switcher */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    mediaType === 'image' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-amber-600" />
                  <span>Championship Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    mediaType === 'video' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>Video Highlight Reel</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="e.g. Presentation Ceremony & Trophy Lift"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  {mediaType === 'image' ? 'Championship Photo *' : 'Video URL (YouTube Reel / Link) *'}
                </label>

                {mediaType === 'image' ? (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-dashed border-slate-300 flex flex-col sm:flex-row items-center gap-3">
                      {mediaUrl ? (
                        <img 
                          src={mediaUrl} 
                          alt="Preview" 
                          className="w-24 h-16 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-200" 
                        />
                      ) : (
                        <div className="w-24 h-16 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors">
                          <Upload className="w-3.5 h-3.5 text-amber-300" />
                          <span>Choose Image From Device</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleMediaFileUpload} 
                          />
                        </label>
                        <p className="text-[11px] text-slate-500">Auto-compressed & stored locally in your browser storage.</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-500 block mb-1">Or paste image URL:</span>
                      <input
                        type="url"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or image link"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Supports YouTube match highlights, presentation ceremony videos & live streams.
                    </span>
                  </div>
                )}
              </div>

              {/* Sample Preset Buttons for Quick Fill */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Quick Sample Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSampleImage('trophy')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                  >
                    🏆 Trophy Lift
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleImage('presentation')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                  >
                    🎖️ Presentation
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleImage('team')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                  >
                    👥 Squad Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleImage('celebration')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                  >
                    🎆 Celebrations
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleImage('highlights')}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium inline-flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5 fill-rose-600" />
                    <span>YouTube Highlight</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Caption / Details (Optional)
                </label>
                <textarea
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  placeholder="Share details about this memorable presentation or match moment..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-normal bg-slate-50/50 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMediaModal(false);
                    setEditingMediaId(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all"
                >
                  {editingMediaId ? 'Save Updates' : 'Publish Memory'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 7. MODAL: ADD / EDIT CHAMPIONSHIP RECORD & PODIUM */}
      {showAddChampionModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-slate-950/75 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddChampionModal(false);
          }}
        >
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl text-slate-900 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-cabinet leading-tight">
                    {isEditingYear ? (`Edit ${newYear} Championship Record`) : 'Crown New Championship Season'}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Customize podium winners, captain, and leaderboard honors
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowAddChampionModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddChampion} className="p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Year & Season Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Championship Year *
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    min={2020}
                    max={2035}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tournament Status *
                  </label>
                  <div className="flex rounded-xl bg-slate-100 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsCurrentActiveSeason(false)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                        !isCurrentActiveSeason ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      🏆 Crowned
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCurrentActiveSeason(true)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1 transition-all ${
                        isCurrentActiveSeason ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      ⚡ In Progress
                    </button>
                  </div>
                </div>
              </div>

              {/* Champion Team Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  🥇 1st Place (Champion Franchise) *
                </label>
                <select
                  value={newChampionTeamId}
                  onChange={(e) => setNewChampionTeamId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/50 focus:bg-white"
                  required
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.logo} {t.name}</option>
                  ))}
                </select>
              </div>

              {/* Runner Up & 3rd Place */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    🥈 2nd Place (Runner Up) *
                  </label>
                  <input
                    type="text"
                    value={newRunnerUp}
                    onChange={(e) => setNewRunnerUp(e.target.value)}
                    placeholder="e.g. Frankfurt Strikers"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    🥉 3rd Place (2nd Runner Up)
                  </label>
                  <input
                    type="text"
                    value={newSecondRunnerUp}
                    onChange={(e) => setNewSecondRunnerUp(e.target.value)}
                    placeholder="e.g. Darmstadt Dazzlers"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Trophy Photo Upload & Alignment */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  🏆 Championship Trophy / Squad Photo
                </label>
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {newTrophyPhoto ? (
                      <img 
                        src={newTrophyPhoto} 
                        alt="Trophy preview" 
                        style={{ objectPosition: `center ${newTrophyPhotoPosY}%` }}
                        className="w-24 h-16 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-200" 
                      />
                    ) : (
                      <div className="w-24 h-16 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                        <Trophy className="w-6 h-6 text-amber-500" />
                      </div>
                    )}

                    <div className="flex-1 space-y-1.5 w-full">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-300" />
                        <span>Choose Trophy Picture</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;
                            try {
                              const base64 = await processBannerPhoto(file);
                              setNewTrophyPhoto(base64);
                            } catch (err) {
                              console.error('Failed to process trophy photo', err);
                            }
                          }} 
                        />
                      </label>
                      <input
                        type="url"
                        value={newTrophyPhoto}
                        onChange={(e) => setNewTrophyPhoto(e.target.value)}
                        placeholder="Or paste direct image URL (https://...)"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono bg-white"
                      />
                    </div>
                  </div>

                  {/* Vertical alignment controls */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                      <span className="flex items-center gap-1">
                        <Move className="w-3.5 h-3.5 text-amber-600" />
                        <span>Vertical Position Alignment: {newTrophyPhotoPosY}%</span>
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setNewTrophyPhotoPosY(15)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${newTrophyPhotoPosY <= 25 ? 'bg-amber-400 text-slate-950 font-semibold' : 'bg-slate-200 text-slate-700'}`}
                        >
                          Top
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTrophyPhotoPosY(50)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${newTrophyPhotoPosY > 25 && newTrophyPhotoPosY < 75 ? 'bg-amber-400 text-slate-950 font-semibold' : 'bg-slate-200 text-slate-700'}`}
                        >
                          Center
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTrophyPhotoPosY(85)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${newTrophyPhotoPosY >= 75 ? 'bg-amber-400 text-slate-950 font-semibold' : 'bg-slate-200 text-slate-700'}`}
                        >
                          Bottom
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={newTrophyPhotoPosY}
                      onChange={(e) => setNewTrophyPhotoPosY(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Match Score & Venue */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Final Match Scoreline *
                </label>
                <input
                  type="text"
                  value={newFinalScore}
                  onChange={(e) => setNewFinalScore(e.target.value)}
                  placeholder="e.g. 195/4 (19.4 ov) beat 192/7 (20.0 ov)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Victory Margin *
                  </label>
                  <input
                    type="text"
                    value={newMargin}
                    onChange={(e) => setNewMargin(e.target.value)}
                    placeholder="e.g. Won by 6 wickets"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Final Match Venue
                  </label>
                  <input
                    type="text"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    placeholder="e.g. Frankfurt Cricket Ground, Germany"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Winning Captain Details */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Winning Captain Details</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-amber-900 mb-1">
                      Captain Name *
                    </label>
                    <input
                      type="text"
                      value={newCaptain}
                      onChange={(e) => setNewCaptain(e.target.value)}
                      placeholder="e.g. Spartans Captain"
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs font-semibold bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-amber-900 mb-1">
                      Captain Subtitle / Bio
                    </label>
                    <input
                      type="text"
                      value={newCaptainBio}
                      onChange={(e) => setNewCaptainBio(e.target.value)}
                      placeholder="e.g. Led team to championship glory in 2026."
                      className="w-full px-3.5 py-2 rounded-xl border border-amber-300 text-xs font-normal bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Tournament Honors & Leaderboard */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Tournament Honors & Leaderboard</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold uppercase text-slate-700 mb-1">
                      ⭐ Player of the Tournament (MVP)
                    </label>
                    <input
                      type="text"
                      value={newMvp}
                      onChange={(e) => setNewMvp(e.target.value)}
                      placeholder="e.g. Aditya Sharma (340 runs, 12 wkts)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-700 mb-1">
                      🏏 Orange Cap (Top Batsman)
                    </label>
                    <input
                      type="text"
                      value={newOrangeCap}
                      onChange={(e) => setNewOrangeCap(e.target.value)}
                      placeholder="e.g. Rohit Mehra (412 runs)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-700 mb-1">
                      🎯 Purple Cap (Top Bowler)
                    </label>
                    <input
                      type="text"
                      value={newPurpleCap}
                      onChange={(e) => setNewPurpleCap(e.target.value)}
                      placeholder="e.g. Karan Patel (18 wkts)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-700 mb-1">
                      🧤 Best Wicket Keeper (WK)
                    </label>
                    <input
                      type="text"
                      value={newBestWicketKeeper}
                      onChange={(e) => setNewBestWicketKeeper(e.target.value)}
                      placeholder="e.g. Siddharth Rao (15 Dismissals)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-slate-700 mb-1">
                      🦅 Best Fielder
                    </label>
                    <input
                      type="text"
                      value={newBestFielder}
                      onChange={(e) => setNewBestFielder(e.target.value)}
                      placeholder="e.g. Manish Tiwari (11 Catches)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  CricHeroes Match Scorecard URL (Optional)
                </label>
                <input
                  type="url"
                  value={newCricHeroesUrl}
                  onChange={(e) => setNewCricHeroesUrl(e.target.value)}
                  placeholder="https://cricheroes.com/scorecard/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Championship Story & Summary
                </label>
                <textarea
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  placeholder="Brief summary of how the tournament was won..."
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-normal bg-slate-50/50"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddChampionModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-sm transition-all"
                >
                  {isEditingYear ? 'Save Season Updates' : 'Publish Season Record'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 8. MODAL: INTERACTIVE VIDEO PLAYER */}
      {activeVideoUrl && (
        <div 
          className="fixed inset-0 z-[999999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveVideoUrl(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-black rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                  <Play className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold font-cabinet truncate max-w-sm sm:max-w-lg text-white">
                    {activeVideoTitle || 'Championship Match Highlights'}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">OFFICIAL VIDEO REEL</span>
                </div>
              </div>
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full aspect-video bg-black">
              {getYouTubeId(activeVideoUrl) ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(activeVideoUrl)}?autoplay=1&rel=0`}
                  title={activeVideoTitle}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: SYNC & EXPORT GALLERY DATA */}
      {showSyncModal && (
        <div 
          className="fixed inset-0 z-[999999] bg-slate-950/75 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSyncModal(false);
          }}
        >
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl text-slate-900 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-cabinet leading-tight">
                    Sync & Cloud Persistence Manager
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">HALL OF FAME DATA ARCHIVE</span>
                </div>
              </div>

              <button
                onClick={() => setShowSyncModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* Storage Status Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Local IndexedDB & Browser Storage: Active & Protected</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed font-normal">
                  All photos, recentered alignments, video links, and edited honors you submit are stored locally in your browser using IndexedDB. They persist safely across page refreshes and browser restarts.
                </p>
              </div>

              {/* Public Website Sync Note */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span>🌐</span>
                  <span>Publishing Changes to Cloudflare Static CDN</span>
                </div>
                <p className="text-xs leading-relaxed font-normal text-slate-600">
                  Edits made in a browser stay on that device unless committed to the website repository. You can copy the complete JSON or download the backup file below to commit changes live to all spectators.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                      <span>Copied Data to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Hall of Fame JSON</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-slate-200"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Download Backup JSON File</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
