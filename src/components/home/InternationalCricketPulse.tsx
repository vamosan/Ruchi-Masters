import React, { useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, RefreshCw, Globe, Newspaper } from 'lucide-react';

interface FeedItem {
  title: string;
  description: string;
  link: string;
  pubDate?: string;
  source: 'ESPNcricinfo' | 'Cricbuzz';
}

function parseBrowserXml(xml: string, source: 'ESPNcricinfo' | 'Cricbuzz', max = 4): FeedItem[] {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const nodes = Array.from(doc.querySelectorAll('item')).slice(0, max);
    return nodes
      .map(node => {
        const rawTitle = (node.querySelector('title')?.textContent || '')
          .replace(/\s*-\s*Cricbuzz(\.com)?$/i, '')
          .trim();
        const rawDesc = (node.querySelector('description')?.textContent || '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const guid = (node.querySelector('guid')?.textContent || '').trim();
        const rawLink = (node.querySelector('link')?.textContent || '').trim();
        const link = (guid.startsWith('http') ? guid : rawLink) || rawLink;
        const pubRaw = node.querySelector('pubDate')?.textContent || '';
        const pubDate = pubRaw ? new Date(pubRaw).toLocaleDateString() : 'Latest';
        return {
          title: rawTitle,
          description: rawDesc,
          link,
          pubDate,
          source,
        };
      })
      .filter(i => i.title && i.link.startsWith('http'));
  } catch {
    return [];
  }
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

export const InternationalCricketPulse: React.FC = () => {
  const [scores, setScores] = useState<FeedItem[]>(FALLBACK_SCORES);
  const [news, setNews] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLiveFeed, setIsLiveFeed] = useState<boolean>(false);

  const fetchInternationalFeeds = useCallback(async () => {
    setLoading(true);
    let loadedScores: FeedItem[] = [];
    let loadedNews: FeedItem[] = [];

    // 1. Try our Cloudflare Pages Edge Function (/api/cricket-feed) safely
    try {
      const edgeRes = await fetch('/api/cricket-feed');
      const contentType = edgeRes.headers.get('content-type') || '';
      if (edgeRes.ok && contentType.includes('application/json')) {
        const data = await edgeRes.json();
        if (Array.isArray(data.scores) && data.scores.length > 0) {
          loadedScores = data.scores.slice(0, 4);
        }
        if (Array.isArray(data.news) && data.news.length > 0) {
          loadedNews = data.news.slice(0, 4);
        }
      }
    } catch {
      // Proceed to browser RSS fetchers
    }

    // 2. If Edge API didn't return items (e.g. local dev or static preview), fetch via rss2json
    if (loadedScores.length === 0 || loadedNews.length === 0) {
      try {
        const [scoresRss, cricinfoNewsRss, cricbuzzNewsRss] = await Promise.allSettled([
          fetch(
            'https://api.rss2json.com/v1/api.json?rss_url=' +
              encodeURIComponent('https://static.cricinfo.com/rss/livescores.xml')
          ),
          fetch(
            'https://api.rss2json.com/v1/api.json?rss_url=' +
              encodeURIComponent('https://www.espncricinfo.com/rss/content/story/feeds/0.xml')
          ),
          fetch(
            'https://api.rss2json.com/v1/api.json?rss_url=' +
              encodeURIComponent(
                'https://news.google.com/rss/search?q=site:cricbuzz.com+cricket&hl=en-US&gl=US&ceid=US:en'
              )
          ),
        ]);

        if (loadedScores.length === 0 && scoresRss.status === 'fulfilled' && scoresRss.value.ok) {
          const sJson = await scoresRss.value.json();
          if (Array.isArray(sJson.items) && sJson.items.length > 0) {
            loadedScores = sJson.items.slice(0, 4).map((item: any) => ({
              title: String(item.title || '').replace(/&amp;/g, '&'),
              description:
                String(item.description || '')
                  .replace(/<[^>]+>/g, '')
                  .trim() || 'Live International Scorecard',
              link:
                (item.guid && String(item.guid).startsWith('http') ? item.guid : item.link) ||
                'https://www.espncricinfo.com/live-cricket-score',
              source: 'ESPNcricinfo',
            }));
          }
        }

        if (loadedNews.length === 0) {
          const ciItems: FeedItem[] = [];
          const cbItems: FeedItem[] = [];

          if (cricinfoNewsRss.status === 'fulfilled' && cricinfoNewsRss.value.ok) {
            const nJson = await cricinfoNewsRss.value.json();
            if (Array.isArray(nJson.items)) {
              nJson.items.slice(0, 4).forEach((item: any) => {
                const exactLink =
                  item.guid && String(item.guid).startsWith('http') ? item.guid : item.link;
                if (item.title && exactLink) {
                  ciItems.push({
                    title: String(item.title).replace(/&amp;/g, '&'),
                    description: String(item.description || '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim(),
                    link: exactLink,
                    pubDate: item.pubDate
                      ? new Date(item.pubDate).toLocaleDateString()
                      : 'Latest',
                    source: 'ESPNcricinfo',
                  });
                }
              });
            }
          }

          if (cricbuzzNewsRss.status === 'fulfilled' && cricbuzzNewsRss.value.ok) {
            const cbJson = await cricbuzzNewsRss.value.json();
            if (Array.isArray(cbJson.items)) {
              cbJson.items.slice(0, 4).forEach((item: any) => {
                const exactLink = item.link || item.guid;
                if (item.title && exactLink) {
                  cbItems.push({
                    title: String(item.title)
                      .replace(/\s*-\s*Cricbuzz(\.com)?$/i, '')
                      .replace(/&amp;/g, '&'),
                    description: String(item.description || '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim(),
                    link: exactLink,
                    pubDate: item.pubDate
                      ? new Date(item.pubDate).toLocaleDateString()
                      : 'Latest',
                    source: 'Cricbuzz',
                  });
                }
              });
            }
          }

          // Interleave real ESPNcricinfo & Cricbuzz articles with their exact article URLs
          for (let i = 0; i < 4; i++) {
            if (ciItems[i]) loadedNews.push(ciItems[i]);
            if (cbItems[i]) loadedNews.push(cbItems[i]);
          }
          loadedNews = loadedNews.slice(0, 4);
        }
      } catch {
        // Proceed to backup XML proxy
      }
    }

    // 3. Secondary CORS proxy fallback (allorigins) if rss2json was blocked
    if (loadedNews.length === 0) {
      try {
        const proxyRes = await fetch(
          'https://api.allorigins.win/get?url=' +
            encodeURIComponent('https://www.espncricinfo.com/rss/content/story/feeds/0.xml')
        );
        if (proxyRes.ok) {
          const proxyJson = await proxyRes.json();
          if (proxyJson.contents) {
            loadedNews = parseBrowserXml(proxyJson.contents, 'ESPNcricinfo', 4);
          }
        }
      } catch {
        // Ignore
      }
    }

    if (loadedScores.length > 0) {
      setScores(loadedScores);
      setIsLiveFeed(true);
    }
    if (loadedNews.length > 0) {
      setNews(loadedNews);
      setIsLiveFeed(true);
    }
    setLoading(false);
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
                {isLiveFeed
                  ? 'Live Syndication · Direct Article Links'
                  : 'Global Cricket Pulse · ESPNcricinfo & Cricbuzz'}
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
          {news.length > 0
            ? news.slice(0, 4).map((story, idx) => (
                <a
                  key={story.link + idx}
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
                        <span className="text-[10px] text-[#9a9595] font-mono">
                          {story.pubDate}
                        </span>
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
                    <span>Read full story on {story.source}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))
            : [0, 1, 2, 3].map(idx => (
                <div
                  key={idx}
                  className="rounded-[6px] bg-white border border-[#090909]/12 p-4 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="h-3 w-24 bg-[#090909]/10 rounded animate-pulse mb-2.5" />
                    <div className="h-4 w-full bg-[#090909]/10 rounded animate-pulse mb-1.5" />
                    <div className="h-4 w-3/4 bg-[#090909]/10 rounded animate-pulse" />
                  </div>
                  <div className="pt-2 border-t border-[#090909]/10 h-4 w-32 bg-[#090909]/10 rounded animate-pulse" />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};
