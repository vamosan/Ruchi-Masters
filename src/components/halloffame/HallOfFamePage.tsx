import React, { useState, useRef } from 'react';
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
  CheckCheck
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { HallOfFameEntry, HallOfFameMedia } from '../../types/cricket';
import { processBannerPhoto } from '../../utils/imageUtils';

export const HallOfFamePage: React.FC = () => {
  const { 
    hallOfFame, 
    addMediaToHallOfFame, 
    addHallOfFameEntry, 
    currentUser, 
    teams, 
    openAuthModal 
  } = useTournament();

  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return hallOfFame[0]?.year || 2026;
  });

  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [showAddChampionModal, setShowAddChampionModal] = useState(false);
  const [isEditingYear, setIsEditingYear] = useState(false);
  const [isCurrentActiveSeason, setIsCurrentActiveSeason] = useState(false);

  // New Media State
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
  const [newVenue, setNewVenue] = useState('Apex National Stadium');
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

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaUrl.trim() || !currentEntry) return;

    const newMedia: HallOfFameMedia = {
      id: 'med-' + Date.now(),
      title: mediaTitle.trim(),
      url: mediaUrl.trim(),
      caption: mediaCaption.trim() || undefined,
      type: mediaType
    };

    addMediaToHallOfFame(currentEntry.year, newMedia);
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
      if (!entryMargin) entryMargin = '🏆 Battle for the Cup Underway';
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

  // Direct Trophy Photo Upload Handler
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

  const handleSampleImage = (type: 'trophy' | 'team' | 'celebration') => {
    if (type === 'trophy') {
      setMediaUrl('https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80');
      setMediaTitle('Golden Trophy Presentation Ceremony');
      setMediaCaption('Lifting the Championship Trophy on the main podium.');
    } else if (type === 'team') {
      setMediaUrl('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80');
      setMediaTitle('Official Championship Squad Portrait');
      setMediaCaption('Players and coaching staff with the championship banner.');
    } else {
      setMediaUrl('https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80');
      setMediaTitle('Podium Fireworks & Confetti Blast');
      setMediaCaption('Victory celebrations after the final ball.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Top Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border-3 border-slate-950 shadow-[6px_6px_0px_#0f172a] overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#FFE600]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-[#CCFF00]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full bg-[#FFE600] text-slate-950 font-black text-xs sport-badge uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#0f172a]">
              <Trophy className="w-3.5 h-3.5 text-slate-950" />
              Tournament Hall of Fame
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 font-mono text-xs font-bold border border-white/20">
              EST. 2022 - PRESENT
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-cabinet tracking-tight text-white leading-tight">
            Championship <span className="text-[#FFE600] bg-slate-900/80 px-3 py-1 rounded-2xl border border-amber-400/30">Wall of Glory</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed">
            Relive the legacy of Ruchi Masters T20 champions year-wise starting from 2022 to the current active season. Administrators can add/crown new years, and teams can upload certified victory photos and videos.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            
            {/* Primary Add/Crown Year Button */}
            <button
              onClick={handleOpenAddYear}
              className="h-10 px-5 rounded-xl bg-[#FFE600] hover:bg-[#ebd300] text-slate-950 font-black text-xs flex items-center gap-2 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] transition-all"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>➕ Add Year / Crown Champion</span>
            </button>

            {/* Upload Media Button */}
            <button
              onClick={() => {
                if (currentUser.role === 'spectator') {
                  openAuthModal();
                } else {
                  setShowAddMediaModal(true);
                }
              }}
              className="h-10 px-5 rounded-xl bg-[#CCFF00] hover:bg-[#bdf000] text-slate-950 font-black text-xs flex items-center gap-2 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] transition-all"
            >
              <Upload className="w-4 h-4 text-slate-950" />
              <span>Upload Photos & Videos ({selectedYear})</span>
            </button>

          </div>
        </div>
      </div>

      {/* 2. Year Selection Bar with Prominent "➕ Add Year" Button */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        
        {/* Add Year Button directly in Timeline */}
        <button
          onClick={handleOpenAddYear}
          className="h-12 px-5 rounded-2xl bg-[#FFE600] hover:bg-[#ebd300] text-slate-950 font-black text-xs shrink-0 flex items-center gap-2 border-3 border-slate-950 shadow-[3px_3px_0px_#0f172a] hover:scale-105 transition-all"
          title="Add current year or new championship season"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add Year</span>
        </button>

        {/* Year Pills */}
        {hallOfFame.map((entry) => {
          const isSelected = selectedYear === entry.year;
          return (
            <button
              key={entry.year}
              onClick={() => setSelectedYear(entry.year)}
              className={'h-14 px-5 rounded-2xl text-sm font-black shrink-0 flex items-center gap-3 border-3 transition-all ' + (
                isSelected
                  ? 'bg-slate-950 text-white border-slate-950 shadow-[4px_4px_0px_#FFE600] scale-105'
                  : 'bg-white text-slate-800 border-slate-950 hover:bg-amber-50 hover:scale-102 shadow-[2px_2px_0px_#0f172a]'
              )}
            >
              <span className="text-2xl">{entry.championLogo}</span>
              <div className="text-left">
                <div className="font-cabinet leading-none text-base">{entry.year}</div>
                <div className={'text-[11px] font-bold font-cabinet truncate max-w-[170px] ' + (isSelected ? 'text-[#FFE600]' : 'text-slate-600')}>
                  {entry.championTeamName}
                </div>
              </div>
              <Trophy className={'w-4 h-4 ' + (isSelected ? 'text-[#FFE600]' : 'text-amber-500')} />
            </button>
          );
        })}
      </div>

      {/* 3. Main Champion Showcase Card for Selected Year */}
      {currentEntry && (
        <div className="space-y-6">
          
          {/* Main Gold Trophy Presentation Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 sport-card border-3 border-slate-950 shadow-[8px_8px_0px_#0f172a] space-y-6">
            
            {/* Top Ribbon & Podium Summary */}
            <div className="space-y-4 border-b-2 border-slate-200 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-2.5 rounded-2xl bg-amber-100 border-2 border-amber-300 shadow-sm">
                    {currentEntry.championLogo}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                        {currentEntry.year} CHAMPIONS
                      </span>
                      <span className="text-xs text-slate-400 font-bold">📍 {currentEntry.venue}</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black font-cabinet text-slate-950 mt-1">
                      {currentEntry.championTeamName}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  {currentEntry.cricHeroesMatchUrl && (
                    <a
                      href={currentEntry.cricHeroesMatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-2xl bg-[#00F0FF] hover:bg-[#00d8ea] text-slate-950 font-black text-xs sport-btn flex items-center gap-2 border-2 border-slate-950 shadow-[3px_3px_0px_#0f172a] hover:scale-105 transition-all"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                      <span>⚡ CricHeroes Match Scorecard</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  )}

                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-xl inline-block font-mono">
                      {currentEntry.margin}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-1">
                      Score: <strong className="text-slate-800">{currentEntry.finalScore}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Tournament Podium: 1st, 2nd & 3rd Place */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Official Championship Podium</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditYear(currentEntry)}
                    className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-[#FFE600] text-[11px] font-black flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>✏️ Edit Podium Winners</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    onClick={() => handleOpenEditYear(currentEntry)}
                    className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border-2 border-amber-300 flex items-center justify-between gap-2.5 shadow-sm cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl">🥇</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">1st Place • Champion</span>
                        <strong className="text-xs sm:text-sm font-black text-slate-950 truncate block font-cabinet group-hover:text-amber-700">{currentEntry.championTeamName}</strong>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-amber-200/80 text-[10px] font-bold text-amber-900 shrink-0">Edit</span>
                  </div>

                  <div 
                    onClick={() => handleOpenEditYear(currentEntry)}
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border-2 border-slate-300 flex items-center justify-between gap-2.5 shadow-sm cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl">🥈</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 block">2nd Place • Runner Up</span>
                        <strong className="text-xs sm:text-sm font-black text-slate-950 truncate block font-cabinet group-hover:text-slate-700">{currentEntry.runnerUpTeamName}</strong>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-bold text-slate-700 shrink-0">Edit</span>
                  </div>

                  <div 
                    onClick={() => handleOpenEditYear(currentEntry)}
                    className="p-3 rounded-2xl bg-orange-50 hover:bg-orange-100/80 border-2 border-orange-300 flex items-center justify-between gap-2.5 shadow-sm cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl">🥉</span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 block">3rd Position • 2nd Runner Up</span>
                        <strong className="text-xs sm:text-sm font-black text-slate-950 truncate block font-cabinet group-hover:text-orange-700">{currentEntry.secondRunnerUpTeamName || 'Semi-Finalists'}</strong>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-orange-200/80 text-[10px] font-bold text-orange-900 shrink-0">Edit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Champion Banner Photo & Story Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Photo Showcase */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Repositioning Active Floating Bar */}
                {isAdjustingImage && (
                  <div className="p-3 rounded-2xl bg-slate-950 text-white border-2 border-[#FFE600] shadow-xl space-y-2.5 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-black text-[#FFE600]">
                        <Move className="w-4 h-4 animate-bounce" />
                        <span>✋ Drag image up/down to reposition, or use controls:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveAdjustImage}
                          className="px-3 py-1 rounded-xl bg-[#CCFF00] hover:bg-[#b5e600] text-slate-950 text-xs font-black flex items-center gap-1 shadow"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Save Position</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAdjustingImage(false)}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex-1 w-full flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">Alignment: {tempPosY}%</span>
                        <input 
                          type="range" 
                          min={0} 
                          max={100} 
                          value={tempPosY}
                          onChange={(e) => setTempPosY(Number(e.target.value))}
                          className="w-full accent-[#FFE600] cursor-pointer h-2 bg-slate-800 rounded-lg" 
                        />
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setTempPosY(15)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${tempPosY <= 25 ? 'bg-[#FFE600] text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                        >
                          🔝 Top Focus
                        </button>
                        <button
                          type="button"
                          onClick={() => setTempPosY(50)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${tempPosY > 25 && tempPosY < 75 ? 'bg-[#FFE600] text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                        >
                          🎯 Center
                        </button>
                        <button
                          type="button"
                          onClick={() => setTempPosY(85)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${tempPosY >= 75 ? 'bg-[#FFE600] text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                        >
                          🔻 Bottom Focus
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div 
                  className={`relative rounded-3xl overflow-hidden border-3 border-slate-950 h-72 sm:h-96 group shadow-lg bg-slate-950 select-none ${
                    isAdjustingImage ? 'cursor-grab active:cursor-grabbing ring-4 ring-[#FFE600]' : ''
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
                    className={`w-full h-full object-cover transition-transform duration-300 opacity-90 pointer-events-none ${
                      isAdjustingImage ? 'scale-105' : 'group-hover:scale-102'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-[#FFE600] text-slate-950 font-black text-xs sport-badge uppercase tracking-wider inline-flex items-center gap-1.5 shadow">
                          <Trophy className="w-3.5 h-3.5" />
                          {currentEntry.year} Official Trophy Lift
                        </span>
                        {currentEntry.cricHeroesMatchUrl && (
                          <a
                            href={currentEntry.cricHeroesMatchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-0.5 rounded-lg bg-slate-900/90 hover:bg-slate-950 text-[#CCFF00] font-black text-[11px] border border-[#CCFF00]/50 inline-flex items-center gap-1 shadow"
                          >
                            <span>⚡ Verified CricHeroes Match #{currentEntry.cricHeroesMatchId || '27086324'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-black font-cabinet text-white">
                        {currentEntry.editionName}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">
                        Score: {currentEntry.finalScore}
                      </p>
                    </div>

                    {/* Bottom-right Clean Icon Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto bg-slate-950/70 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-xl">
                      <button
                        type="button"
                        onClick={handleStartAdjustImage}
                        title="Drag / Recenter Image"
                        className={`w-8 h-8 rounded-xl border border-white/30 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 ${
                          isAdjustingImage 
                            ? 'bg-[#FFE600] text-slate-950 ring-2 ring-white shadow-md' 
                            : 'bg-slate-900/90 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <Move className="w-4 h-4 text-amber-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditYear(currentEntry)}
                        title="Edit Season Details"
                        className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-[#FFE600] border border-white/30 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-md"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <label 
                        title="Change Image"
                        className="cursor-pointer w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-white/30 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 shadow-md"
                      >
                        <Camera className="w-4 h-4 text-[#CCFF00]" />
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

                {/* Match Story */}
                <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 text-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm font-cabinet text-slate-950 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Championship Winning Story
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleOpenEditYear(currentEntry)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-900 border border-slate-300 text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Edit3 className="w-3 h-3 text-amber-600" />
                      <span>Edit Story</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {currentEntry.story}
                  </p>
                </div>
              </div>

              {/* Tournament Accolades & Captain Card */}
              <div className="space-y-4">
                
                {/* Captain Badge */}
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                      <Crown className="w-4 h-4 text-amber-600" />
                      <span>Winning Captain</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenEditYear(currentEntry)}
                      className="px-2 py-0.5 rounded-lg bg-white/80 hover:bg-white text-slate-900 border border-amber-300 text-[10px] font-black flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Edit3 className="w-2.5 h-2.5 text-amber-600" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="text-lg font-black font-cabinet text-slate-950">
                    {currentEntry.captainName}
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium">
                    {currentEntry.captainBio || ('Led ' + currentEntry.championTeamName + ' to championship glory in ' + currentEntry.year + '.')}
                  </div>
                </div>

                {/* MVP & Honors */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white border-2 border-slate-950 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="text-xs font-black text-[#FFE600] uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#FFE600]" />
                      <span>Tournament Honors</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenEditYear(currentEntry)}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#CCFF00] border border-slate-700 text-[10px] font-black flex items-center gap-1 shadow-sm transition-all"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Edit Honors</span>
                    </button>
                  </div>

                  {currentEntry.playerOfTheTournament && (
                    <div className="border-b border-slate-800 pb-2">
                      <div className="text-[10px] text-slate-400 uppercase font-mono flex items-center gap-1">
                        <span>🌟</span>
                        <span>Player of the Tournament (MVP)</span>
                      </div>
                      <div className="text-sm font-black text-[#00F0FF] mt-0.5">{currentEntry.playerOfTheTournament}</div>
                    </div>
                  )}

                  {currentEntry.highestRunScorer && (
                    <div className="border-b border-slate-800 pb-2">
                      <div className="text-[10px] text-amber-400 uppercase font-mono flex items-center gap-1">
                        <span>🏏</span>
                        <span>Orange Cap (Top Batsman)</span>
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">{currentEntry.highestRunScorer}</div>
                    </div>
                  )}

                  {currentEntry.highestWicketTaker && (
                    <div className="border-b border-slate-800 pb-2">
                      <div className="text-[10px] text-emerald-400 uppercase font-mono flex items-center gap-1">
                        <span>🎯</span>
                        <span>Purple Cap (Top Bowler)</span>
                      </div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">{currentEntry.highestWicketTaker}</div>
                    </div>
                  )}

                  {currentEntry.bestWicketKeeper && (
                    <div className="border-b border-slate-800 pb-2">
                      <div className="text-[10px] text-cyan-400 uppercase font-mono flex items-center gap-1">
                        <span>🧤</span>
                        <span>Best Wicket Keeper (WK)</span>
                      </div>
                      <div className="text-sm font-bold text-cyan-300 mt-0.5">{currentEntry.bestWicketKeeper}</div>
                    </div>
                  )}

                  {currentEntry.bestFielder && (
                    <div className="border-b border-slate-800 pb-2">
                      <div className="text-[10px] text-rose-400 uppercase font-mono flex items-center gap-1">
                        <span>🦅</span>
                        <span>Best Fielder</span>
                      </div>
                      <div className="text-sm font-bold text-rose-300 mt-0.5">{currentEntry.bestFielder}</div>
                    </div>
                  )}

                  {currentEntry.cricHeroesMatchUrl && (
                    <div className="pt-1">
                      <a
                        href={currentEntry.cricHeroesMatchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#CCFF00] hover:underline flex items-center gap-1"
                      >
                        <span>View Ball-by-Ball Timeline on CricHeroes</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Quick Add Media Action */}
                <div className="p-4 rounded-2xl bg-slate-100 border-2 border-slate-300 text-center space-y-2">
                  <div className="text-xs font-bold text-slate-700">Have photos or videos from {currentEntry.year}?</div>
                  <button
                    onClick={() => {
                      if (currentUser.role === 'spectator') {
                        openAuthModal();
                      } else {
                        setShowAddMediaModal(true);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow"
                  >
                    <Camera className="w-4 h-4 text-[#CCFF00]" />
                    <span>Upload Memory to {currentEntry.year}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* 4. Photo & Video Memory Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#00F0FF] text-slate-950 border border-slate-900 shadow-[2px_2px_0px_#0f172a]">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-cabinet text-slate-950">
                    {currentEntry.year} Championship Photo & Video Gallery
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Uploaded celebration reels, podium pictures & historic snapshots</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (currentUser.role === 'spectator') {
                    openAuthModal();
                  } else {
                    setShowAddMediaModal(true);
                  }
                }}
                className="h-9 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs flex items-center gap-1.5 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo / Video</span>
              </button>
            </div>

            {currentEntry.media.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border-3 border-dashed border-slate-300 text-slate-500 space-y-3">
                <Camera className="w-10 h-10 mx-auto text-slate-400" />
                <div className="font-bold text-slate-700">No media uploaded yet for {currentEntry.year}</div>
                <p className="text-xs max-w-sm mx-auto">
                  Be the first to upload championship victory celebration photos or YouTube highlight links for this season!
                </p>
                <button
                  onClick={() => {
                    if (currentUser.role === 'spectator') openAuthModal();
                    else setShowAddMediaModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#CCFF00] text-slate-950 font-black text-xs border-2 border-slate-950 shadow"
                >
                  Upload First Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentEntry.media.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden sport-card border-3 border-slate-950 shadow-[5px_5px_0px_#0f172a] group flex flex-col justify-between"
                  >
                    <div className="relative h-52 bg-slate-950 overflow-hidden">
                      {item.type === 'video' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center space-y-2">
                          <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Video className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-xs font-black text-slate-200">Video Highlight Reel</span>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <span>Open Video Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <>
                          <img 
                            src={item.url} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        </>
                      )}

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/80 text-white font-mono text-[10px] font-black border border-white/20">
                          {item.type === 'video' ? '🎬 VIDEO' : '📸 PHOTO'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h4 className="font-black text-sm font-cabinet text-slate-950 leading-tight group-hover:text-amber-600 transition-colors">
                        {item.title}
                      </h4>
                      {item.caption && (
                        <p className="text-xs text-slate-600 font-medium line-clamp-2">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 5. MODAL: UPLOAD PHOTO / VIDEO MEMORY */}
      {showAddMediaModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddMediaModal(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-3 border-slate-950 shadow-[10px_10px_0px_#0f172a] text-slate-900 overflow-hidden my-auto">
            
            {/* Header */}
            <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#CCFF00] text-slate-950 border border-slate-900">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black font-cabinet leading-tight">
                    Upload {selectedYear} Championship Media
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">HALL OF FAME ARCHIVE</span>
                </div>
              </div>

              <button
                onClick={() => setShowAddMediaModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 text-white flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleAddMedia} className="p-5 space-y-4">
              
              {/* Media Type Switcher */}
              <div className="flex rounded-xl border-2 border-slate-900 bg-slate-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={'flex-1 py-1.5 rounded-lg font-black flex items-center justify-center gap-1.5 transition-all ' + (
                    mediaType === 'image' ? 'bg-white text-slate-950 shadow' : 'text-slate-600'
                  )}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Championship Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={'flex-1 py-1.5 rounded-lg font-black flex items-center justify-center gap-1.5 transition-all ' + (
                    mediaType === 'video' ? 'bg-white text-slate-950 shadow' : 'text-slate-600'
                  )}
                >
                  <Video className="w-3.5 h-3.5 text-rose-500" />
                  <span>Video Highlight Link</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Memory Title *
                </label>
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="e.g. Trophy Lift Celebration with Fireworks"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  {mediaType === 'image' ? 'Championship Photo *' : 'Video URL (YouTube / MP4) *'}
                </label>

                {mediaType === 'image' ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col sm:flex-row items-center gap-3">
                      {mediaUrl ? (
                        <img 
                          src={mediaUrl} 
                          alt="Preview" 
                          className="w-24 h-16 rounded-xl object-cover border-2 border-slate-900 shadow-sm shrink-0 bg-slate-200" 
                        />
                      ) : (
                        <div className="w-24 h-16 rounded-xl bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-[#CCFF00] text-xs font-black border border-slate-900 shadow-sm transition-transform hover:scale-105">
                          <Upload className="w-3.5 h-3.5" />
                          <span>📁 Pick Image From Device</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleMediaFileUpload} 
                          />
                        </label>
                        <p className="text-[10px] text-slate-500 font-medium">Supports JPG, PNG, WEBP. Auto-compressed for high speed.</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block mb-1">Or paste direct image URL:</span>
                      <input
                        type="url"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or https://..."
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-mono bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://youtube.com/... or https://..."
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-mono bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
                    required
                  />
                )}
              </div>

              {/* Sample Preset Buttons for Quick Demo */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block">⚡ Quick Sample Fill:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSampleImage('trophy')}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-bold"
                  >
                    🏆 Trophy Lift
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleImage('team')}
                    className="px-2.5 py-1 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-950 text-[10px] font-bold"
                  >
                    👥 Squad Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSampleImage('celebration')}
                    className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-950 text-[10px] font-bold"
                  >
                    🎆 Confetti Blast
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Caption / Story (Optional)
                </label>
                <textarea
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                  placeholder="Share details about this memorable moment from the final match..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="px-4 py-2 rounded-xl border-2 border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#CCFF00] hover:bg-[#bdf000] text-slate-950 text-xs font-black border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a]"
                >
                  Save & Publish Memory
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. MODAL: ADD NEW SEASON CHAMPION (ADMIN ONLY) */}
      {showAddChampionModal && (
        <div 
          className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddChampionModal(false);
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-3 border-slate-950 shadow-[10px_10px_0px_#0f172a] text-slate-900 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            
            <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between border-b-2 border-slate-900 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FFE600] text-slate-950 border border-slate-900">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black font-cabinet leading-tight">
                    {isEditingYear ? ('Edit ' + newYear + ' Championship Record') : 'Add / Crown Championship Year'}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">ADMIN MASTER CONTROLS</span>
                </div>
              </div>

              <button
                onClick={() => setShowAddChampionModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600 text-white flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddChampion} className="p-5 space-y-4 overflow-y-auto flex-1">
              
              {/* Year Number & Season Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Championship Year (e.g. 2026) *
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    min={2020}
                    max={2035}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-900 text-sm font-mono font-bold bg-slate-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Season Status *
                  </label>
                  <div className="flex rounded-xl border-2 border-slate-900 bg-slate-100 p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsCurrentActiveSeason(false)}
                      className={'flex-1 py-1.5 rounded-lg font-black flex items-center justify-center gap-1 ' + (
                        !isCurrentActiveSeason ? 'bg-white text-slate-950 shadow' : 'text-slate-600'
                      )}
                    >
                      🏆 Crowned Winner
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCurrentActiveSeason(true)}
                      className={'flex-1 py-1.5 rounded-lg font-black flex items-center justify-center gap-1 ' + (
                        isCurrentActiveSeason ? 'bg-[#CCFF00] text-slate-950 shadow' : 'text-slate-600'
                      )}
                    >
                      ⚡ Active Season
                    </button>
                  </div>
                </div>
              </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Champion Franchise *
                  </label>
                  <select
                    value={newChampionTeamId}
                    onChange={(e) => setNewChampionTeamId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold bg-slate-50"
                    required
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.logo} {t.name}</option>
                    ))}
                  </select>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    🥈 Runner Up Team *
                  </label>
                  <input
                    type="text"
                    value={newRunnerUp}
                    onChange={(e) => setNewRunnerUp(e.target.value)}
                    placeholder="e.g. Frankfurt Strikers"
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold bg-slate-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    🥉 3rd Position Winner (Optional)
                  </label>
                  <input
                    type="text"
                    value={newSecondRunnerUp}
                    onChange={(e) => setNewSecondRunnerUp(e.target.value)}
                    placeholder="e.g. Darmstadt Dazzlers"
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  🏆 Championship Trophy / Squad Photo
                </label>
                <div className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-300 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {newTrophyPhoto ? (
                      <img 
                        src={newTrophyPhoto} 
                        alt="Trophy preview" 
                        style={{ objectPosition: `center ${newTrophyPhotoPosY}%` }}
                        className="w-24 h-16 rounded-xl object-cover border-2 border-slate-900 shadow-sm shrink-0 bg-slate-200" 
                      />
                    ) : (
                      <div className="w-24 h-16 rounded-xl bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                        <Trophy className="w-6 h-6 text-amber-500" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5 w-full">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-[#FFE600] text-xs font-black border border-slate-900 shadow-sm transition-transform hover:scale-105">
                        <Upload className="w-3.5 h-3.5" />
                        <span>📁 Pick Image From Device</span>
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
                        className="w-full px-3 py-1.5 rounded-xl border-2 border-slate-900 text-[11px] font-mono bg-white"
                      />
                    </div>
                  </div>

                  {/* Vertical alignment slider & presets */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Move className="w-3 h-3 text-amber-600" />
                        <span>Vertical Alignment / Center: {newTrophyPhotoPosY}%</span>
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setNewTrophyPhotoPosY(15)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${newTrophyPhotoPosY <= 25 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}
                        >
                          🔝 Top
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTrophyPhotoPosY(50)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${newTrophyPhotoPosY > 25 && newTrophyPhotoPosY < 75 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}
                        >
                          🎯 Center
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTrophyPhotoPosY(85)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${newTrophyPhotoPosY >= 75 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'}`}
                        >
                          🔻 Bottom
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

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Final Match Scoreline *
                </label>
                <input
                  type="text"
                  value={newFinalScore}
                  onChange={(e) => setNewFinalScore(e.target.value)}
                  placeholder="e.g. 195/4 (19.4 ov) beat 192/7 (20.0 ov)"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Victory Margin *
                  </label>
                  <input
                    type="text"
                    value={newMargin}
                    onChange={(e) => setNewMargin(e.target.value)}
                    placeholder="e.g. Won by 6 wickets"
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold bg-slate-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Final Match Venue
                  </label>
                  <input
                    type="text"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    placeholder="e.g. Apex National Arena"
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold bg-slate-50"
                  />
                </div>
              </div>

              {/* Winning Captain Details */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Winning Captain Details</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-amber-900 mb-1">
                      Captain Name *
                    </label>
                    <input
                      type="text"
                      value={newCaptain}
                      onChange={(e) => setNewCaptain(e.target.value)}
                      placeholder="e.g. Spartans Captain"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-amber-300 text-xs font-bold bg-white text-slate-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-amber-900 mb-1">
                      Captain Subtitle / Bio
                    </label>
                    <input
                      type="text"
                      value={newCaptainBio}
                      onChange={(e) => setNewCaptainBio(e.target.value)}
                      placeholder="e.g. Led team to championship glory in 2026."
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-amber-300 text-xs font-medium bg-white text-slate-950"
                    />
                  </div>
                </div>
              </div>

              {/* Tournament Leaderboard & Honors */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border-2 border-slate-950 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-[#FFE600] uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Tournament Honors & Leaderboard</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black uppercase text-[#00F0FF] mb-1">
                      🌟 Player of the Tournament (MVP)
                    </label>
                    <input
                      type="text"
                      value={newMvp}
                      onChange={(e) => setNewMvp(e.target.value)}
                      placeholder="e.g. Aditya Sharma (Frankfurt Spartans - 340 runs, 12 wkts)"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-700 text-xs font-bold bg-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-amber-400 mb-1">
                      🏏 Orange Cap (Top Batsman / Runs)
                    </label>
                    <input
                      type="text"
                      value={newOrangeCap}
                      onChange={(e) => setNewOrangeCap(e.target.value)}
                      placeholder="e.g. Rohit Mehra (412 runs)"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-700 text-xs font-bold bg-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-emerald-400 mb-1">
                      🎯 Purple Cap (Top Bowler / Wickets)
                    </label>
                    <input
                      type="text"
                      value={newPurpleCap}
                      onChange={(e) => setNewPurpleCap(e.target.value)}
                      placeholder="e.g. Karan Patel (18 wkts)"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-700 text-xs font-bold bg-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-cyan-400 mb-1">
                      🧤 Best Wicket Keeper (WK)
                    </label>
                    <input
                      type="text"
                      value={newBestWicketKeeper}
                      onChange={(e) => setNewBestWicketKeeper(e.target.value)}
                      placeholder="e.g. Siddharth Rao (15 Dismissals)"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-700 text-xs font-bold bg-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-rose-400 mb-1">
                      🦅 Best Fielder (Catches & Run-outs)
                    </label>
                    <input
                      type="text"
                      value={newBestFielder}
                      onChange={(e) => setNewBestFielder(e.target.value)}
                      placeholder="e.g. Manish Tiwari (11 Catches, 4 Run-outs)"
                      className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-700 text-xs font-bold bg-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  ⚡ CricHeroes Match Scorecard URL (Optional)
                </label>
                <input
                  type="url"
                  value={newCricHeroesUrl}
                  onChange={(e) => setNewCricHeroesUrl(e.target.value)}
                  placeholder="https://cricheroes.com/scorecard/..."
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-bold bg-slate-50 text-indigo-900"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Championship Story & Summary
                </label>
                <textarea
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  placeholder="Brief summary of how the tournament was won..."
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-900 text-xs font-medium bg-slate-50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChampionModal(false)}
                  className="px-4 py-2 rounded-xl border-2 border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FFE600] hover:bg-[#ebd300] text-slate-950 text-xs font-black border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a]"
                >
                  {isEditingYear ? 'Save Changes to Hall of Fame' : 'Publish Year to Hall of Fame'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
