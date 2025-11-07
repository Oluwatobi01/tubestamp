export type Thumbnail = { url: string; width?: number; height?: number };
export type Thumbnails = { [key: string]: Thumbnail };

export type VideoDetails = {
  id: string;
  title: string | null;
  description: string | null;
  channelTitle: string | null;
  publishedAt: string | null;
  thumbnails: Thumbnails | null;
  duration: string | null; // ISO 8601
  viewCount: string | null;
  likeCount: string | null;
  commentCount: string | null;
};

export async function fetchVideoDetails(input: string): Promise<VideoDetails> {
  const qs = new URLSearchParams();
  // Allow either id or url; server will figure it out
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) qs.set('id', input);
  else qs.set('url', input);
  const res = await fetch(`/api/youtube/video?${qs.toString()}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch video details (${res.status})`);
  }
  return res.json();
}
