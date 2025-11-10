import { NextResponse } from 'next/server';

function extractVideoId(input: string): string | null {
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && id.length === 11 ? id : null;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v && v.length === 11) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const maybeId = parts[1];
      if (maybeId && maybeId.length === 11) return maybeId;
    }
  } catch {
    // ignore
  }
  return null;
}

// Basic XML text decoding for YouTube timedtext content
function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
}

// Parse <text start="..." dur="..."> ... </text> entries
function parseTimedTextXml(xml: string) {
  const segments: { text: string; start: number; dur: number }[] = [];
  const textTagRegex = /<text\s+([^>]+)>([\s\S]*?)<\/text>/g;
  let match: RegExpExecArray | null;
  while ((match = textTagRegex.exec(xml))) {
    const attrs = match[1];
    const body = match[2] || '';
    const startMatch = attrs.match(/start="([0-9.]+)"/);
    const durMatch = attrs.match(/dur="([0-9.]+)"/);
    const start = startMatch ? parseFloat(startMatch[1]) : 0;
    const dur = durMatch ? parseFloat(durMatch[1]) : 0;
    // timedtext may include line breaks encoded as \n
    const raw = body.replace(/\n/g, ' ').replace(/<\/?[^>]+>/g, '');
    const text = decodeHtmlEntities(raw).trim();
    if (text) segments.push({ text, start, dur });
  }
  return segments;
}

export async function GET(request: Request) {
  async function tryDescriptionFallback(videoId: string, ua: RequestInit) {
    try {
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const resp = await fetch(watchUrl, ua as any);
      if (resp.ok) {
        const html = await resp.text();
        const m = html.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\});/);
        if (m) {
          const jsonStr = m[1];
          let pr: any = null;
          try { pr = JSON.parse(jsonStr); } catch {}
          const desc = pr?.videoDetails?.shortDescription
            || pr?.microformat?.playerMicroformatRenderer?.description?.simpleText
            || '';
          const clean = (desc || '').toString().trim();
          if (clean.length) {
            return [{ text: clean, start: 0, dur: 0 }];
          }
        }
      }
    } catch {}
    return [] as { text: string; start: number; dur: number }[];
  }
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('id') || searchParams.get('url');
    if (!input) {
      return NextResponse.json({ error: 'Missing id or url query param' }, { status: 400 });
    }

    const videoId = extractVideoId(input);
    if (!videoId) {
      return NextResponse.json({ error: 'Could not parse a valid YouTube video id' }, { status: 400 });
    }

    const ua = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept': '*/*',
      },
      // Next.js edge/runtime may cache fetches; ensure up-to-date
      cache: 'no-store' as const,
    };

    // Attempt 0: Parse watch page for captionTracks and use provided baseUrl (most reliable)
    try {
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const resp = await fetch(watchUrl, ua as any);
      if (resp.ok) {
        const html = await resp.text();
        // Try to find ytInitialPlayerResponse JSON
        const m = html.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\});/);
        if (m) {
          const jsonStr = m[1];
          let pr: any = null;
          try { pr = JSON.parse(jsonStr); } catch {}
          const tracks: any[] = pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
          if (tracks.length) {
            // Prefer English
            const pick = tracks.find(t => t.languageCode?.startsWith('en')) || tracks[0];
            if (pick?.baseUrl) {
              const url = new URL(pick.baseUrl);
              url.searchParams.set('fmt', 'json3');
              const r = await fetch(url.toString(), ua as any);
              if (r.ok) {
                const data = await r.json().catch(() => null);
                if (data && Array.isArray(data.events)) {
                  const segments = [] as { text: string; start: number; dur: number }[];
                  for (const ev of data.events) {
                    const start = (ev.tStartMs ?? 0) / 1000;
                    const dur = (ev.dDurationMs ?? 0) / 1000;
                    if (!ev.segs || !Array.isArray(ev.segs)) continue;
                    const text = ev.segs.map((s: any) => s.utf8 || '').join('').replace(/\n/g, ' ').trim();
                    if (text) segments.push({ text, start, dur });
                  }
                  if (segments.length) {
                    return NextResponse.json({ id: videoId, transcript: segments }, { status: 200 });
                  }
                }
              }
            }
          }
        }
      }
    } catch {}

    // Attempt 1: auto-generated English captions (json3)
    try {
      const json3 = new URL('https://www.youtube.com/api/timedtext');
      json3.searchParams.set('v', videoId);
      json3.searchParams.set('lang', 'en');
      json3.searchParams.set('kind', 'asr');
      json3.searchParams.set('fmt', 'json3');
      const r = await fetch(json3.toString(), ua as any);
      if (r.ok) {
        const data = await r.json().catch(() => null);
        if (data && Array.isArray(data.events)) {
          const segments = [] as { text: string; start: number; dur: number }[];
          for (const ev of data.events) {
            const start = (ev.tStartMs ?? 0) / 1000;
            const dur = (ev.dDurationMs ?? 0) / 1000;
            let text = '';
            if (Array.isArray(ev.segs)) {
              text = ev.segs.map((s: any) => s.utf8 || '').join('').replace(/\n/g, ' ').trim();
            } else if (typeof ev.utf8 === 'string') {
              text = String(ev.utf8).replace(/\n/g, ' ').trim();
            }
            if (text) segments.push({ text, start, dur });
          }
          if (segments.length) {
            return NextResponse.json({ id: videoId, transcript: segments }, { status: 200 });
          }
        }
      }
    } catch {}

    // Attempt 2: auto-generated English captions (XML)
    try {
      const xmlAuto = new URL('https://www.youtube.com/api/timedtext');
      xmlAuto.searchParams.set('v', videoId);
      xmlAuto.searchParams.set('lang', 'en');
      xmlAuto.searchParams.set('kind', 'asr');
      const r2 = await fetch(xmlAuto.toString(), ua as any);
      if (r2.ok) {
        const xml = await r2.text();
        const segs = parseTimedTextXml(xml);
        if (segs.length) {
          return NextResponse.json({ id: videoId, transcript: segs }, { status: 200 });
        }
      }
    } catch {}

    // Attempt 3: list available tracks and choose one (prefer en)
    const listUrl = new URL('https://www.youtube.com/api/timedtext');
    listUrl.searchParams.set('type', 'list');
    listUrl.searchParams.set('v', videoId);

    const listRes = await fetch(listUrl.toString(), ua as any);
    if (!listRes.ok) {
      return NextResponse.json({ id: videoId, transcript: [] }, { status: 200 });
    }
    const listXml = await listRes.text();

    // Extract tracks: <track id="..." lang_code="en" lang_translated="English" name="..." kind="asr"/>
    const trackRegex = /<track\s+([^>]+?)\s*\/>/g;
    type Track = { lang_code?: string; name?: string; kind?: string };
    const tracks: Track[] = [];
    let m: RegExpExecArray | null;
    while ((m = trackRegex.exec(listXml))) {
      const attrs = m[1];
      const lang_code = attrs.match(/lang_code=\"([^\"]+)\"/)?.[1];
      const name = attrs.match(/name=\"([^\"]*)\"/)?.[1];
      const kind = attrs.match(/kind=\"([^\"]+)\"/)?.[1];
      tracks.push({ lang_code, name, kind });
    }

    if (!tracks.length) {
      return NextResponse.json({ id: videoId, transcript: [] }, { status: 200 });
    }

    const preferred = tracks.find(t => t.lang_code?.startsWith('en')) || tracks[0];

    const ttUrl = new URL('https://www.youtube.com/api/timedtext');
    ttUrl.searchParams.set('v', videoId);
    if (preferred.lang_code) ttUrl.searchParams.set('lang', preferred.lang_code);
    if (preferred.name) ttUrl.searchParams.set('name', preferred.name);
    if (preferred.kind) ttUrl.searchParams.set('kind', preferred.kind);

    const ttRes = await fetch(ttUrl.toString(), ua as any);
    if (!ttRes.ok) {
      return NextResponse.json({ id: videoId, transcript: [] }, { status: 200 });
    }
    const ttXml = await ttRes.text();
    const segments = parseTimedTextXml(ttXml);
    if (segments.length) {
      return NextResponse.json({ id: videoId, transcript: segments }, { status: 200 });
    }

    // Final fallback: extract description from watch page and return as a single segment
    try {
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const resp = await fetch(watchUrl, ua as any);
      if (resp.ok) {
        const html = await resp.text();
        const m = html.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\});/);
        if (m) {
          const jsonStr = m[1];
          let pr: any = null;
          try { pr = JSON.parse(jsonStr); } catch {}
          const desc = pr?.videoDetails?.shortDescription
            || pr?.microformat?.playerMicroformatRenderer?.description?.simpleText
            || '';
          const clean = (desc || '').toString().trim();
          if (clean.length) {
            return NextResponse.json({ id: videoId, transcript: [{ text: clean, start: 0, dur: 0 }] }, { status: 200 });
          }
        }
      }
    } catch {}

    return NextResponse.json({ id: videoId, transcript: [] }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ id: 'unknown', transcript: [], error: message }, { status: 200 });
  }
}
