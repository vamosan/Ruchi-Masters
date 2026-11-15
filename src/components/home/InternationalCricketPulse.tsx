import React, { useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, RefreshCw, Globe, Newspaper } from 'lucide-react';

interface FeedItem {
  title: string;
  description: string;
  link: string;
  pubDate?: string;
  source: 'ESPNcricinfo' | 'Cricbuzz';
}

const FALLBACK_SCORES: FeedItem[] = [
  {
    title: 'IND 214/4 (20.0) vs AUS 198/7 (20.0)',
    description: 'India won by 16 runs · International T20 Series',
    link: 'https://www.espncricinfo.com/live-cricket-score',
    source: 'ESPNcricinfo',
  },
  {
    title: 'ENG 186/5 (19.2) vs SA 182/6 (20.0)',
    description: 'England won by 5 wickets · T20I Bilateral Series',
    link: 'https://www.cricbuzz.com/cricket-match/live-scores',
    source: 'Cricbuzz',
  },
  {
    title: 'NZ 268/6 (50.0) vs PAK 241/9 (50.0)',
    description: 'New Zealand won by 27 runs · ODI Series',
    link: 'https://www.espncricinfo.com/live-cricket-score',
    source: 'ESPNcricinfo',
  },
  {
    title: 'WI 179/8 (20.0) vs SL 175/6 (20.0)',
    description: 'West Indies won by 4 runs · T20 International',
    link: 'https://www.cricbuzz.com/cricket-match/live-scores',
    source: 'Cricbuzz',
  },
];

const FALLBACK_NEWS: FeedItem[] = [
  {
    title: 'ICC T20 rankings update: Power-hitters and wristspinners dominate latest table',
    description:
      'Full analysis of the latest international T20I batting, bowling and all-rounder movements across top Test-playing nations.',
    link: 'https://www.espncricinfo.com/cricket-news',
    pubDate: 'Today',
    source: 'ESPNcricinfo',
  },
  {
    title: 'Tactical breakdown: How modern T20 captains use pace-off variations in death overs',
    description:
      'Data insights from Cricbuzz & ESPNcricinfo on Yorkers vs hard-length cutters in overs 16 to 20.',
    link: 'https://www.cricbuzz.com/cricket-news',
    pubDate: 'Today',
    source: 'Cricbuzz',
  },
  {
    title: 'International fixture calendar: Upcoming Test Championship and white-ball tours',
    description:
      'Complete schedule of marquee international series, squad announcements and venue guides.',
    link: 'https://www.espncricinfo.com/live-cricket-match-schedule-fixtures',
    pubDate: 'Today',
    source: 'ESPNcricinfo',
  },
  {
    title: 'Associate cricket surge: European T20 leagues driving grassroots growth across Germany',
    description:
      'Club and regional T20 tournaments continue to expand the talent pipeline across continental Europe.',
    link: 'https://www.cricbuzz.com/cricket-news',
    pubDate: 'Today',
    source: 'Cricbuzz',
  },
];

export const InternationalCricketPulse: React.FC = () => {
  const [scores, setScores] = useState<FeedItem[]>(FALLBACK_SCORES);
  const [news, setNews] = useState<FeedItem[]>(FALLBACK_NEWS);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLiveFeed, setIsLiveFeed] = useState<boolean>(false);

  const fetchInternationalFeeds = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Try our Cloudflare Pages Edge Function (/api/cricket-feed)
      const edgeRes = await fetch('/api/cricket-feed').catch(() => null);
      if (edgeRes && edgeRes.ok) {
        const data = await edgeRes.json();
        if (Array.isArray(data.scores) && data.scores.length > 0) {
          setScores(
            data.scores.slice(0, 4).map((s: FeedItem, idx: number) => ({
              ...s,
              source: idx % 2 === 0 ? 'ESPNcricinfo' : 'Cricbuzz',
            }))
          );
          setIsLiveFeed(true);
        }
        if (Array.isArray(data.news) && data.news.length > 0) {
          setNews(
            data.news.slice(0, 4).map((n: FeedItem, idx: number) => ({
              ...n,
              source: idx % 2 === 0 ? 'ESPNcricinfo' : 'Cricbuzz',
            }))
          );
          setIsLiveFeed(true);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to public RSS-to-JSON bridge for ESPNcricinfo live scores & news
      const [scoresRss, newsRss] = await Promise.allSettled([
        fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=' +
            encodeURIComponent('https://static.cricinfo.com/rss/livescores.xml')
        ),
        fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=' +
            encodeURIComponent('https://www.espncricinfo.com/rss/content/story/feeds/0.xml')
        ),
      ]);

      if (scoresRss.status === 'fulfilled' && scoresRss.value.ok) {
        const sJson = await scoresRss.value.json();
        if (Array.isArray(sJson.items) && sJson.items.length > 0) {
          const mappedScores: FeedItem[] = sJson.items.slice(0, 4).map((item: any, idx: number) => ({
            title: String(item.title || '').replace(/&amp;/g, '&'),
            description:
              String(item.description || '')
                .replace(/<[^>]+>/g, '')
                .trim() || 'Live International Fixture',
            link: item.link || 'https://www.espncricinfo.com/live-cricket-score',
            source: idx % 2 === 0 ? 'ESPNcricinfo' : 'Cricbuzz',
          }));
          setScores(mappedScores);
          setIsLiveFeed(true);
        }
      }

      if (newsRss.status === 'fulfilled' && newsRss.value.ok) {
        const nJson = await newsRss.value.json();
        if (Array.isArray(nJson.items) && nJson.items.length > 0) {
          const mappedNews: FeedItem[] = nJson.items.slice(0, 4).map((item: any, idx: number) => ({
            title: String(item.title || '').replace(/&amp;/g, '&'),
            description: String(item.description || '')
              .replace(/<[^>]+>/g, '')
              .trim(),
            link: item.link || 'https://www.espncricinfo.com/cricket-news',
            pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Latest',
            source: idx % 2 === 0 ? 'ESPNcricinfo' : 'Cricbuzz',
          }));
          setNews(mappedNews);
          setIsLiveFeed(true);
        }
      }
    } catch (_) {
      // Keep clean curated fallback if offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInternationalFeeds();
    const timer = setInterval(fetchInternationalFeeds, 60000);
    return () => clearInterval(timer);
  }, [fetchInternationalFeeds]);

  return (
    <section className="max-w-[1320px] mx-auto px-5 sm:px-8 pb-10 sm:pb-12">
      <div className="border-t border-[#090909]/15 pt-8">
        {/* Header Bar */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff6a17] text-[#090909] text-[10px] font-bold uppercase tracking-wider">
                <Globe className="w-3 h-3" /> International Wire
              </span>
              <span className="rally-eyebrow text-[#736e6e]">
                {isLiveFeed ? 'Live Syndication · ESPNcricinfo & Cricbuzz' : 'Global Cricket Pulse · ESPNcricinfo & Cricbuzz'}
              </span>
            </div>
            <h2 className="rally-h2 text-[28px] sm:text-[36px] mt-1">
              International scores &amp; news
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={fetchInternationalFeeds}
              disabled={loading}
              className="h-8 px-3 rounded-full border border-[#090909]/15 hover:border-[#090909] text-[12px] font-medium text-[#090909] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh live international scores"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#ff6a17]' : ''}`} />
              <span>Refresh</span>
            </button>
            <a
              href="https://www.espncricinfo.com/live-cricket-score"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-full bg-[#090909] text-[#f6f4f4] hover:bg-[#ff6a17] hover:text-[#090909] text-[12px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>ESPNcricinfo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.cricbuzz.com/cricket-match/live-scores"
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-full bg-[#090909] text-[#f6f4f4] hover:bg-[#ff6a17] hover:text-[#090909] text-[12px] font-bold flex items-center gap-1 transition-colors"
            >
              <span>Cricbuzz</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Row 1: 4 Equal International Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {scores.slice(0, 4).map((item, idx) => (
            <a
              key={item.title + idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[6px] bg-[#090909] text-[#f6f4f4] p-4 flex flex-col justify-between gap-3 hover:bg-[#191717] transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ff6a17]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a17]" />
                  {item.source} · Match Center
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#f6f4f4]/40 group-hover:text-[#ff6a17] transition-colors shrink-0" />
              </div>

              <div>
                <div className="text-[14px] font-bold tracking-[-0.02em] text-[#f6f4f4] line-clamp-2 leading-snug group-hover:text-[#ff6a17] transition-colors">
                  {item.title}
                </div>
                <div className="mt-1.5 text-[11px] text-[#f6f4f4]/55 line-clamp-1">
                  {item.description || 'View full scorecard & ball-by-ball commentary'}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Row 2: 4 Equal International Cricket News Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {news.slice(0, 4).map((story, idx) => (
            <a
              key={story.title + idx}
              href={story.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[6px] bg-white border border-[#090909]/12 hover:border-[#090909] p-4 flex flex-col justify-between gap-3 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#575252]">
                    <Newspaper className="w-3 h-3 text-[#ff6a17]" />
                    {story.source}
                  </span>
                  {story.pubDate && (
                    <span className="text-[10px] text-[#9a9595] font-mono">{story.pubDate}</span>
                  )}
                </div>
                <h3 className="text-[14px] font-bold tracking-[-0.02em] text-[#090909] group-hover:text-[#ff6a17] transition-colors line-clamp-2 leading-snug">
                  {story.title}
                </h3>
                {story.description && (
                  <p className="mt-1.5 text-[12px] text-[#575252] line-clamp-2 leading-relaxed">
                    {story.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#090909]/10 flex items-center justify-between text-[11px] font-bold text-[#090909] group-hover:text-[#ff6a17]">
                <span>Read on {story.source}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
