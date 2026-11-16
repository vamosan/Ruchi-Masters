export interface ParsedYouTube {
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string;
  isShort: boolean;
}

export interface ParsedInstagram {
  shortcode: string;
  kind: 'p' | 'reel' | 'tv';
  embedUrl: string;
  permalink: string;
}

export function normalizeExternalUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function detectSocialPlatform(url: string): 'instagram' | 'youtube' {
  const lower = url.toLowerCase();
  if (lower.includes('youtu.be') || lower.includes('youtube.com')) return 'youtube';
  return 'instagram';
}

export function parseYouTubeUrl(url: string): ParsedYouTube | null {
  try {
    const normalized = normalizeExternalUrl(url);
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();

    let videoId = '';
    let isShort = false;

    if (host === 'youtu.be') {
      videoId = parsed.pathname.split('/').filter(Boolean)[0] || '';
    } else if (host.includes('youtube.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parsed.searchParams.get('v')) {
        videoId = parsed.searchParams.get('v') || '';
      } else if (parts[0] === 'shorts' && parts[1]) {
        videoId = parts[1];
        isShort = true;
      } else if ((parts[0] === 'embed' || parts[0] === 'live') && parts[1]) {
        videoId = parts[1];
      }
    }

    const cleanId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanId) return null;

    return {
      videoId: cleanId,
      embedUrl: `https://www.youtube.com/embed/${cleanId}?rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`,
      isShort,
    };
  } catch {
    return null;
  }
}

export function parseInstagramUrl(url: string): ParsedInstagram | null {
  try {
    const normalized = normalizeExternalUrl(url);
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();
    if (!host.includes('instagram.com')) return null;

    const parts = parsed.pathname.split('/').filter(Boolean);
    // Support /p/CODE, /reel/CODE, /reels/CODE, /tv/CODE, or /{username}/reel/CODE
    let kind: 'p' | 'reel' | 'tv' | null = null;
    let shortcode = '';

    for (let i = 0; i < parts.length - 1; i++) {
      const seg = parts[i].toLowerCase();
      if (seg === 'p' || seg === 'reel' || seg === 'reels' || seg === 'tv') {
        kind = seg === 'reels' ? 'reel' : (seg as 'p' | 'reel' | 'tv');
        shortcode = parts[i + 1];
        break;
      }
    }

    if (!kind || !shortcode) return null;

    const cleanCode = shortcode.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanCode) return null;

    const canonicalKind = kind === 'reel' ? 'reel' : kind === 'tv' ? 'tv' : 'p';
    return {
      shortcode: cleanCode,
      kind: canonicalKind,
      permalink: `https://www.instagram.com/${canonicalKind}/${cleanCode}/`,
      embedUrl: `https://www.instagram.com/${canonicalKind}/${cleanCode}/embed/captioned/`,
    };
  } catch {
    return null;
  }
}
