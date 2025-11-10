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

export type TranscriptSegment = { text: string; start: number; dur: number };
export type TranscriptResponse = { id: string; transcript: TranscriptSegment[] };

function toQuery(input: string) {
  const qs = new URLSearchParams();
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) qs.set('id', input);
  else qs.set('url', input);
  return qs.toString();
}

export async function fetchVideoDetails(input: string): Promise<VideoDetails> {
  const res = await fetch(`/api/youtube/video?${toQuery(input)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch video details (${res.status})`);
  }
  return res.json();
}

export async function fetchTranscript(input: string): Promise<TranscriptResponse> {
  const res = await fetch(`/api/youtube/transcript?${toQuery(input)}`);
  if (!res.ok) {
    // If transcript is not available, return a safe empty response rather than throwing
    return { id: input, transcript: [] } as TranscriptResponse;
  }
  return res.json();
}
