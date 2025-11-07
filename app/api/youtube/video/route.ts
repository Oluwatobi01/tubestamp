import { NextResponse } from 'next/server';

function extractVideoId(input: string): string | null {
  // If it's already an 11-char YouTube video ID, return as-is
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    // youtu.be/<id>
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && id.length === 11 ? id : null;
    }
    // www.youtube.com or m.youtube.com / watch?v=<id>
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v && v.length === 11) return v;
      // /embed/<id> or /shorts/<id>
      const parts = url.pathname.split('/').filter(Boolean);
      const maybeId = parts[1];
      if (maybeId && maybeId.length === 11) return maybeId;
    }
  } catch {
    // not a valid URL, fall through
  }
  return null;
}

export async function GET(request: Request) {
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

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server is not configured with YOUTUBE_API_KEY' }, { status: 500 });
    }

    const apiUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    apiUrl.searchParams.set('part', 'snippet,contentDetails,statistics');
    apiUrl.searchParams.set('id', videoId);
    apiUrl.searchParams.set('key', apiKey);

    const res = await fetch(apiUrl.toString());
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'YouTube API error', details: text }, { status: 502 });
    }
    const data = await res.json();
    const item = data.items?.[0];
    if (!item) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const { snippet, contentDetails, statistics } = item;
    const payload = {
      id: videoId,
      title: snippet?.title ?? null,
      description: snippet?.description ?? null,
      channelTitle: snippet?.channelTitle ?? null,
      publishedAt: snippet?.publishedAt ?? null,
      thumbnails: snippet?.thumbnails ?? null,
      duration: contentDetails?.duration ?? null, // ISO 8601
      viewCount: statistics?.viewCount ?? null,
      likeCount: statistics?.likeCount ?? null,
      commentCount: statistics?.commentCount ?? null,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected server error', details: err?.message ?? String(err) }, { status: 500 });
  }
}
