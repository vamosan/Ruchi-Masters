// Cloudflare Pages Function: /api/cricket-feed
// Fetches live international cricket scores and news from ESPNcricinfo & Cricbuzz RSS feeds.

function extractTag(xml: string, tag: string): string {
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const plainRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const plainMatch = xml.match(plainRegex);
  return plainMatch ? plainMatch[1].replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"').trim() : '';
}

function parseRssItems(xml: string, defaultSource: string, maxItems = 8) {
  const items: Array<{
    title: string;
    description: string;
    link: string;
    pubDate: string;
    source: string;
  }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null && items.length < maxItems) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const description = extractTag(block, 'description').replace(/<[^>]+>/g, '');
    const link = extractTag(block, 'link') || extractTag(block, 'guid');
    const pubDate = extractTag(block, 'pubDate');
    if (title) {
      items.push({
        title,
        description,
        link: link || 'https://www.espncricinfo.com/live-cricket-score',
        pubDate,
        source: defaultSource,
      });
    }
  }
  return items;
}

export const onRequestGet = async () => {
  try {
    const [scoresRes, newsRes] = await Promise.allSettled([
      fetch('https://static.cricinfo.com/rss/livescores.xml', {
        headers: { 'User-Agent': 'RuchiMastersCricketHub/1.0' },
      }),
      fetch('https://www.espncricinfo.com/rss/content/story/feeds/0.xml', {
        headers: { 'User-Agent': 'RuchiMastersCricketHub/1.0' },
      }),
    ]);

    const scoresXml =
      scoresRes.status === 'fulfilled' && scoresRes.value.ok
        ? await scoresRes.value.text()
        : '';
    const newsXml =
      newsRes.status === 'fulfilled' && newsRes.value.ok
        ? await newsRes.value.text()
        : '';

    const scores = scoresXml ? parseRssItems(scoresXml, 'ESPNcricinfo', 8) : [];
    const news = newsXml ? parseRssItems(newsXml, 'ESPNcricinfo', 8) : [];

    return new Response(
      JSON.stringify({
        ok: true,
        scores,
        news,
        updatedAt: new Date().toISOString(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, scores: [], news: [], error: String(err) }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
