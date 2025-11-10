"use client";
import { useState } from 'react';
import HeroForm from './HeroForm';
import VideoPreview from './VideoPreview';
import type { VideoDetails, TranscriptSegment } from '@/lib/api';
import { fetchVideoDetails, fetchTranscript } from '@/lib/api';
import { addHistory, type TimestampItem } from '@/lib/storage';

export default function MainClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<VideoDetails | null>(null);
  const [timestamps, setTimestamps] = useState<TimestampItem[]>([]);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  function isYouTubeUrl(value: string): boolean {
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      if (host === 'youtu.be') return true;
      if (host.endsWith('youtube.com')) return true;
      return false;
    } catch {
      return false;
    }
  }

  async function handleSubmit(input: string) {
    setError(null);
    setTimestamps([]);
    setTranscript([]);
    if (!isYouTubeUrl(input)) {
      setError('URL is not a YouTube link');
      return;
    }
    setLoading(true);
    setTranscriptLoading(true);
    try {
      // Fetch details and transcript concurrently so transcript isn't blocked by details failures
      const detailsPromise: Promise<VideoDetails | null> = fetchVideoDetails(input).catch((e: unknown) => {
        const message = e instanceof Error ? e.message : 'Failed to fetch video details';
        setError(message);
        return null;
      });
      const transcriptPromise = fetchTranscript(input);

      const [data, tx] = await Promise.all([detailsPromise, transcriptPromise]);

      if (data) {
        setDetails(data);
        // Parse chapters from description
        const { parseChapters, generateAutoChapters } = await import('@/lib/chapters');
        let parsed = parseChapters(data.description || '');
        if (!parsed.length && data.duration) {
          parsed = generateAutoChapters(data.duration);
        }
        setTimestamps(parsed);
        // Save to history
        await addHistory({
          id: data.id || `${Date.now()}`,
          videoId: data.id || undefined,
          title: data.title ?? 'Untitled video',
          url: input,
          thumbUrl: data.thumbnails?.high?.url || undefined,
          createdAt: new Date().toISOString(),
          timestamps: parsed,
        });
      } else {
        setDetails(null);
      }

      // If no transcript but we have a description, use it as a basic fallback
      const txList: TranscriptSegment[] = Array.isArray(tx?.transcript) ? tx.transcript : [];
      if ((!txList || txList.length === 0) && (data?.description || '').trim().length > 0) {
        setTranscript([{ text: String(data.description ?? '').trim(), start: 0, dur: 0 }]);
      } else {
        setTranscript(txList);
      }
    } finally {
      setTranscriptLoading(false);
      setLoading(false);
    }
  }

  return (
    <>
      <section className="container-max py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Generate YouTube Timestamps</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-400">Paste a YouTube URL and get clean, shareable chapter timestamps.</p>
        </div>
        <div className="mt-8">
          <HeroForm onSubmit={handleSubmit} loading={loading} />
          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        </div>
      </section>

      <section className="container-max">
        <VideoPreview details={details} loading={loading} timestamps={timestamps} transcript={transcript} transcriptLoading={transcriptLoading} />
      </section>
    </>
  );
}
