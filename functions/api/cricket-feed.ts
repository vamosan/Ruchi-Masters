// Cloudflare Pages Function: /api/cricket-feed
// Fetches live international cricket scores and news from ESPNcricinfo & Cricbuzz RSS feeds.

function extractTag(xml: string, tag: string): string {
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const plainRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const plainMatch = xml.match(plainRegex);
  return plainMatch
    ? plainMatch[1]
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/&amp;/g, '&')
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .trim()
    : '';
}

function parseRssItems(xml: string, defaultSource: 'ESPNcricinfo' | 'Cricbuzz', maxItems = 6) {
  const items: Array<{
    title: string;
    description: string;
    link: string;
    pubDate: string;
    source: 'ESPNcricinfo' | 'Cricbuzz';
  }> = [];

  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null && items.length < maxItems) {
    const block = match[1];
    const rawTitle = extractTag(block, 'title').replace(/\s*-\s*Cricbuzz(\.com)?$/i, '');
    const description = extractTag(block, 'description')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const guid = extractTag(block, 'guid');
    const rawLink = extractTag(block, 'link');
    const link = (guid && guid.startsWith('http') ? guid : rawLink) || rawLink;
    const pubDate = extractTag(block, 'pubDate');

    if (rawTitle && link && link.startsWith('http')) {
      items.push({
        title: rawTitle,
        description,
        link,
        pubDate,
        source: defaultSource,
      });
    }
  }
  return items;
}

export const onRequestGet = async () => {
  try {
    const [scoresRes, cricinfoNewsRes, cricbuzzNewsRes] = await Promise.allSettled([
      fetch('https://static.cricinfo.com/rss/livescores.xml', {
        headers: { 'User-Agent': 'Mozilla/5.0 RuchiMastersHub/1.0' },
      }),
      fetch('https://www.espncricinfo.com/rss/content/story/feeds/0.xml', {
        headers: { 'User-Agent': 'Mozilla/5.0 RuchiMastersHub/1.0' },
      }),
      fetch(
        'https://news.google.com/rss/search?q=site:cricbuzz.com+cricket&hl=en-US&gl=US&ceid=US:en',
        {
          headers: { 'User-Agent': 'Mozilla/5.0 RuchiMastersHub/1.0' },
        }
      ),
    ]);

    const scoresXml =
      scoresRes.status === 'fulfilled' && scoresRes.value.ok
        ? await scoresRes.value.text()
        : '';
    const cricinfoXml =
      cricinfoNewsRes.status === 'fulfilled' && cricinfoNewsRes.value.ok
        ? await cricinfoNewsRes.value.text()
        : '';
    const cricbuzzXml =
      cricbuzzNewsRes.status === 'fulfilled' && cricbuzzNewsRes.value.ok
        ? await cricbuzzNewsRes.value.text()
        : '';

    const scores = scoresXml ? parseRssItems(scoresXml, 'ESPNcricinfo', 6) : [];
    const cricinfoNews = cricinfoXml ? parseRssItems(cricinfoXml, 'ESPNcricinfo', 4) : [];
    const cricbuzzNews = cricbuzzXml ? parseRssItems(cricbuzzXml, 'Cricbuzz', 4) : [];

    // Interleave ESPNcricinfo and Cricbuzz stories with their exact matching links
    const news = [];
    for (let i = 0; i < 4; i++) {
      if (cricinfoNews[i]) news.push(cricinfoNews[i]);
      if (cricbuzzNews[i]) news.push(cricbuzzNews[i]);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        scores: scores.slice(0, 4),
        news: news.slice(0, 4),
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
