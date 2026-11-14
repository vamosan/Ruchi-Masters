import React, { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Plus, Minus, Play } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Match, Team } from '../../types/cricket';

const HERO_IMG =
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=2000&q=80';
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80';

const SectionHead: React.FC<{
  title: string;
  linkLabel?: string;
  onLink?: () => void;
  dark?: boolean;
}> = ({ title, linkLabel, onLink, dark }) => (
  <div className="flex items-end justify-between gap-6 mb-10 sm:mb-14">
    <h2 className={`rally-h2 text-[40px] sm:text-[56px] lg:text-[64px] ${dark ? 'text-[#f6f4f4]' : 'text-[#090909]'}`}>
      {title}
    </h2>
    {linkLabel && onLink && (
      <button
        onClick={onLink}
        className={`rally-link-arrow shrink-0 mb-2 ${dark ? 'text-[#f6f4f4]' : 'text-[#090909]'} hover:text-[#ff6a17] transition-colors`}
      >
        {linkLabel}
        <ArrowUpRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

const TeamMark: React.FC<{ team?: Team; size?: 'sm' | 'md' }> = ({ team, size = 'sm' }) => {
  const dim = size === 'sm' ? 'w-9 h-9 text-base' : 'w-12 h-12 text-xl';
  return (
    <span
      className={`${dim} rounded-full flex items-center justify-center shrink-0 border border-black/10`}
      style={{ backgroundColor: (team?.primaryColor || '#2c2727') + '22' }}
    >
      {team?.logo || '🏏'}
    </span>
  );
};

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
    a: 'T20 cricket — 20 overs a side, 4 overs max per bowler and a 6-over powerplay. Teams play a group stage, and the best sides advance into knockout rounds that end in the Grand Final.',
  },
  {
    q: 'Who can take part?',
    a: 'Registered clubs and franchises from Frankfurt and the wider Rhein-Main region. Every player is verified by their team captain before they can be named in a playing XI.',
  },
  {
    q: 'Where are matches played?',
    a: 'Fixtures are played at grounds around Frankfurt, Germany. The exact venue for each match is listed in the schedule.',
  },
  {
    q: 'How do I follow a match live?',
    a: 'Open Live Scores for ball-by-ball scoring, the current partnership and the full scorecard. Standings and the cap races update automatically when a match finishes.',
  },
  {
    q: 'How do captains manage their squad?',
    a: 'Use Team Login with your team PIN. From there you can update the squad photo, add players, upload player photos and verify your roster.',
  },
];

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

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const go = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const teamById = (id?: string) => teams.find(t => t.id === id);

  const schedule = useMemo(() => {
    const rank = (m: Match) =>
      m.status === 'live' || m.status === 'innings_break' ? 0 :
      m.status === 'toss' ? 1 :
      m.status === 'scheduled' ? 2 : 3;
    return [...matches].sort((a, b) => rank(a) - rank(b) || a.matchNumber - b.matchNumber).slice(0, 5);
  }, [matches]);

  const seasons = useMemo(() => [...hallOfFame].sort((a, b) => a.year - b.year), [hallOfFame]);
  const latest = useMemo(() => [...hallOfFame].sort((a, b) => b.year - a.year)[0], [hallOfFame]);

  const featuredTeams = useMemo(() => {
    const champ = latest ? teams.find(t => t.id === latest.championTeamId || t.name === latest.championTeamName) : undefined;
    const rest = teams.filter(t => t.id !== champ?.id);
    const withPhoto = rest.filter(t => t.teamPhotoUrl || t.bannerUrl);
    const withoutPhoto = rest.filter(t => !(t.teamPhotoUrl || t.bannerUrl));
    return [champ, ...withPhoto, ...withoutPhoto].filter(Boolean).slice(0, 6) as Team[];
  }, [teams, latest]);

  const gallery = useMemo(() => {
    if (!latest) return [];
    const imgs = (latest.media || []).filter(m => m.type === 'image').map(m => ({ url: m.url, title: m.title }));
    const lead = latest.trophyPhotoUrl ? [{ url: latest.trophyPhotoUrl, title: latest.editionName }] : [];
    const all = [...lead, ...imgs];
    const seen = new Set<string>();
    return all.filter(i => (seen.has(i.url) ? false : (seen.add(i.url), true))).slice(0, 5);
  }, [latest]);

  const latestVideo = latest?.media?.find(m => m.type === 'video' && /youtu/.test(m.url));

  const totalPlayers = teams.reduce((n, t) => n + (t.players?.length || 0), 0);
  const editionNo = hallOfFame.length || 5;

  const openMatch = (m: Match) => {
    setActiveMatchId(m.id);
    go(m.status === 'scheduled' ? 'fixtures' : 'live');
  };

  return (
    <div className="bg-[#f6f4f4] text-[#090909]">
      {/* ───────────── HERO ───────────── */}
      <section className="relative bg-[#090909] text-[#f6f4f4] overflow-hidden">
        <img
          src={tournament.bannerImage && !tournament.bannerImage.includes('1540747913346') ? tournament.bannerImage : HERO_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-45"
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/60 to-[#090909]/30" />

        <div className="relative max-w-[1320px] mx-auto px-5 sm:px-8 pt-24 sm:pt-32 lg:pt-40 pb-10 min-h-[calc(100svh-72px)] flex flex-col">
          <div className="rally-eyebrow text-[#f6f4f4]/70 rally-rise">
            Season {String(editionNo).padStart(2, '0')} · {tournament.format || 'T20'} · Frankfurt, Germany
          </div>

          <h1 className="rally-display mt-6 text-[56px] sm:text-[96px] lg:text-[136px] max-w-[11ch] rally-rise rally-rise-1">
            Where every run is a fight
          </h1>

          <p className="mt-8 max-w-[520px] text-[17px] leading-relaxed text-[#f6f4f4]/70 rally-rise rally-rise-2">
            Frankfurt’s most competitive T20 league — {teams.length} clubs, one trophy. Follow every
            ball live, track the standings, and relive five seasons of champions.
          </p>

          <div className="mt-10 flex flex-wrap gap-3 rally-rise rally-rise-3">
            <button onClick={() => go('fixtures')} className="rally-btn rally-btn-primary">
              View Schedule
            </button>
            <button
              onClick={() => (currentUser.role === 'spectator' ? openAuthModal() : go('teams'))}
              className="rally-btn rally-btn-ghost-light"
            >
              {currentUser.role === 'spectator' ? 'Captain Login' : 'Manage Your Team'}
            </button>
          </div>

          <div className="mt-auto pt-20 grid grid-cols-2 sm:grid-cols-4 border-t border-white/15">
            {[
              { k: String(teams.length), v: 'Clubs' },
              { k: totalPlayers ? String(totalPlayers) : '600+', v: 'Players' },
              { k: String(tournament.rules?.oversPerInnings || 20), v: 'Overs a side' },
              { k: latest ? String(latest.year) : '2026', v: latest ? `Champions: ${latest.championTeamName}` : 'Season' },
            ].map((s, i) => (
              <div key={i} className={`pt-6 pr-4 ${i > 0 ? 'sm:pl-6 sm:border-l border-white/15' : ''} ${i === 2 ? 'border-t sm:border-t-0 border-white/15' : ''} ${i === 3 ? 'border-t sm:border-t-0 border-white/15 pl-6 border-l' : ''} ${i === 1 ? 'pl-6 border-l border-white/15' : ''}`}>
                <div className="text-[36px] sm:text-[44px] font-bold tracking-[-0.04em] leading-none">{s.k}</div>
                <div className="mt-2 text-[13px] text-[#f6f4f4]/55 truncate">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── ABOUT ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <h2 className="rally-h2 lg:col-span-6 text-[44px] sm:text-[64px]">
            Not your Sunday-afternoon friendly
          </h2>
          <div className="lg:col-span-6 lg:pt-3 space-y-6 text-[17px] leading-relaxed text-[#3e3939]">
            <p>
              Ruchi Masters is a {teams.length}-club T20 championship — a group stage that rewards consistency,
              then knockout cricket where one bad over sends you home. No second chances.
            </p>
            <p className="text-[#736e6e]">
              Now in its {editionNo === 5 ? 'fifth' : `${editionNo}th`} season, the tournament has grown into the
              region’s most-followed amateur cricket event — built for players who take the game seriously, and
              fans who want more than a scoreboard on a phone.
            </p>
            <button onClick={() => go('standings')} className="rally-link-arrow hover:text-[#ff6a17] transition-colors">
              See the standings <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────── SCHEDULE ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <SectionHead title="Schedule" linkLabel="Full schedule" onLink={() => go('fixtures')} />

        <div className="border-t border-[#090909]/15">
          {schedule.length === 0 && (
            <div className="py-10 text-[#736e6e]">Fixtures will be announced soon.</div>
          )}
          {schedule.map(m => {
            const a = teamById(m.teamAId);
            const b = teamById(m.teamBId);
            const live = m.status === 'live' || m.status === 'innings_break';
            const i1 = m.innings1;
            const i2 = m.innings2;
            return (
              <button
                key={m.id}
                onClick={() => openMatch(m)}
                className="group w-full text-left grid grid-cols-12 items-center gap-4 py-6 sm:py-7 border-b border-[#090909]/15 hover:bg-white/60 transition-colors"
              >
                <div className="col-span-12 sm:col-span-3 flex items-center gap-3 text-[15px] text-[#575252]">
                  {live && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff6a17] text-[#090909] text-[12px] font-bold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#090909]" /> Live
                    </span>
                  )}
                  <span>{m.date}{m.time ? ` · ${m.time}` : ''}</span>
                </div>

                <div className="col-span-12 sm:col-span-6 flex items-center gap-3 min-w-0">
                  <TeamMark team={a} />
                  <span className="text-[20px] sm:text-[24px] font-bold tracking-[-0.03em] truncate">
                    {a?.shortName || a?.name || 'TBD'}
                  </span>
                  <span className="text-[#9a9595] text-[15px] font-medium shrink-0">vs</span>
                  <span className="text-[20px] sm:text-[24px] font-bold tracking-[-0.03em] truncate">
                    {b?.shortName || b?.name || 'TBD'}
                  </span>
                  <TeamMark team={b} />
                </div>

                <div className="col-span-12 sm:col-span-3 flex items-center justify-between sm:justify-end gap-4">
                  <div className="sm:text-right">
                    <div className="text-[15px] font-medium">
                      {(i1 || i2) ? (
                        <span className="tabular-nums">
                          {i1 ? `${i1.totalRuns}/${i1.totalWickets}` : '—'}
                          <span className="text-[#9a9595]"> · </span>
                          {i2 ? `${i2.totalRuns}/${i2.totalWickets}` : '—'}
                        </span>
                      ) : statusLabel(m)}
                    </div>
                    <div className="text-[13px] text-[#736e6e] truncate max-w-[220px]">{m.venue}</div>
                  </div>
                  <span className="w-10 h-10 rounded-full border border-[#090909]/15 flex items-center justify-center shrink-0 group-hover:bg-[#090909] group-hover:text-[#f6f4f4] group-hover:border-[#090909] transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ───────────── ROLL OF HONOUR (dark) ───────────── */}
      {seasons.length > 0 && (
        <section className="bg-[#090909] text-[#f6f4f4]">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-24 sm:py-32">
            <SectionHead title="The road to the trophy" linkLabel="Hall of Fame" onLink={() => go('halloffame')} dark />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-white/15">
              {seasons.map((s, i) => {
                const isLatest = s.year === latest?.year;
                return (
                  <button
                    key={s.id}
                    onClick={() => go('halloffame')}
                    className={`text-left p-6 lg:p-7 border-b lg:border-b-0 border-white/15 ${i > 0 ? 'lg:border-l' : ''} ${i % 2 === 1 ? 'sm:border-l' : ''} hover:bg-white/[0.03] transition-colors flex flex-col min-h-[260px]`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#f6f4f4]/50">Season {String(i + 1).padStart(2, '0')}</span>
                      {isLatest && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6a17]">Latest</span>
                      )}
                    </div>
                    <div className={`mt-4 text-[56px] font-black tracking-[-0.05em] leading-none ${isLatest ? 'text-[#ff6a17]' : ''}`}>
                      {s.year}
                    </div>
                    <div className="mt-auto pt-10">
                      <div className="text-[12px] uppercase tracking-wider text-[#f6f4f4]/45">Champion</div>
                      <div className="mt-1 text-[19px] font-bold tracking-[-0.02em] leading-tight">{s.championTeamName}</div>
                      <div className="mt-3 text-[13px] text-[#f6f4f4]/50 leading-snug">
                        Beat {s.runnerUpTeamName}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── TEAMS ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <SectionHead title="Meet the competition" linkLabel={`All ${teams.length} teams`} onLink={() => go('teams')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
          {featuredTeams.map((t, i) => {
            const img = t.teamPhotoUrl || t.bannerUrl;
            const isChamp = i === 0 && latest && (t.id === latest.championTeamId || t.name === latest.championTeamName);
            return (
              <button key={t.id} onClick={() => go('teams')} className="group text-left">
                <div className="relative aspect-[4/5] rounded-[6px] overflow-hidden bg-[#2c2727]">
                  {img ? (
                    <img
                      src={img}
                      alt={t.name}
                      className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                      onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(160deg, ${t.primaryColor || '#2c2727'} 0%, #090909 85%)` }}
                    >
                      <span className="text-[96px] opacity-90">{t.logo}</span>
                    </div>
                  )}
                  {isChamp && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#ff6a17] text-[#090909] text-[12px] font-bold">
                      Defending Champion
                    </span>
                  )}
                  <span className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-[#f6f4f4] text-[#090909] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[22px] font-bold tracking-[-0.03em] truncate">{t.name}</div>
                    <div className="text-[14px] text-[#736e6e] mt-0.5">
                      {t.group || 'League'} · {t.players?.length || 0} players
                    </div>
                  </div>
                  <span className="text-[13px] font-medium text-[#9a9595] mt-1.5 shrink-0">{t.code}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ───────────── WATCH / COMPETE ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="relative rounded-[6px] overflow-hidden bg-[#090909] text-[#f6f4f4] p-8 sm:p-12 min-h-[420px] flex flex-col">
            <img src={FALLBACK_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090909] to-transparent" />
            <div className="relative rally-eyebrow text-[#f6f4f4]/60">Watch</div>
            <div className="relative mt-auto">
              <h3 className="rally-h2 text-[40px] sm:text-[52px] max-w-[12ch]">Every ball. Live.</h3>
              <p className="mt-4 text-[16px] text-[#f6f4f4]/65 max-w-sm">
                Ball-by-ball scoring, partnerships and full scorecards from every ground.
              </p>
              <button onClick={() => go('live')} className="rally-btn rally-btn-primary mt-8">Open Live Scores</button>
            </div>
          </div>

          <div className="relative rounded-[6px] overflow-hidden bg-[#ff6a17] text-[#090909] p-8 sm:p-12 min-h-[420px] flex flex-col">
            <div className="rally-eyebrow text-[#090909]/60">Or compete</div>
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full border-[28px] border-[#090909]/[0.06]" />
            <div className="relative mt-auto">
              <h3 className="rally-h2 text-[40px] sm:text-[52px] max-w-[12ch]">Captain? Run your squad.</h3>
              <p className="mt-4 text-[16px] text-[#090909]/70 max-w-sm">
                Upload your squad photo, add players and verify your roster with your team PIN.
              </p>
              <button
                onClick={() => (currentUser.role === 'spectator' ? openAuthModal() : go('teams'))}
                className="rally-btn rally-btn-dark mt-8"
              >
                {currentUser.role === 'spectator' ? 'Team Login' : 'Go to my team'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── LAST SEASON ───────────── */}
      {latest && gallery.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
          <SectionHead title="Last season" linkLabel="Full gallery" onLink={() => go('halloffame')} />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:auto-rows-[260px]">
            {gallery.map((g, i) => (
              <button
                key={g.url + i}
                onClick={() => go('halloffame')}
                className={`group relative rounded-[6px] overflow-hidden bg-[#2c2727] ${
                  i === 0 ? 'col-span-2 row-span-2 aspect-[4/3] lg:aspect-auto' : 'aspect-square lg:aspect-auto'
                }`}
              >
                <img
                  src={g.url}
                  alt={g.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#090909]/80 to-transparent text-left opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[14px] font-medium text-[#f6f4f4] line-clamp-1">{g.title}</span>
                </div>
              </button>
            ))}
            {latestVideo && (
              <button
                onClick={() => go('halloffame')}
                className="relative rounded-[6px] overflow-hidden bg-[#090909] text-[#f6f4f4] aspect-square lg:aspect-auto flex flex-col justify-between p-5 text-left group"
              >
                <span className="rally-eyebrow text-[#f6f4f4]/50">Highlights</span>
                <div>
                  <span className="w-12 h-12 rounded-full bg-[#ff6a17] text-[#090909] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </span>
                  <div className="mt-4 text-[17px] font-bold tracking-[-0.02em] leading-tight line-clamp-2">{latestVideo.title}</div>
                </div>
              </button>
            )}
          </div>
        </section>
      )}

      {/* ───────────── FAQ ───────────── */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <div className="grid lg:grid-cols-12 gap-10">
          <h2 className="rally-h2 lg:col-span-5 text-[40px] sm:text-[56px] lg:text-[64px]">Frequently asked</h2>
          <div className="lg:col-span-7 border-t border-[#090909]/15">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="border-b border-[#090909]/15">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-[19px] sm:text-[21px] font-bold tracking-[-0.02em]">{f.q}</span>
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${open ? 'bg-[#ff6a17]' : 'bg-[#090909]/[0.06]'}`}>
                      {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="pb-6 pr-14 text-[16px] leading-relaxed text-[#575252]">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
