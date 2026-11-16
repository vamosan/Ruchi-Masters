import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Flame, CheckCircle2, Camera, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { TeamSocialPost } from '../../types/cricket';
import { parseInstagramUrl, normalizeExternalUrl } from '../../utils/socialMedia';

interface PollState {
  matchVote?: 'A' | 'B';
  matchVotesA: number;
  matchVotesB: number;
  groupVote?: string;
  groupVotes: Record<string, number>;
  winnerVote?: string;
  winnerVotes: Record<string, number>;
  mvpVote?: string;
  mvpVotes: Record<string, number>;
}

const POLL_STORAGE_KEY = 'ruchi_masters_club_polls_v2';

const DEFAULT_POLL_STATE: PollState = {
  matchVotesA: 142,
  matchVotesB: 118,
  groupVotes: {
    'Group A': 94,
    'Group B': 112,
    'Group C': 78,
    'Group D': 86,
  },
  winnerVotes: {
    'Frankfurt Spartans': 128,
    'Frankfurt Strikers': 96,
    'TSGN Titans': 84,
    'FC KVM Warriors': 72,
  },
  mvpVotes: {
    'Anirudh Rao': 114,
    'Vpk': 98,
    'Md Tazmim Hossain': 89,
    'Rhythm Chauhan': 69,
  },
};

export const ClubEngagementZone: React.FC = () => {
  const { tournament, hallOfFame, updateTournament, isAdmin, setActiveTab } = useTournament();

  const [newIgUrl, setNewIgUrl] = useState('');
  const [newIgCaption, setNewIgCaption] = useState('');
  const [igError, setIgError] = useState('');
  const [showAddPostForm, setShowAddPostForm] = useState(false);
  const [activePostIdx, setActivePostIdx] = useState(0);
  const [editingHandle, setEditingHandle] = useState(false);
  const [handleInput, setHandleInput] = useState(tournament.instagramHandle || '@ruchimasters');
  const [profileUrlInput, setProfileUrlInput] = useState(tournament.instagramUrl || 'https://www.instagram.com/');

  const [polls, setPolls] = useState<PollState>(() => {
    try {
      const saved = localStorage.getItem(POLL_STORAGE_KEY);
      return saved
        ? {
            ...DEFAULT_POLL_STATE,
            ...JSON.parse(saved),
          }
        : DEFAULT_POLL_STATE;
    } catch {
      return DEFAULT_POLL_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(POLL_STORAGE_KEY, JSON.stringify(polls));
    } catch {
      // ignore storage quota errors
    }
  }, [polls]);

  const igPosts = tournament.instagramPosts || [];
  const activeIgPost = igPosts[activePostIdx] || igPosts[0];
  const parsedActiveIg = activeIgPost ? parseInstagramUrl(activeIgPost.url) : null;

  const fallbackGallery = (hallOfFame[0]?.media || [])
    .filter(m => m.type === 'image')
    .slice(0, 4);

  const handleAddInstagramPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin()) return;
    const clean = normalizeExternalUrl(newIgUrl);
    const parsed = parseInstagramUrl(clean);
    if (!parsed) {
      setIgError('Enter a valid Instagram Post or Reel URL (e.g. https://www.instagram.com/p/... or /reel/...)');
      return;
    }
    const post: TeamSocialPost = {
      id: `ig-${Date.now()}`,
      platform: 'instagram',
      url: parsed.permalink,
      title: newIgCaption.trim() || 'Ruchi Masters Matchday Moment',
      addedAt: new Date().toISOString().slice(0, 10),
    };
    const nextPosts = [post, ...igPosts];
    updateTournament({
      ...tournament,
      instagramPosts: nextPosts,
    });
    setActivePostIdx(0);
    setNewIgUrl('');
    setNewIgCaption('');
    setIgError('');
    setShowAddPostForm(false);
  };

  const handleDeleteInstagramPost = (postId: string) => {
    if (!isAdmin()) return;
    const next = igPosts.filter(p => p.id !== postId);
    updateTournament({
      ...tournament,
      instagramPosts: next,
    });
    setActivePostIdx(0);
  };

  const handleSaveHandle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin()) return;
    updateTournament({
      ...tournament,
      instagramHandle: handleInput.trim() || '@ruchimasters',
      instagramUrl: normalizeExternalUrl(profileUrlInput) || 'https://www.instagram.com/',
    });
    setEditingHandle(false);
  };

  const handleMatchVote = (choice: 'A' | 'B') => {
    if (polls.matchVote === choice) return;
    setPolls(prev => {
      const revertA = prev.matchVote === 'A' ? -1 : 0;
      const revertB = prev.matchVote === 'B' ? -1 : 0;
      return {
        ...prev,
        matchVote: choice,
        matchVotesA: prev.matchVotesA + revertA + (choice === 'A' ? 1 : 0),
        matchVotesB: prev.matchVotesB + revertB + (choice === 'B' ? 1 : 0),
      };
    });
  };

  const handleGroupVote = (grp: string) => {
    if (polls.groupVote === grp) return;
    setPolls(prev => {
      const updated = { ...prev.groupVotes };
      if (prev.groupVote && updated[prev.groupVote] !== undefined) {
        updated[prev.groupVote] = Math.max(0, updated[prev.groupVote] - 1);
      }
      updated[grp] = (updated[grp] || 0) + 1;
      return {
        ...prev,
        groupVote: grp,
        groupVotes: updated,
      };
    });
  };

  const handleWinnerVote = (club: string) => {
    if (polls.winnerVote === club) return;
    setPolls(prev => {
      const updated = { ...prev.winnerVotes };
      if (prev.winnerVote && updated[prev.winnerVote] !== undefined) {
        updated[prev.winnerVote] = Math.max(0, updated[prev.winnerVote] - 1);
      }
      updated[club] = (updated[club] || 0) + 1;
      return {
        ...prev,
        winnerVote: club,
        winnerVotes: updated,
      };
    });
  };

  const handleMvpVote = (playerName: string) => {
    if (polls.mvpVote === playerName) return;
    setPolls(prev => {
      const updated = { ...prev.mvpVotes };
      if (prev.mvpVote && updated[prev.mvpVote] !== undefined) {
        updated[prev.mvpVote] = Math.max(0, updated[prev.mvpVote] - 1);
      }
      updated[playerName] = (updated[playerName] || 0) + 1;
      return {
        ...prev,
        mvpVote: playerName,
        mvpVotes: updated,
      };
    });
  };

  const totalMatchVotes = polls.matchVotesA + polls.matchVotesB;
  const pctA = totalMatchVotes ? Math.round((polls.matchVotesA / totalMatchVotes) * 100) : 50;
  const pctB = 100 - pctA;

  const totalGroupVotes = Object.values(polls.groupVotes).reduce((a, b) => a + b, 0);
  const totalWinnerVotes = Object.values(polls.winnerVotes).reduce((a, b) => a + b, 0);
  const totalMvpVotes = Object.values(polls.mvpVotes).reduce((a, b) => a + b, 0);
  const grandTotalVotes = totalMatchVotes + totalGroupVotes + totalWinnerVotes + totalMvpVotes;

  return (
    <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pb-10 sm:pb-12">
      <div className="border-t border-[#090909]/15 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 6 Cols: Official Tournament Instagram Feed */}
          <div className="lg:col-span-6 rounded-[6px] bg-white border border-[#090909]/12 p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="flex-1 flex flex-col gap-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 min-h-[28px]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#090909] text-[#f6f4f4] text-[10px] font-bold uppercase tracking-wider">
                    <Camera className="w-3 h-3 text-[#ff6a17]" /> Instagram Feed
                  </span>
                  <span className="rally-eyebrow text-[#736e6e]">
                    {tournament.instagramHandle || '@ruchimasters'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin() && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowAddPostForm(v => !v)}
                        className="px-2.5 py-1 rounded-full bg-[#ff6a17] hover:bg-[#ff8640] text-[#090909] text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{showAddPostForm ? 'Hide' : 'Add Post'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingHandle(v => !v)}
                        className="text-[11px] font-bold text-[#575252] hover:text-[#ff6a17] cursor-pointer"
                      >
                        {editingHandle ? 'Close' : 'Handle'}
                      </button>
                    </>
                  )}
                  <a
                    href={tournament.instagramUrl || 'https://www.instagram.com/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f6f4f4] hover:bg-[#090909] hover:text-white border border-[#090909]/15 text-[11px] font-bold text-[#090909] transition-colors"
                  >
                    <span>Follow</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="rally-h2 text-[24px] sm:text-[28px]">
                  Tournament Instagram moments
                </h3>
                <p className="text-xs text-[#736e6e] mt-1">
                  Matchday highlights, reels, and official updates from the ground.
                </p>
              </div>

              {isAdmin() && editingHandle && (
                <form onSubmit={handleSaveHandle} className="p-3 rounded-[6px] bg-[#f6f4f4] border border-[#090909]/15 space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={handleInput}
                      onChange={e => setHandleInput(e.target.value)}
                      placeholder="@ruchimasters"
                      className="px-2.5 py-1.5 rounded bg-white border border-[#090909]/15 font-semibold outline-none"
                    />
                    <input
                      type="url"
                      value={profileUrlInput}
                      onChange={e => setProfileUrlInput(e.target.value)}
                      placeholder="https://instagram.com/yourhandle"
                      className="px-2.5 py-1.5 rounded bg-white border border-[#090909]/15 font-semibold outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-[#090909] text-white font-bold text-[11px] cursor-pointer"
                  >
                    Save Instagram Profile
                  </button>
                </form>
              )}

              {isAdmin() && showAddPostForm && (
                <form onSubmit={handleAddInstagramPost} className="p-3 rounded-[6px] bg-[#f6f4f4] border border-[#090909]/15 space-y-2 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#575252]">
                    Embed Tournament Instagram Post / Reel
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      required
                      value={newIgUrl}
                      onChange={e => { setNewIgUrl(e.target.value); setIgError(''); }}
                      placeholder="https://www.instagram.com/reel/... or /p/..."
                      className="flex-1 px-2.5 py-1.5 rounded bg-white border border-[#090909]/15 font-medium outline-none"
                    />
                    <input
                      type="text"
                      value={newIgCaption}
                      onChange={e => setNewIgCaption(e.target.value)}
                      placeholder="Caption (optional)"
                      className="sm:w-36 px-2.5 py-1.5 rounded bg-white border border-[#090909]/15 font-medium outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded bg-[#ff6a17] hover:bg-[#ff8640] text-[#090909] font-black flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                  {igError && <p className="text-[11px] text-rose-600 font-semibold">{igError}</p>}
                </form>
              )}

              {parsedActiveIg ? (
                <div className="flex-1 flex flex-col gap-2">
                  {(igPosts.length > 1 || isAdmin()) && (
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {igPosts.map((post, idx) => (
                          <button
                            key={post.id}
                            type="button"
                            onClick={() => setActivePostIdx(idx)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 cursor-pointer ${
                              idx === activePostIdx
                                ? 'bg-[#090909] text-white'
                                : 'bg-[#f6f4f4] text-[#575252] border border-[#090909]/15'
                            }`}
                          >
                            Post {idx + 1}
                          </button>
                        ))}
                      </div>
                      {isAdmin() && activeIgPost && (
                        <button
                          type="button"
                          onClick={() => handleDeleteInstagramPost(activeIgPost.id)}
                          className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Remove this post"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-h-[430px] rounded-[6px] border border-[#090909]/12 overflow-hidden bg-white">
                    <iframe
                      src={parsedActiveIg.embedUrl}
                      title={activeIgPost?.title || 'Tournament Instagram Post'}
                      className="w-full h-full min-h-[430px] border-0"
                      scrolling="no"
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 grid grid-cols-2 gap-2.5 content-stretch">
                  {fallbackGallery.map((item, idx) => (
                    <a
                      key={item.id || idx}
                      href={tournament.instagramUrl || 'https://www.instagram.com/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative min-h-[160px] rounded-[6px] overflow-hidden bg-[#191717]"
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-2.5 right-2.5 text-[11px] font-bold text-white line-clamp-1">
                        {item.title}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#090909]/10 flex items-center justify-between text-[12px] text-[#575252]">
              <span>
                {igPosts.length > 0
                  ? `${igPosts.length} featured Instagram ${igPosts.length === 1 ? 'post' : 'posts'}`
                  : 'Official matchday feed'}
              </span>
              <a
                href={tournament.instagramUrl || 'https://www.instagram.com/'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#090909] hover:text-[#ff6a17] flex items-center gap-1"
              >
                Open Instagram <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right 6 Cols: Locker-Room Community Polls & Predictions */}
          <div className="lg:col-span-6 relative overflow-hidden rounded-[6px] bg-[#090909] text-[#f6f4f4] p-5 sm:p-6 flex flex-col justify-between gap-4">
            {/* White-Outline Cover Drive Batter Graphic on Right Edge */}
            <img
              src="/cricket-action/batter-outline.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -right-4 -bottom-4 h-72 w-auto object-contain opacity-15"
            />

            <div className="relative z-10 flex-1 flex flex-col gap-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 min-h-[28px]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ff6a17] text-[#090909] text-[10px] font-bold uppercase tracking-wider">
                    <Flame className="w-3 h-3" /> Fan &amp; Player Pulse
                  </span>
                  <span className="rally-eyebrow text-[#f6f4f4]/60">
                    {grandTotalVotes} Community Votes
                  </span>
                </div>
              </div>

              <div>
                <h3 className="rally-h2 text-[24px] sm:text-[28px] text-[#f6f4f4]">
                  Matchday predictions &amp; polls
                </h3>
                <p className="text-xs text-[#f6f4f4]/60 mt-1">
                  Vote on title contenders, MVP favorites, matchdays &amp; group battles.
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-between gap-3">
                {/* Poll 1: Championship Contenders */}
                <div className="rounded-[6px] bg-white/[0.06] backdrop-blur-[2px] border border-white/10 p-3.5">
                  <div className="flex items-center justify-between text-[11px] text-[#f6f4f4]/60 mb-2">
                    <span className="uppercase tracking-wider font-bold text-[#ff6a17]">
                      Next Trophy Contender · Who Lifts the Cup?
                    </span>
                    <span>{totalWinnerVotes} votes</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(polls.winnerVotes).map(([club, count]) => {
                      const pct = totalWinnerVotes ? Math.round((count / totalWinnerVotes) * 100) : 25;
                      const active = polls.winnerVote === club;
                      return (
                        <button
                          key={club}
                          onClick={() => handleWinnerVote(club)}
                          className={`px-2.5 py-2 rounded-[6px] border text-left flex items-center justify-between gap-2 text-[12px] font-bold transition-all cursor-pointer ${
                            active
                              ? 'bg-[#ff6a17] text-[#090909] border-[#ff6a17]'
                              : 'bg-white/5 text-[#f6f4f4] border-white/15 hover:border-[#ff6a17]'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1">
                            {active && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                            <span className="truncate">{club}</span>
                          </span>
                          <span className="font-mono text-[11px] shrink-0">{pct}%</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Poll 2: Featured Matchday Vote */}
                <div className="rounded-[6px] bg-white/[0.06] backdrop-blur-[2px] border border-white/10 p-3.5">
                  <div className="flex items-center justify-between text-[11px] text-[#f6f4f4]/60 mb-2">
                    <span className="uppercase tracking-wider font-bold text-[#ff6a17]">
                      Featured Matchday Poll · Who Wins?
                    </span>
                    <span>{totalMatchVotes} votes</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleMatchVote('A')}
                      className={`h-9 px-3 rounded-[6px] border text-left flex items-center justify-between text-[12px] font-bold transition-all cursor-pointer ${
                        polls.matchVote === 'A'
                          ? 'bg-[#ff6a17] text-[#090909] border-[#ff6a17]'
                          : 'bg-white/5 text-[#f6f4f4] border-white/15 hover:border-[#ff6a17]'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        {polls.matchVote === 'A' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                        Frankfurt Eagles
                      </span>
                      <span className="font-mono">{pctA}%</span>
                    </button>

                    <button
                      onClick={() => handleMatchVote('B')}
                      className={`h-9 px-3 rounded-[6px] border text-left flex items-center justify-between text-[12px] font-bold transition-all cursor-pointer ${
                        polls.matchVote === 'B'
                          ? 'bg-[#ff6a17] text-[#090909] border-[#ff6a17]'
                          : 'bg-white/5 text-[#f6f4f4] border-white/15 hover:border-[#ff6a17]'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        {polls.matchVote === 'B' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                        Sulzbach XI
                      </span>
                      <span className="font-mono">{pctB}%</span>
                    </button>
                  </div>

                  <div className="mt-2 h-1.5 w-full rounded-full bg-white/15 overflow-hidden flex">
                    <div
                      className="h-full bg-[#ff6a17] transition-all duration-300"
                      style={{ width: `${pctA}%` }}
                    />
                  </div>
                </div>

                {/* Poll 3: Fan MVP / Orange Cap Favorite */}
                <div className="rounded-[6px] bg-white/[0.06] backdrop-blur-[2px] border border-white/10 p-3.5">
                  <div className="flex items-center justify-between text-[11px] text-[#f6f4f4]/60 mb-2">
                    <span className="uppercase tracking-wider font-bold text-[#f6f4f4]">
                      Fan Favorite · MVP &amp; Orange Cap Pick
                    </span>
                    <span>{totalMvpVotes} votes</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(polls.mvpVotes).map(([playerName, count]) => {
                      const pct = totalMvpVotes ? Math.round((count / totalMvpVotes) * 100) : 25;
                      const active = polls.mvpVote === playerName;
                      return (
                        <button
                          key={playerName}
                          onClick={() => handleMvpVote(playerName)}
                          className={`px-2.5 py-2 rounded-[6px] border text-left flex items-center justify-between gap-2 text-[12px] font-bold transition-all cursor-pointer ${
                            active
                              ? 'bg-[#ff6a17] text-[#090909] border-[#ff6a17]'
                              : 'bg-white/5 text-[#f6f4f4] border-white/15 hover:border-[#ff6a17]'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1">
                            {active && <CheckCircle2 className="w-3 h-3 shrink-0" />}
                            <span className="truncate">{playerName}</span>
                          </span>
                          <span className="font-mono text-[11px] shrink-0">{pct}%</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Poll 4: Toughest Group ("Group of Death") */}
                <div className="rounded-[6px] bg-white/[0.06] backdrop-blur-[2px] border border-white/10 p-3.5">
                  <div className="flex items-center justify-between text-[11px] text-[#f6f4f4]/60 mb-2">
                    <span className="uppercase tracking-wider font-bold text-[#f6f4f4]">
                      Toughest 2026 &ldquo;Group of Death&rdquo;?
                    </span>
                    <span>{totalGroupVotes} votes</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Group A', 'Group B', 'Group C', 'Group D'] as const).map(grp => {
                      const count = polls.groupVotes[grp] || 0;
                      const pct = totalGroupVotes ? Math.round((count / totalGroupVotes) * 100) : 25;
                      const active = polls.groupVote === grp;
                      return (
                        <button
                          key={grp}
                          onClick={() => handleGroupVote(grp)}
                          className={`p-2 rounded-[6px] border text-left transition-all cursor-pointer ${
                            active
                              ? 'bg-[#ff6a17] text-[#090909] border-[#ff6a17]'
                              : 'bg-white/5 text-[#f6f4f4] border-white/15 hover:border-[#ff6a17]'
                          }`}
                        >
                          <div className="text-[12px] font-bold flex items-center justify-between">
                            <span>{grp.replace('Group ', 'Grp ')}</span>
                            <span className="font-mono text-[11px]">{pct}%</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[12px] text-[#f6f4f4]/65">
              <span>Tap any option above to cast your vote</span>
              <button
                onClick={() => {
                  setActiveTab('pickem');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-bold text-[#ff6a17] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open Full Pick&apos;Em Challenge <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
