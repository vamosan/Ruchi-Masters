import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Plus,
  Minus,
  Play,
  KeyRound,
  UserCheck,
  Trophy,
  Award,
  Flame,
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Match, Team } from '../../types/cricket';
import { ClubEngagementZone } from './ClubEngagementZone';

const CRICKET_BALL_HERO_IMG =
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=2000&q=85';
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80';

const FAQS = [
  {
    q: "What's the format?",
    a: 'T20 cricket — 20 overs a side, 4 overs max per bowler and a 6-over powerplay. Clubs play a group stage followed by single-elimination knockouts.',
  },
  {
    q: 'Who can take part?',
    a: 'Registered clubs from Frankfurt and the wider Rhein-Main region. Every player is verified by their team captain before playing.',
  },
  {
    q: 'How do captains manage their squad?',
    a: 'Click Team Login in the top navigation bar, select your club and enter your 4-digit PIN to go directly to your team profile.',
  },
  {
    q: 'Where are matches played?',
    a: 'Fixtures are played at grounds across Frankfurt, Germany. The exact venue for each match is listed in the schedule.',
  },
  {
    q: 'How do I follow a match live?',
    a: 'Open Live Scores for ball-by-ball scoring, current partnerships and full scorecards. Standings and cap leaderboards update automatically.',
  },
  {
    q: 'Where can I watch match highlights?',
    a: 'Visit the Hall of Fame to watch Grand Final highlight reels, presentation ceremonies and browse championship galleries from 2022–2026.',
  },
];

export const HomePage: React.FC = () => {
  const {
    tournament,
    teams,
    matches,
    hallOfFame,
    setActiveTab,
    setActiveTeamProfileId,
    openTeamProfile,
    openAuthModal,
    currentUser,
  } = useTournament();

  const [teamGroupFilter, setTeamGroupFilter] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const go = (tab: string) => {
    if (tab === 'teams') {
      setActiveTeamProfileId(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const groups = useMemo(() => {
    const g = Array.from(new Set(teams.map(t => t.group).filter(Boolean))).sort() as string[];
    return g.length > 0 ? g : ['Group A', 'Group B'];
  }, [teams]);

  // Aggregate live player stats from match scorecards + player records
  const { orangeLeader, purpleLeader, mvpLeader } = useMemo(() => {
    const batMap = new Map<string, { runs: number; balls: number; sixes: number }>();
    const bowlMap = new Map<string, { wickets: number; runsConceded: number }>();

    matches.forEach(m => {
      if (['m-101', 'm-102', 'm-103'].includes(m.id)) return;
      [m.innings1, m.innings2].forEach(inn => {
        if (!inn) return;
        inn.battingScorecard?.forEach(b => {
          const cur = batMap.get(b.playerId) || { runs: 0, balls: 0, sixes: 0 };
          batMap.set(b.playerId, {
            runs: cur.runs + (b.runs || 0),
            balls: cur.balls + (b.balls || 0),
            sixes: cur.sixes + (b.sixes || 0),
          });
        });
        inn.bowlingScorecard?.forEach(bw => {
          const cur = bowlMap.get(bw.playerId) || { wickets: 0, runsConceded: 0 };
          bowlMap.set(bw.playerId, {
            wickets: cur.wickets + (bw.wickets || 0),
            runsConceded: cur.runsConceded + (bw.runsConceded || 0),
          });
        });
      });
    });

    const allPlayers = teams.flatMap(t =>
      t.players.map(p => {
        const b = batMap.get(p.id);
        const bw = bowlMap.get(p.id);
        const runs = Math.max(p.runsScored || 0, b?.runs || 0);
        const wickets = Math.max(p.wicketsTaken || 0, bw?.wickets || 0);
        return {
          ...p,
          teamName: t.name,
          teamCode: t.code,
          runsScored: runs,
          wicketsTaken: wickets,
          mvpPoints: p.mvpPoints || 0,
        };
      })
    );

    const byRuns = [...allPlayers].sort((a, b) => b.runsScored - a.runsScored);
    const byWickets = [...allPlayers].sort((a, b) => b.wicketsTaken - a.wicketsTaken);
    const byMvp = [...allPlayers].sort((a, b) => b.mvpPoints - a.mvpPoints || b.runsScored - a.runsScored);

    return {
      orangeLeader: byRuns[0],
      purpleLeader: byWickets[0],
      mvpLeader: byMvp[0],
    };
  }, [teams, matches]);

  const seasons = useMemo(() => [...hallOfFame].sort((a, b) => a.year - b.year), [hallOfFame]);
  const latest = useMemo(() => [...hallOfFame].sort((a, b) => b.year - a.year)[0], [hallOfFame]);

  // Featured 8 teams (always 8 for a symmetric 4x2 grid without empty slots)
  const featuredTeams = useMemo(() => {
    const pool = teamGroupFilter === 'all' ? teams : teams.filter(t => t.group === teamGroupFilter);
    const myTeam = currentUser.teamId ? pool.find(t => t.id === currentUser.teamId) : undefined;
    const champ = latest ? pool.find(t => t.id === latest.championTeamId || t.name === latest.championTeamName) : undefined;
    const rest = pool.filter(t => t.id !== myTeam?.id && t.id !== champ?.id);
    const withPhoto = rest.filter(t => t.teamPhotoUrl || t.bannerUrl);
    const withoutPhoto = rest.filter(t => !(t.teamPhotoUrl || t.bannerUrl));
    return [myTeam, champ, ...withPhoto, ...withoutPhoto].filter(Boolean).slice(0, 8) as Team[];
  }, [teams, latest, currentUser.teamId, teamGroupFilter]);

  // Gallery (4 uniform items so the 4-column row never has an empty hole)
  const gallery = useMemo(() => {
    if (!latest) return [];
    const imgs = (latest.media || []).filter(m => m.type === 'image').map(m => ({ url: m.url, title: m.title, type: 'image' as const }));
    const lead = latest.trophyPhotoUrl ? [{ url: latest.trophyPhotoUrl, title: latest.editionName, type: 'image' as const }] : [];
    const vid = (latest.media || []).find(m => m.type === 'video' && /youtu/.test(m.url));
    const all = [...lead, ...imgs];
    const seen = new Set<string>();
    const uniqueImgs = all.filter(i => (seen.has(i.url) ? false : (seen.add(i.url), true)));
    if (vid) {
      return [...uniqueImgs.slice(0, 3), { url: vid.url, title: vid.title, type: 'video' as const }];
    }
    return uniqueImgs.slice(0, 4);
  }, [latest]);

  const totalPlayers = teams.reduce((n, t) => n + (t.players?.length || 0), 0);
  const editionNo = hallOfFame.length || 5;
  const myClub = currentUser.teamId ? teams.find(t => t.id === currentUser.teamId) : null;

  return (
    <div className="bg-[#f6f4f4] text-[#090909]">
      {/* ───────────── BAND 1: UNOBSTRUCTED RALLY CRICKET BALL HERO ───────────── */}
      <section className="relative bg-[#090909] text-[#f6f4f4] overflow-hidden">
        <img
          src={CRICKET_BALL_HERO_IMG}
          alt="Cricket Ball on Pitch"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
          onError={e => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
        {/* Left-only gradient so the cricket ball on the right is completely visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-[#090909]/20" />

        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-8">
          <div className="max-w-[700px]">
            <div className="flex flex-wrap items-center gap-3 rally-rise">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a17] text-[#090909] text-[11px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#090909]" />
                Season {String(editionNo).padStart(2, '0')} · {tournament.format || 'T20'}
              </span>
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-[11px] font-semibold text-[#f6f4f4]">
                <span className="text-[10px] uppercase tracking-wider text-[#f6f4f4]/65">Presented by</span>
                <span className="bg-white px-2 py-0.5 rounded-full inline-flex items-center">
                  <img src="/images/ruchi-sponsor.png" alt="Ruchi Restaurant & Catering" className="h-4 w-auto object-contain" />
                </span>
              </span>
              <span className="rally-eyebrow text-[#f6f4f4]/80">
                Frankfurt, Germany · {teams.length} Clubs
              </span>
            </div>

            <h1 className="rally-display mt-5 text-[52px] sm:text-[76px] lg:text-[92px] max-w-[11ch] rally-rise rally-rise-1">
              Where every run is a fight
            </h1>

            <p className="mt-4 max-w-[500px] text-[16px] leading-relaxed text-[#f6f4f4]/80 rally-rise rally-rise-2">
              Frankfurt’s premier T20 cricket league — {teams.length} clubs, one trophy. Follow every
              ball live, track the group standings, and manage your squad in one place.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 rally-rise rally-rise-3">
              <button onClick={() => go('fixtures')} className="rally-btn rally-btn-primary">
                View Schedule
              </button>
              {myClub ? (
                <button
                  onClick={() => openTeamProfile(myClub.id)}
                  className="rally-btn rally-btn-ghost-light"
                >
                  <UserCheck className="w-4 h-4 text-[#ff6a17]" />
                  {myClub.name}
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="rally-btn rally-btn-ghost-light"
                >
                  <KeyRound className="w-4 h-4 text-[#ff6a17]" />
                  Team Login
                </button>
              )}
              <button onClick={() => go('teams')} className="rally-btn rally-btn-ghost-light">
                Explore {teams.length} Clubs
              </button>
            </div>
          </div>

          {/* Bottom 4-Column Stat Strip */}
          <div className="mt-10 pt-5 grid grid-cols-2 sm:grid-cols-4 border-t border-white/15">
            {[
              { k: String(teams.length), v: 'Competing Clubs' },
              { k: totalPlayers ? String(totalPlayers) : '600+', v: 'Registered Players' },
              { k: String(tournament.rules?.oversPerInnings || 20), v: 'Overs per Innings' },
              { k: '96', v: 'Tournament Matches' },
            ].map((s, i) => (
              <div
                key={i}
                className={`pt-2 pr-4 ${i > 0 ? 'sm:pl-6 sm:border-l border-white/15' : ''} ${
                  i === 2 ? 'border-t sm:border-t-0 border-white/15' : ''
                } ${i === 3 ? 'border-t sm:border-t-0 border-white/15 pl-6 border-l' : ''} ${
                  i === 1 ? 'pl-6 border-l border-white/15' : ''
                }`}
              >
                <div className="text-[28px] sm:text-[34px] font-bold tracking-[-0.04em] leading-none">{s.k}</div>
                <div className="mt-1 text-[12px] text-[#f6f4f4]/60 truncate">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── PROMINENT OFFICIAL TITLE SPONSOR SHOWCASE ───────────── */}
      <section className="bg-white border-b border-[#090909]/12">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="px-3 py-1 rounded-full bg-[#090909] text-[#ff6a17] text-[10px] font-black uppercase tracking-widest shrink-0">
              Official Title Sponsor
            </span>
            <div>
              <div className="text-[16px] sm:text-[18px] font-black tracking-tight text-[#090909]">
                Ruchi Restaurant &amp; Catering · Frankfurt
              </div>
              <p className="text-[12px] text-[#575252]">
                Proudly presenting Season {String(editionNo).padStart(2, '0')} of Ruchi Masters T20 Championship
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 px-4 py-2 rounded-[6px] bg-[#f6f4f4] border border-[#090909]/12 shadow-2xs">
            <img
              src="/images/ruchi-sponsor.png"
              alt="Ruchi Restaurant & Catering — Official Title Sponsor"
              className="h-9 sm:h-11 w-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* ───────────── BAND 2: 2026 TOURNAMENT TOPPERS (WINNERS, RUNNERS UP, ORANGE CAP, PURPLE CAP & MVP) ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-8 sm:pt-10 pb-6 sm:pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <div className="rally-eyebrow text-[#ff6a17]">
              {latest ? `${latest.year} Roll of Honour` : '2026 Roll of Honour'}
            </div>
            <h2 className="rally-h2 text-[28px] sm:text-[38px] mt-1">
              Season Toppers
            </h2>
          </div>
          <button
            onClick={() => go('stats')}
            className="rally-link-arrow hover:text-[#ff6a17]"
          >
            Full Leaderboards &amp; Standings <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 1: Champions & Runners Up (Bold Spotlight Cards) */}
        {latest && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch mb-4">
            {/* Winners */}
            <button
              onClick={() => go('halloffame')}
              className="lg:col-span-6 relative overflow-hidden group rounded-[6px] bg-[#090909] text-[#f6f4f4] p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-[#191717] transition-colors cursor-pointer"
            >
              <img
                src="/cricket-action/batter-outline.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute right-20 -bottom-4 h-36 w-auto object-contain opacity-20 group-hover:scale-105 transition-transform"
              />
              <div className="relative z-10 flex items-center gap-4 min-w-0">
                <span className="w-12 h-12 rounded-full bg-[#ff6a17] text-[#090909] flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-widest text-[#ff6a17]">
                    {latest.year} Winners
                  </div>
                  <div className="rally-display text-[22px] sm:text-[28px] text-[#f6f4f4] group-hover:text-[#ff6a17] transition-colors truncate mt-1">
                    {latest.championTeamName}
                  </div>
                </div>
              </div>
              <span className="relative z-10 w-9 h-9 rounded-full bg-white/10 text-[#f6f4f4] flex items-center justify-center group-hover:bg-[#ff6a17] group-hover:text-[#090909] transition-colors shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>

            {/* Runners Up */}
            <button
              onClick={() => go('halloffame')}
              className="lg:col-span-6 relative overflow-hidden group rounded-[6px] bg-white border-2 border-[#090909] p-5 sm:p-6 flex items-center justify-between gap-4 text-left hover:bg-[#eeebeb]/40 transition-colors cursor-pointer"
            >
              <div className="relative z-10 flex items-center gap-4 min-w-0">
                <span className="w-12 h-12 rounded-full bg-[#090909] text-[#f6f4f4] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-[#ff6a17]" />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-widest text-[#575252]">
                    {latest.year} Runners Up
                  </div>
                  <div className="rally-display text-[22px] sm:text-[28px] text-[#090909] group-hover:text-[#ff6a17] transition-colors truncate mt-1">
                    {latest.runnerUpTeamName}
                  </div>
                </div>
              </div>
              <span className="relative z-10 w-9 h-9 rounded-full border border-[#090909]/20 text-[#090909] flex items-center justify-center group-hover:bg-[#090909] group-hover:text-[#f6f4f4] transition-colors shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        )}

        {/* Row 2: Orange Cap, Purple Cap & MVP (Bold 3-Column Honours) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Orange Cap */}
          {orangeLeader && (
            <button
              onClick={() => go('stats')}
              className="relative overflow-hidden group rounded-[6px] bg-white border border-[#090909]/15 hover:border-[#ff6a17] p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
            >
              <img
                src="/cricket-action/batter-lofted.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute right-14 -bottom-2 h-28 w-auto object-contain opacity-[0.12] group-hover:opacity-25 group-hover:scale-105 transition-all"
              />
              <div className="relative z-10 min-w-0">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#ff6a17]">
                  <span className="w-2 h-2 rounded-full bg-[#ff6a17]" />
                  Orange Cap
                </div>
                <div className="text-[20px] sm:text-[22px] font-black tracking-tight text-[#090909] truncate mt-1">
                  {orangeLeader.name}
                </div>
                <div className="text-[12px] font-bold text-[#575252] truncate mt-0.5">
                  {orangeLeader.teamName}
                </div>
              </div>
              <div className="relative z-10 text-right shrink-0 ml-2">
                <div className="font-mono text-[30px] sm:text-[34px] font-black leading-none text-[#090909]">
                  {orangeLeader.runsScored}
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#736e6e] mt-1">
                  Runs
                </div>
              </div>
            </button>
          )}

          {/* Purple Cap */}
          {purpleLeader && (
            <button
              onClick={() => go('stats')}
              className="relative overflow-hidden group rounded-[6px] bg-white border border-[#090909]/15 hover:border-[#090909] p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
            >
              <img
                src="/cricket-action/bowler-action.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute right-12 -bottom-2 h-28 w-auto object-contain opacity-[0.14] group-hover:opacity-25 group-hover:scale-105 transition-all"
              />
              <div className="relative z-10 min-w-0">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-purple-700">
                  <span className="w-2 h-2 rounded-full bg-purple-700" />
                  Purple Cap
                </div>
                <div className="text-[20px] sm:text-[22px] font-black tracking-tight text-[#090909] truncate mt-1">
                  {purpleLeader.name}
                </div>
                <div className="text-[12px] font-bold text-[#575252] truncate mt-0.5">
                  {purpleLeader.teamName}
                </div>
              </div>
              <div className="relative z-10 text-right shrink-0 ml-2">
                <div className="font-mono text-[30px] sm:text-[34px] font-black leading-none text-[#090909]">
                  {purpleLeader.wicketsTaken}
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#736e6e] mt-1">
                  Wickets
                </div>
              </div>
            </button>
          )}

          {/* Tournament MVP */}
          {mvpLeader && (
            <button
              onClick={() => go('stats')}
              className="relative overflow-hidden group rounded-[6px] bg-[#090909] text-[#f6f4f4] border border-[#090909] hover:border-[#ff6a17] p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="relative z-10 min-w-0">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#ff6a17]">
                  <Flame className="w-3.5 h-3.5" />
                  Tournament MVP
                </div>
                <div className="text-[20px] sm:text-[22px] font-black tracking-tight text-[#f6f4f4] truncate mt-1">
                  {mvpLeader.name}
                </div>
                <div className="text-[12px] font-bold text-[#f6f4f4]/65 truncate mt-0.5">
                  {mvpLeader.teamName}
                </div>
              </div>
              <div className="relative z-10 text-right shrink-0 ml-2">
                <div className="font-mono text-[30px] sm:text-[34px] font-black leading-none text-[#ff6a17]">
                  {Math.round(mvpLeader.mvpPoints)}
                </div>
                <div className="text-[10px] font-black uppercase tracking-wider text-[#f6f4f4]/60 mt-1">
                  MVP Pts
                </div>
              </div>
            </button>
          )}
        </div>
      </section>

      {/* ───────────── BAND 3: INTERACTIVE CLUB ZONE (HEAD-TO-HEAD & LIVE FAN POLLS) ───────────── */}
      <ClubEngagementZone />

      {/* ───────────── BAND 5: MEET THE COMPETITION (4×2 COMPACT GRID, ZERO GAPS) ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pb-10 sm:pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5 border-t border-[#090909]/15 pt-8">
          <div>
            <div className="rally-eyebrow text-[#736e6e]">Club Directory</div>
            <h2 className="rally-h2 text-[28px] sm:text-[36px] mt-1">Meet the competition</h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setTeamGroupFilter('all')}
              className={`h-8 px-3 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
                teamGroupFilter === 'all'
                  ? 'bg-[#090909] text-[#f6f4f4]'
                  : 'border border-[#090909]/15 text-[#575252] hover:border-[#090909]'
              }`}
            >
              All ({teams.length})
            </button>
            {groups.map(g => (
              <button
                key={g}
                onClick={() => setTeamGroupFilter(g)}
                className={`h-8 px-3 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
                  teamGroupFilter === g
                    ? 'bg-[#090909] text-[#f6f4f4]'
                    : 'border border-[#090909]/15 text-[#575252] hover:border-[#090909]'
                }`}
              >
                {g}
              </button>
            ))}
            <button
              onClick={() => go('teams')}
              className="rally-link-arrow ml-2 !text-[13px] hover:text-[#ff6a17]"
            >
              All {teams.length} clubs <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featuredTeams.map(t => {
            const img = t.teamPhotoUrl || t.bannerUrl;
            const isChamp = latest && (t.id === latest.championTeamId || t.name === latest.championTeamName);
            const isMine = currentUser.teamId === t.id;
            return (
              <button key={t.id} onClick={() => openTeamProfile(t.id)} className="group text-left cursor-pointer">
                <div className="relative aspect-[16/10] rounded-[6px] overflow-hidden bg-[#2c2727]">
                  {img ? (
                    <img
                      src={img}
                      alt={t.name}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                      onError={e => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  ) : (
                    <div
                      className="relative w-full h-full flex items-center justify-center overflow-hidden"
                      style={{
                        background: `linear-gradient(160deg, ${t.primaryColor || '#2c2727'} 0%, #090909 85%)`,
                      }}
                    >
                      <img
                        src="/cricket-action/batter-outline.png"
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none select-none absolute -right-2 -bottom-2 h-36 w-auto object-contain opacity-25 group-hover:scale-105 transition-transform"
                      />
                      <span className="relative z-10 text-[44px] opacity-90">{t.logo}</span>
                    </div>
                  )}
                  {(isChamp || isMine) && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#ff6a17] text-[#090909] text-[10px] font-bold">
                      {isMine ? 'Your Club' : 'Defending Champion'}
                    </span>
                  )}
                  <span className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#f6f4f4] text-[#090909] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[15px] sm:text-[16px] font-bold tracking-[-0.02em] truncate group-hover:text-[#ff6a17] transition-colors">
                      {t.name}
                    </div>
                    <div className="text-[12px] text-[#736e6e]">
                      {t.group || 'League'} · {t.players?.length || 0} players
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-[#9a9595] mt-0.5 shrink-0">
                    {t.code}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ───────────── BAND 6: ROLL OF HONOUR & UNIFORM 4-COLUMN GALLERY (DARK) ───────────── */}
      {seasons.length > 0 && (
        <section className="relative overflow-hidden bg-[#090909] text-[#f6f4f4]">
          <img
            src="/cricket-action/batter-outline.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none select-none absolute right-6 top-6 h-80 w-auto object-contain opacity-[0.12]"
          />
          <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8 py-10 sm:py-12 space-y-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="rally-eyebrow text-[#ff6a17]">2022 – 2026 Archive</div>
                <h2 className="rally-h2 text-[28px] sm:text-[38px] text-[#f6f4f4] mt-1">
                  The road to the trophy
                </h2>
              </div>
              <button
                onClick={() => go('halloffame')}
                className="rally-link-arrow text-[#f6f4f4] hover:text-[#ff6a17]"
              >
                Hall of Fame &amp; Videos <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* 5-Season Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-b border-white/15">
              {seasons.map((s, i) => {
                const isLatest = s.year === latest?.year;
                return (
                  <button
                    key={s.id}
                    onClick={() => go('halloffame')}
                    className={`text-left p-4 sm:p-5 border-b lg:border-b-0 border-white/15 ${
                      i > 0 ? 'lg:border-l' : ''
                    } ${i % 2 === 1 ? 'sm:border-l' : ''} hover:bg-white/[0.03] transition-colors flex flex-col justify-between gap-4 cursor-pointer`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#f6f4f4]/50">
                          Season {String(i + 1).padStart(2, '0')}
                        </span>
                        {isLatest && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6a17]">
                            Latest
                          </span>
                        )}
                      </div>
                      <div
                        className={`mt-1.5 text-[36px] font-black tracking-[-0.05em] leading-none ${
                          isLatest ? 'text-[#ff6a17]' : ''
                        }`}
                      >
                        {s.year}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#f6f4f4]/45">
                        Champion
                      </div>
                      <div className="mt-0.5 text-[15px] font-bold tracking-[-0.02em] leading-tight">
                        {s.championTeamName}
                      </div>
                      <div className="mt-1 text-[12px] text-[#f6f4f4]/50 leading-snug">
                        Beat {s.runnerUpTeamName}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Uniform 4-Column Gallery Strip (Zero Bento Gaps) */}
            {gallery.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {gallery.map((g, i) => (
                  <button
                    key={g.url + i}
                    onClick={() => go('halloffame')}
                    className="group relative aspect-[16/10] rounded-[6px] overflow-hidden bg-[#2c2727] text-left cursor-pointer"
                  >
                    {g.type === 'video' ? (
                      <div className="w-full h-full bg-[#191717] p-4 flex flex-col justify-between">
                        <span className="rally-eyebrow text-[#ff6a17]">Video Highlights</span>
                        <div>
                          <span className="w-9 h-9 rounded-full bg-[#ff6a17] text-[#090909] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-current translate-x-0.5" />
                          </span>
                          <div className="mt-2 text-[14px] font-bold text-[#f6f4f4] line-clamp-1">
                            {g.title}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={g.url}
                          alt={g.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          onError={e => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMG;
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#090909]/85 to-transparent">
                          <span className="text-[12px] font-medium text-[#f6f4f4] line-clamp-1">
                            {g.title}
                          </span>
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ───────────── BAND 7: BALANCED 2-COLUMN FAQ (ZERO LEFT-COLUMN GAP) ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="flex items-end justify-between gap-4 mb-5">
          <h2 className="rally-h2 text-[28px] sm:text-[36px]">Frequently asked</h2>
          <button
            onClick={() => (myClub ? openTeamProfile(myClub.id) : openAuthModal())}
            className="rally-link-arrow hover:text-[#ff6a17]"
          >
            {myClub ? 'My Team Profile' : 'Team Login'}{' '}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 border-t border-[#090909]/15">
          {FAQS.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={f.q} className="border-b border-[#090909]/15">
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-3.5 text-left cursor-pointer"
                >
                  <span className="text-[16px] font-bold tracking-[-0.02em]">{f.q}</span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      open ? 'bg-[#ff6a17]' : 'bg-[#090909]/[0.06]'
                    }`}
                  >
                    {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>
                {open && (
                  <p className="pb-3.5 pr-10 text-[14px] leading-relaxed text-[#575252]">{f.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
