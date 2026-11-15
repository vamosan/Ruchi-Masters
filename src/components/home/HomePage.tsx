import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Minus,
  Play,
  KeyRound,
  Camera,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { calculatePointsTable } from '../../utils/nrrCalculator';
import { Match, Team } from '../../types/cricket';

const CRICKET_BALL_HERO_IMG =
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=2000&q=85';
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80';

const TeamMark: React.FC<{ team?: Team }> = ({ team }) => (
  <span
    className="w-7 h-7 text-xs rounded-full flex items-center justify-center shrink-0 border border-black/10"
    style={{ backgroundColor: (team?.primaryColor || '#2c2727') + '22' }}
  >
    {team?.logo || '🏏'}
  </span>
);

const statusLabel = (m: Match) => {
  if (m.status === 'live') return 'Live';
  if (m.status === 'innings_break') return 'Innings Break';
  if (m.status === 'toss') return 'Toss';
  if (m.status === 'completed') return 'Result';
  if (m.status === 'abandoned') return 'Abandoned';
  return m.stage;
};

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
    a: 'Click Captain Login in the top navigation or use the Captain Portal column to enter your 4-digit PIN and go directly to your team profile.',
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
    setActiveMatchId,
    openAuthModal,
    currentUser,
  } = useTournament();

  const [matchFilter, setMatchFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [selectedGroupTab, setSelectedGroupTab] = useState<string>('Group A');
  const [teamGroupFilter, setTeamGroupFilter] = useState<string>('all');
  const [quickLoginTeamId, setQuickLoginTeamId] = useState<string>(teams[0]?.id || '');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const go = (tab: string) => {
    if (tab === 'teams') {
      setActiveTeamProfileId(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const teamById = (id?: string) => teams.find(t => t.id === id);

  // Schedule (always 5 rows so all 3 columns align with zero gap)
  const schedule = useMemo(() => {
    const rank = (m: Match) =>
      m.status === 'live' || m.status === 'innings_break' ? 0 :
      m.status === 'toss' ? 1 :
      m.status === 'scheduled' ? 2 : 3;
    const sorted = [...matches].sort((a, b) => rank(a) - rank(b) || a.matchNumber - b.matchNumber);
    if (matchFilter === 'live') return sorted.filter(m => m.status === 'live' || m.status === 'innings_break').slice(0, 5);
    if (matchFilter === 'upcoming') return sorted.filter(m => m.status === 'scheduled' || m.status === 'toss').slice(0, 5);
    if (matchFilter === 'completed') return sorted.filter(m => m.status === 'completed').slice(0, 5);
    return sorted.slice(0, 5);
  }, [matches, matchFilter]);

  // Standings
  const standings = useMemo(
    () => calculatePointsTable(teams, matches, tournament.rules),
    [teams, matches, tournament.rules]
  );

  const groups = useMemo(() => {
    const g = Array.from(new Set(teams.map(t => t.group).filter(Boolean))) as string[];
    return g.length > 0 ? g : ['Group A', 'Group B'];
  }, [teams]);

  const miniStandings = useMemo(() => {
    const filtered = standings.filter(s => !selectedGroupTab || s.group === selectedGroupTab);
    return (filtered.length > 0 ? filtered : standings).slice(0, 5);
  }, [standings, selectedGroupTab]);

  // Cap Leaders
  const { orangeLeader, purpleLeader } = useMemo(() => {
    const allPlayers = teams.flatMap(t =>
      t.players.map(p => ({ ...p, teamCode: t.code }))
    );
    const byRuns = [...allPlayers].sort((a, b) => b.runsScored - a.runsScored);
    const byWickets = [...allPlayers].sort((a, b) => b.wicketsTaken - a.wicketsTaken);
    return { orangeLeader: byRuns[0], purpleLeader: byWickets[0] };
  }, [teams]);

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

  const openMatch = (m: Match) => {
    setActiveMatchId(m.id);
    go(m.status === 'scheduled' ? 'fixtures' : 'live');
  };

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

        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-8">
          <div className="max-w-[680px]">
            <div className="flex flex-wrap items-center gap-3 rally-rise">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a17] text-[#090909] text-[11px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#090909]" />
                Season {String(editionNo).padStart(2, '0')} · {tournament.format || 'T20'}
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
                  My Team Profile ({myClub.shortName || myClub.code})
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="rally-btn rally-btn-ghost-light"
                >
                  <KeyRound className="w-4 h-4 text-[#ff6a17]" />
                  Captain Login
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
              { k: latest ? String(latest.year) : '2026', v: latest ? `Champion: ${latest.championTeamName}` : 'Active Season' },
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

      {/* ───────────── BAND 2: 3-COLUMN MATCHED-HEIGHT SCHEDULE | STANDINGS | CAPTAIN PORTAL ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Column 1 (5 Cols): Hairline Schedule */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
                <h2 className="rally-h2 text-[26px] sm:text-[32px]">Schedule</h2>
                <div className="flex items-center gap-1">
                  {(['all', 'live', 'upcoming', 'completed'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setMatchFilter(f)}
                      className={`h-7 px-2.5 rounded-full text-[11px] font-medium capitalize transition-colors cursor-pointer ${
                        matchFilter === f
                          ? 'bg-[#090909] text-[#f6f4f4]'
                          : 'border border-[#090909]/15 text-[#575252] hover:border-[#090909]'
                      }`}
                    >
                      {f === 'completed' ? 'Results' : f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#090909]/15">
                {schedule.length === 0 ? (
                  <div className="py-8 text-[#736e6e] text-sm">No matches in this filter.</div>
                ) : (
                  schedule.map(m => {
                    const a = teamById(m.teamAId);
                    const b = teamById(m.teamBId);
                    const live = m.status === 'live' || m.status === 'innings_break';
                    const i1 = m.innings1;
                    const i2 = m.innings2;
                    return (
                      <button
                        key={m.id}
                        onClick={() => openMatch(m)}
                        className="group w-full text-left flex items-center justify-between gap-2 py-3.5 border-b border-[#090909]/15 hover:bg-white/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {live && (
                            <span className="w-2 h-2 rounded-full bg-[#ff6a17] shrink-0" title="Live" />
                          )}
                          <TeamMark team={a} />
                          <span className="text-[14px] font-bold tracking-[-0.02em] truncate">
                            {a?.shortName || a?.code || 'TBD'}
                          </span>
                          <span className="text-[#9a9595] text-[11px] font-medium shrink-0">vs</span>
                          <span className="text-[14px] font-bold tracking-[-0.02em] truncate">
                            {b?.shortName || b?.code || 'TBD'}
                          </span>
                          <TeamMark team={b} />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <div className="text-[12px] font-medium">
                              {(i1 || i2) ? (
                                <span className="tabular-nums font-mono">
                                  {i1 ? `${i1.totalRuns}/${i1.totalWickets}` : '—'} · {i2 ? `${i2.totalRuns}/${i2.totalWickets}` : '—'}
                                </span>
                              ) : statusLabel(m)}
                            </div>
                            <div className="text-[10px] text-[#736e6e]">{m.date}</div>
                          </div>
                          <span className="w-7 h-7 rounded-full border border-[#090909]/15 flex items-center justify-center shrink-0 group-hover:bg-[#090909] group-hover:text-[#f6f4f4] transition-colors">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-[12px] text-[#575252]">
              <span>Showing {schedule.length} of {matches.length} fixtures</span>
              <button onClick={() => go('fixtures')} className="font-bold text-[#090909] hover:text-[#ff6a17] flex items-center gap-1 cursor-pointer">
                Full Schedule <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 2 (4 Cols): Hairline Group Standings */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
                <h2 className="rally-h2 text-[26px] sm:text-[32px]">Standings</h2>
                <div className="flex items-center gap-1">
                  {groups.map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedGroupTab(g)}
                      className={`h-7 px-2.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                        selectedGroupTab === g
                          ? 'bg-[#090909] text-[#f6f4f4]'
                          : 'border border-[#090909]/15 text-[#575252] hover:border-[#090909]'
                      }`}
                    >
                      {g.replace('Group ', 'Grp ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#090909]/15">
                {miniStandings.map((row, idx) => (
                  <button
                    key={row.teamId}
                    onClick={() => openTeamProfile(row.teamId)}
                    className="w-full text-left grid grid-cols-12 items-center py-3.5 border-b border-[#090909]/15 hover:bg-white/60 transition-colors cursor-pointer text-[13px]"
                  >
                    <div className="col-span-1 font-mono font-bold text-[#736e6e]">
                      {idx + 1}
                    </div>
                    <div className="col-span-6 font-bold text-[#090909] truncate flex items-center gap-1.5">
                      <span>{row.teamLogo}</span>
                      <span className="truncate">{row.teamName}</span>
                    </div>
                    <div className="col-span-2 text-center font-mono text-[12px] text-[#575252]">
                      {row.played}P·{row.won}W
                    </div>
                    <div className="col-span-2 text-right font-mono text-[11px] text-[#736e6e]">
                      {row.nrr >= 0 ? `+${row.nrr.toFixed(1)}` : row.nrr.toFixed(1)}
                    </div>
                    <div className="col-span-1 text-right font-mono font-black text-[#090909]">
                      {row.points}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-[12px] text-[#575252]">
              <span>{selectedGroupTab} Leaderboard</span>
              <button onClick={() => go('standings')} className="font-bold text-[#090909] hover:text-[#ff6a17] flex items-center gap-1 cursor-pointer">
                Full Standings Table <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 3 (3 Cols): Separate Captain & Squad Portal + Cap Leaders Column */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-3">
            {/* Captain Login / Direct Profile Card */}
            <div className="rounded-[6px] bg-[#090909] text-[#f6f4f4] p-4 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="relative w-4 h-4 rounded-full bg-[#ff6a17] flex items-center justify-center">
                    <span className="absolute inset-[3px] rounded-full border border-[#090909] border-dashed" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#f6f4f4]">
                    Captain Login
                  </span>
                </div>
                <span className="text-[10px] text-[#ff6a17] font-medium">Direct Profile</span>
              </div>

              {myClub ? (
                <div className="space-y-2.5">
                  <div>
                    <div className="text-[10px] text-[#ff6a17] font-bold uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Captain
                    </div>
                    <div className="text-[15px] font-bold text-[#f6f4f4] truncate mt-0.5">
                      {myClub.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openTeamProfile(myClub.id)}
                      className="flex-1 rally-btn rally-btn-primary !h-9 !px-3 !text-[12px]"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      My Team Profile
                    </button>
                    <button
                      onClick={() => openAuthModal()}
                      className="h-9 px-2.5 rounded-full border border-white/20 text-[11px] text-[#f6f4f4]/70 hover:text-white cursor-pointer"
                    >
                      Switch
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-[12px] text-[#f6f4f4]/70 leading-snug">
                    Select your club and log in with your PIN to go straight to your team profile:
                  </p>
                  <select
                    value={quickLoginTeamId}
                    onChange={e => setQuickLoginTeamId(e.target.value)}
                    className="w-full h-9 px-3 rounded-full bg-white/10 border border-white/20 text-[12px] font-medium text-[#f6f4f4] focus:outline-none focus:border-[#ff6a17]"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id} className="text-[#090909]">
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => openAuthModal(quickLoginTeamId)}
                    className="w-full rally-btn rally-btn-primary !h-9 !px-4 !text-[12px]"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Login to Team Profile
                  </button>
                </div>
              )}
            </div>

            {/* Orange & Purple Cap Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
              {orangeLeader && (
                <button
                  onClick={() => go('stats')}
                  className="p-3 rounded-[6px] bg-white border border-[#090909]/12 flex items-center justify-between text-left hover:border-[#090909] transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#ff6a17]">
                      Orange Cap · Runs
                    </div>
                    <div className="text-[13px] font-bold text-[#090909] truncate mt-0.5">
                      {orangeLeader.name}
                    </div>
                  </div>
                  <span className="font-mono text-[20px] font-black text-[#090909] shrink-0 ml-2">
                    {orangeLeader.runsScored}
                  </span>
                </button>
              )}
              {purpleLeader && (
                <button
                  onClick={() => go('stats')}
                  className="p-3 rounded-[6px] bg-white border border-[#090909]/12 flex items-center justify-between text-left hover:border-[#090909] transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#736e6e]">
                      Purple Cap · Wickets
                    </div>
                    <div className="text-[13px] font-bold text-[#090909] truncate mt-0.5">
                      {purpleLeader.name}
                    </div>
                  </div>
                  <span className="font-mono text-[20px] font-black text-[#090909] shrink-0 ml-2">
                    {purpleLeader.wicketsTaken}
                  </span>
                </button>
              )}
            </div>

            {/* Reigning Champions Card */}
            {latest && (
              <button
                onClick={() => go('halloffame')}
                className="p-3 rounded-[6px] bg-[#090909]/[0.05] border border-[#090909]/12 flex items-center justify-between gap-2 text-left hover:border-[#090909] transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#736e6e]">
                    {latest.year} Reigning Champions
                  </div>
                  <div className="text-[13px] font-bold text-[#090909] truncate mt-0.5">
                    {latest.championTeamName}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#ff6a17] shrink-0" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ───────────── BAND 3: MEET THE COMPETITION (4×2 COMPACT GRID, ZERO GAPS) ───────────── */}
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
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(160deg, ${t.primaryColor || '#2c2727'} 0%, #090909 85%)`,
                      }}
                    >
                      <span className="text-[44px] opacity-90">{t.logo}</span>
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

      {/* ───────────── BAND 4: ROLL OF HONOUR & UNIFORM 4-COLUMN GALLERY (DARK) ───────────── */}
      {seasons.length > 0 && (
        <section className="bg-[#090909] text-[#f6f4f4]">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-10 sm:py-12 space-y-8">
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

      {/* ───────────── BAND 5: BALANCED 2-COLUMN FAQ (ZERO LEFT-COLUMN GAP) ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 py-10 sm:py-12">
        <div className="flex items-end justify-between gap-4 mb-5">
          <h2 className="rally-h2 text-[28px] sm:text-[36px]">Frequently asked</h2>
          <button
            onClick={() => (myClub ? openTeamProfile(myClub.id) : openAuthModal())}
            className="rally-link-arrow hover:text-[#ff6a17]"
          >
            {myClub ? 'My Team Profile' : 'Captain Login'}{' '}
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
