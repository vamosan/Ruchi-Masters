import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Trophy,
  Users,
  Calendar,
  KeyRound,
  ShieldCheck,
  Play,
  Award,
  Flame,
  CheckCircle2,
  MapPin,
  Radio,
  Camera,
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { calculatePointsTable } from '../../utils/nrrCalculator';
import { Match, Team } from '../../types/cricket';

const HERO_IMG =
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1800&q=80';
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80';

export const HomePage: React.FC = () => {
  const {
    tournament,
    teams,
    matches,
    hallOfFame,
    setActiveTab,
    setActiveMatchId,
    openAuthModal,
    currentUser,
  } = useTournament();

  const [matchFilter, setMatchFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
  const [selectedGroupTab, setSelectedGroupTab] = useState<string>('Group A');
  const [quickLoginTeamId, setQuickLoginTeamId] = useState<string>(teams[0]?.id || '');

  const go = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const teamById = (id?: string) => teams.find(t => t.id === id);

  // Standings calculation
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
    return (filtered.length > 0 ? filtered : standings).slice(0, 6);
  }, [standings, selectedGroupTab]);

  // Top Orange Cap & Purple Cap leaders
  const { orangeLeader, purpleLeader } = useMemo(() => {
    const allPlayers = teams.flatMap(t =>
      t.players.map(p => ({ ...p, teamName: t.name, teamCode: t.code, teamLogo: t.logo, teamColor: t.primaryColor }))
    );
    const byRuns = [...allPlayers].sort((a, b) => b.runsScored - a.runsScored);
    const byWickets = [...allPlayers].sort((a, b) => b.wicketsTaken - a.wicketsTaken);
    return {
      orangeLeader: byRuns[0],
      purpleLeader: byWickets[0],
    };
  }, [teams]);

  // Filtered matches for the Match Center widget
  const filteredMatches = useMemo(() => {
    const rank = (m: Match) =>
      m.status === 'live' || m.status === 'innings_break' ? 0 :
      m.status === 'toss' || m.status === 'scheduled' ? 1 : 2;
    const sorted = [...matches].sort((a, b) => rank(a) - rank(b) || a.matchNumber - b.matchNumber);
    if (matchFilter === 'live') return sorted.filter(m => m.status === 'live' || m.status === 'innings_break');
    if (matchFilter === 'upcoming') return sorted.filter(m => m.status === 'scheduled' || m.status === 'toss');
    if (matchFilter === 'completed') return sorted.filter(m => m.status === 'completed');
    return sorted.slice(0, 6);
  }, [matches, matchFilter]);

  const seasons = useMemo(() => [...hallOfFame].sort((a, b) => b.year - a.year), [hallOfFame]);
  const latest = seasons[0];

  // Featured teams (logged-in captain's team first, then defending champ, then teams with photos)
  const featuredTeams = useMemo(() => {
    const myTeam = currentUser.teamId ? teams.find(t => t.id === currentUser.teamId) : undefined;
    const champ = latest ? teams.find(t => t.id === latest.championTeamId || t.name === latest.championTeamName) : undefined;
    const rest = teams.filter(t => t.id !== myTeam?.id && t.id !== champ?.id);
    const withPhoto = rest.filter(t => t.teamPhotoUrl || t.bannerUrl);
    const withoutPhoto = rest.filter(t => !(t.teamPhotoUrl || t.bannerUrl));
    return [myTeam, champ, ...withPhoto, ...withoutPhoto].filter(Boolean).slice(0, 8) as Team[];
  }, [teams, latest, currentUser.teamId]);

  const openMatch = (m: Match) => {
    setActiveMatchId(m.id);
    go(m.status === 'scheduled' ? 'fixtures' : 'live');
  };

  const myClub = currentUser.teamId ? teams.find(t => t.id === currentUser.teamId) : null;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-5 space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════
          ROW 1: ABOVE-THE-FOLD PRO LEAGUE BENTO GRID (8 COLS + 4 COLS)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT 8 COLUMNS: Spotlight Hero + Live Match Center */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1A. Compact Stadium Spotlight Banner */}
          <div className="relative rounded-2xl bg-[#0b0f19] text-white overflow-hidden border border-slate-800 shadow-lg">
            <img
              src={latest?.trophyPhotoUrl || HERO_IMG}
              alt="Ruchi Masters T20"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_IMG;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f19] via-[#0b0f19]/90 to-[#0b0f19]/40" />

            <div className="relative p-5 sm:p-7 space-y-5">
              {/* Top Meta & Sponsor Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    2026 Season · 5th Edition
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-200 text-[11px] font-bold">
                    {teams.length} Verified Clubs · Frankfurt
                  </span>
                </div>

                {/* Title Sponsor */}
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 backdrop-blur-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-300">Title Sponsor</span>
                  <div className="bg-white px-1.5 py-0.5 rounded">
                    <img src="/images/ruchi-sponsor.png" alt="Ruchi" className="h-3.5 object-contain" />
                  </div>
                </div>
              </div>

              {/* Headline & Description */}
              <div className="max-w-2xl space-y-2">
                <h1 className="rally-display text-[30px] sm:text-[42px] text-white">
                  Ruchi Masters <span className="text-[#ff6a17]">T20 Championship</span>
                </h1>
                <p className="text-[14px] sm:text-[15px] text-slate-300 leading-relaxed">
                  Official match center, live ball-by-ball scorecards, ICC Net Run Rate standings, and club roster management for all {teams.length} participating teams.
                </p>
              </div>

              {/* 2026 Podium Strip inside Hero */}
              {latest && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div
                    onClick={() => go('halloffame')}
                    className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-400/40 flex items-center gap-2.5 cursor-pointer hover:border-amber-400 transition-colors"
                  >
                    <span className="text-xl shrink-0">🥇</span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                        {latest.year} Champions
                      </div>
                      <div className="text-[13px] font-bold text-white truncate">
                        {latest.championTeamName}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => go('halloffame')}
                    className="p-3 rounded-xl bg-white/[0.06] border border-white/15 flex items-center gap-2.5 cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <span className="text-xl shrink-0">🥈</span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                        Runner-Up
                      </div>
                      <div className="text-[13px] font-bold text-white truncate">
                        {latest.runnerUpTeamName}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => go('halloffame')}
                    className="p-3 rounded-xl bg-white/[0.06] border border-white/15 flex items-center gap-2.5 cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <span className="text-xl shrink-0">🥉</span>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-300">
                        2nd Runner-Up
                      </div>
                      <div className="text-[13px] font-bold text-white truncate">
                        {latest.secondRunnerUpTeamName || 'Semi-Finalists'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button onClick={() => go('teams')} className="rally-btn rally-btn-primary !h-9 !px-4 !text-[13px]">
                  <Users className="w-4 h-4" />
                  Explore All {teams.length} Teams
                </button>
                <button onClick={() => go('fixtures')} className="rally-btn rally-btn-ghost-light !h-9 !px-4 !text-[13px]">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Fixtures &amp; Scores
                </button>
                <button onClick={() => go('halloffame')} className="rally-btn rally-btn-ghost-light !h-9 !px-4 !text-[13px]">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Hall of Fame &amp; Videos
                </button>
              </div>
            </div>
          </div>

          {/* 1B. FotMob-Style Match Center (Fixtures & Results) */}
          <div className="league-card overflow-hidden">
            <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-5 rounded-full bg-[#ff6a17]" />
                <h2 className="text-[17px] font-extrabold text-slate-900 tracking-tight">
                  Match Center
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                {(['all', 'live', 'upcoming', 'completed'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setMatchFilter(f)}
                    className={`h-7 px-3 rounded-lg text-[12px] font-bold capitalize transition-colors cursor-pointer ${
                      matchFilter === f
                        ? 'bg-[#0b0f19] text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {f === 'completed' ? 'Results' : f}
                  </button>
                ))}
                <button
                  onClick={() => go('fixtures')}
                  className="ml-2 text-[12px] font-bold text-[#ff6a17] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Full Schedule</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredMatches.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                  No matches in this filter.
                </div>
              ) : (
                filteredMatches.map(m => {
                  const a = teamById(m.teamAId);
                  const b = teamById(m.teamBId);
                  const isLive = m.status === 'live' || m.status === 'innings_break';
                  const isDone = m.status === 'completed';

                  const scoreA =
                    m.innings1?.battingTeamId === a?.id
                      ? m.innings1
                      : m.innings2?.battingTeamId === a?.id
                      ? m.innings2
                      : undefined;
                  const scoreB =
                    m.innings1?.battingTeamId === b?.id
                      ? m.innings1
                      : m.innings2?.battingTeamId === b?.id
                      ? m.innings2
                      : undefined;

                  return (
                    <div
                      key={m.id}
                      onClick={() => openMatch(m)}
                      className="px-4 sm:px-5 py-3.5 hover:bg-slate-50/90 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      {/* Left: Stage & Date */}
                      <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0.5 sm:w-32 shrink-0">
                        <div className="flex items-center gap-1.5">
                          {isLive ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                              LIVE
                            </span>
                          ) : isDone ? (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                              RESULT
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold uppercase">
                              {m.date} · {m.time}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[125px]">
                          {m.stage}
                        </span>
                      </div>

                      {/* Center: Teams & Scores */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 items-center">
                        {/* Team A */}
                        <div className="flex items-center justify-between sm:justify-start gap-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 text-white shadow-2xs"
                              style={{ backgroundColor: a?.primaryColor || '#0f172a' }}
                            >
                              {a?.logo || '🏏'}
                            </span>
                            <span
                              className={`text-[14px] font-bold truncate ${
                                m.winnerTeamId === a?.id ? 'text-slate-950' : 'text-slate-700'
                              }`}
                            >
                              {a?.shortName || a?.name || 'Team A'}
                            </span>
                          </div>
                          {scoreA && (
                            <span className="font-mono text-[13px] font-extrabold text-slate-900 sm:ml-auto">
                              {scoreA.totalRuns}/{scoreA.totalWickets}{' '}
                              <span className="text-[11px] font-normal text-slate-400">
                                ({scoreA.oversCompletedStr})
                              </span>
                            </span>
                          )}
                        </div>

                        {/* Team B */}
                        <div className="flex items-center justify-between sm:justify-start gap-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 text-white shadow-2xs"
                              style={{ backgroundColor: b?.primaryColor || '#0f172a' }}
                            >
                              {b?.logo || '🏏'}
                            </span>
                            <span
                              className={`text-[14px] font-bold truncate ${
                                m.winnerTeamId === b?.id ? 'text-slate-950' : 'text-slate-700'
                              }`}
                            >
                              {b?.shortName || b?.name || 'Team B'}
                            </span>
                          </div>
                          {scoreB && (
                            <span className="font-mono text-[13px] font-extrabold text-slate-900 sm:ml-auto">
                              {scoreB.totalRuns}/{scoreB.totalWickets}{' '}
                              <span className="text-[11px] font-normal text-slate-400">
                                ({scoreB.oversCompletedStr})
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Result note or Venue + Arrow */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-44 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-[11px] font-semibold text-emerald-700 truncate max-w-[140px]">
                          {m.winMargin || m.venue}
                        </span>
                        <span className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#0b0f19] hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLUMNS: Captain Quick-Management + Mini Standings + Cap Leaders */}
        <div className="lg:col-span-4 space-y-5">
          {/* 2A. Captain & Squad Quick-Management Portal */}
          <div className="league-card overflow-hidden border-2 border-[#0b0f19]">
            <div className="bg-[#0b0f19] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#ff6a17]" />
                <span className="text-[13px] font-extrabold uppercase tracking-wider">
                  Team Captain Portal
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Cloud Sync Active
              </span>
            </div>

            {myClub ? (
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: myClub.primaryColor || '#0b0f19' }}
                  >
                    {myClub.logo || '🏏'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold uppercase text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Logged In as Captain
                    </div>
                    <div className="text-[16px] font-extrabold text-slate-900 truncate">
                      {myClub.name}
                    </div>
                    <div className="text-[12px] text-slate-500">
                      {myClub.players.length} Players · {myClub.players.filter(p => p.isAuthenticated).length} Verified
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => go('teams')}
                    className="col-span-2 rally-btn rally-btn-primary !h-9 !text-[13px] w-full"
                  >
                    <Camera className="w-4 h-4" />
                    Manage Squad &amp; Upload Photos
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  Select your club below and enter your 4-digit Captain PIN to upload squad photos, add players, and verify your roster.
                </p>

                <div className="space-y-2">
                  <select
                    value={quickLoginTeamId}
                    onChange={e => setQuickLoginTeamId(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] font-bold text-slate-900 focus:outline-none focus:border-[#ff6a17]"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.logo} {t.name} ({t.code})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => openAuthModal(quickLoginTeamId)}
                    className="rally-btn rally-btn-primary !h-9 !text-[13px] w-full"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Unlock Team Roster with PIN
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2B. Live Group Standings Widget */}
          <div className="league-card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h3 className="text-[15px] font-extrabold text-slate-900">Standings</h3>
              </div>
              <button
                onClick={() => go('standings')}
                className="text-[12px] font-bold text-[#ff6a17] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Full Table</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Group Selector Tabs */}
            <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-1 overflow-x-auto no-scrollbar bg-white">
              {groups.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGroupTab(g)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors shrink-0 cursor-pointer ${
                    selectedGroupTab === g
                      ? 'bg-[#0b0f19] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Compact Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400">
                    <th className="py-2 pl-3 pr-1">#</th>
                    <th className="py-2 px-2">Club</th>
                    <th className="py-2 px-1.5 text-center">P</th>
                    <th className="py-2 px-1.5 text-center">W</th>
                    <th className="py-2 px-1.5 text-right">NRR</th>
                    <th className="py-2 pl-1.5 pr-3 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {miniStandings.map((row, idx) => (
                    <tr
                      key={row.teamId}
                      onClick={() => go('standings')}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-2 pl-3 pr-1 font-mono font-bold text-slate-500">
                        <span
                          className={`inline-flex w-4 h-4 rounded-full items-center justify-center text-[10px] ${
                            idx < 2 ? 'bg-emerald-500/15 text-emerald-700 font-extrabold' : ''
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-bold text-slate-900 truncate max-w-[130px]">
                        <span className="mr-1.5">{row.teamLogo}</span>
                        {row.teamCode}
                      </td>
                      <td className="py-2 px-1.5 text-center font-mono text-slate-600">{row.played}</td>
                      <td className="py-2 px-1.5 text-center font-mono text-emerald-700 font-bold">{row.won}</td>
                      <td className="py-2 px-1.5 text-right font-mono text-slate-500">
                        {row.nrr >= 0 ? `+${row.nrr.toFixed(2)}` : row.nrr.toFixed(2)}
                      </td>
                      <td className="py-2 pl-1.5 pr-3 text-right font-mono font-extrabold text-slate-950">
                        {row.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2C. Orange Cap & Purple Cap Leaders Widget */}
          <div className="league-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#ff6a17]" />
                <h3 className="text-[15px] font-extrabold text-slate-900">Cap Leaders</h3>
              </div>
              <button
                onClick={() => go('stats')}
                className="text-[12px] font-bold text-[#ff6a17] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>All Stats</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Orange Cap */}
              {orangeLeader && (
                <div
                  onClick={() => go('stats')}
                  className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50/40 border border-orange-200/80 cursor-pointer hover:border-orange-400 transition-colors"
                >
                  <span className="px-2 py-0.5 rounded bg-[#ff6a17] text-white text-[9px] font-black uppercase tracking-wider">
                    🧢 Orange Cap
                  </span>
                  <div className="mt-2 font-extrabold text-[13px] text-slate-900 truncate">
                    {orangeLeader.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{orangeLeader.teamCode}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[22px] font-black font-mono text-[#ea580c] leading-none">
                      {orangeLeader.runsScored}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Runs</span>
                  </div>
                </div>
              )}

              {/* Purple Cap */}
              {purpleLeader && (
                <div
                  onClick={() => go('stats')}
                  className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50/40 border border-purple-200/80 cursor-pointer hover:border-purple-400 transition-colors"
                >
                  <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[9px] font-black uppercase tracking-wider">
                    🧢 Purple Cap
                  </span>
                  <div className="mt-2 font-extrabold text-[13px] text-slate-900 truncate">
                    {purpleLeader.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{purpleLeader.teamCode}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[22px] font-black font-mono text-purple-700 leading-none">
                      {purpleLeader.wicketsTaken}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Wkts</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          ROW 2: COMPACT CLUB DIRECTORY (8 CLUBS IN 4-COLUMN GRID)
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="league-card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-emerald-500" />
              <h2 className="text-[19px] font-extrabold text-slate-900 tracking-tight">
                Participating Clubs &amp; Squads
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold">
                {teams.length} Teams
              </span>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Click any club to view player profiles, digital IDs, or upload your official team photo.
            </p>
          </div>

          <button
            onClick={() => go('teams')}
            className="rally-btn rally-btn-dark !h-9 !px-4 !text-[13px]"
          >
            <span>View All {teams.length} Clubs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {featuredTeams.map(t => {
            const captain = t.players.find(p => p.isCaptain || p.id === t.captainId);
            const verifiedCount = t.players.filter(p => p.isAuthenticated).length;
            const img = t.teamPhotoUrl || t.bannerUrl;
            const isChamp = latest && (t.id === latest.championTeamId || t.name === latest.championTeamName);

            return (
              <div
                key={t.id}
                onClick={() => go('teams')}
                className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                {/* Team Color Top Accent Strip */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: t.primaryColor || '#ff6a17' }}
                />

                {/* Compact 16:9 Thumbnail */}
                <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      onError={e => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${t.primaryColor || '#1e293b'}, #0f172a)`,
                      }}
                    >
                      <span className="text-4xl">{t.logo || '🏏'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {isChamp && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                      🏆 Champion
                    </span>
                  )}

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between gap-2 text-white">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base shrink-0">{t.logo || '🏏'}</span>
                      <span className="font-extrabold text-[14px] truncate leading-tight">
                        {t.name}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-black/50 text-[10px] font-mono font-bold text-amber-300 shrink-0">
                      {t.code}
                    </span>
                  </div>
                </div>

                {/* Compact Meta Footer */}
                <div className="p-2.5 bg-slate-50/70 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="truncate font-semibold">
                    Capt: {captain ? captain.name : t.managerName || 'Assigned'}
                  </span>
                  <span className="font-mono font-bold text-emerald-700 shrink-0">
                    {verifiedCount}/{t.players.length} ID
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          ROW 3: CHAMPIONSHIP HALL OF FAME (2022–2026 ARCHIVE & MEDIA)
          ═══════════════════════════════════════════════════════════════════ */}
      {seasons.length > 0 && (
        <section className="rounded-2xl bg-[#0b0f19] text-white p-5 sm:p-6 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[18px] font-extrabold text-white leading-tight">
                  Championship Wall of Fame (2022 – 2026)
                </h2>
                <p className="text-[12px] text-slate-400">
                  Five seasons of champions, presentation ceremony photos, and Grand Final video highlights.
                </p>
              </div>
            </div>

            <button
              onClick={() => go('halloffame')}
              className="rally-btn rally-btn-primary !h-9 !px-4 !text-[13px]"
            >
              <span>Open Hall of Fame &amp; Gallery</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {seasons.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => go('halloffame')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  idx === 0
                    ? 'bg-gradient-to-br from-amber-500/20 to-white/[0.03] border-amber-400/50 hover:border-amber-400'
                    : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[22px] font-black text-amber-400 leading-none">
                    {s.year}
                  </span>
                  <span className="text-lg">{s.championLogo || '🏆'}</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Champion
                  </div>
                  <div className="text-[14px] font-extrabold text-white truncate mt-0.5">
                    {s.championTeamName}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    Runner-Up: {s.runnerUpTeamName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
