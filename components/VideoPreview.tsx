import type { TimestampItem } from '@/lib/storage';
import Image from 'next/image';
import CopyChapters from './CopyChapters';

import type { Thumbnails } from '@/lib/api';

import type { TranscriptSegment } from '@/lib/api';

type Props = {
  loading?: boolean;
  details?: {
    id: string;
    title: string | null;
    description: string | null;
    channelTitle: string | null;
    publishedAt: string | null;
    thumbnails?: Thumbnails | null;
    duration?: string | null;
  } | null;
  timestamps?: TimestampItem[];
  transcript?: TranscriptSegment[];
  transcriptLoading?: boolean;
};

export default function VideoPreview({ loading, details, timestamps = [], transcript = [], transcriptLoading = false }: Props) {
  const effectiveTranscript = transcript.length > 0
    ? transcript
    : (details?.description && details.description.trim().length > 0)
      ? [{ text: details.description.trim(), start: 0, dur: 0 }]
      : [];
  return (
    <section id="preview" className="mx-auto w-full max-w-3xl">
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-100">Preview</h2>
        {!details && !loading && (
          <p className="mt-2 text-sm text-gray-400">Your video details and generated timestamps will appear here.</p>
        )}
        {loading && <p className="mt-2 text-sm text-gray-400">Loading video details…</p>}
        {details && (
          <div className="mt-4 grid gap-4 sm:grid-cols-[160px,1fr]">
            <div className="relative aspect-video w-full overflow-hidden rounded-md border border-gray-800 bg-black sm:aspect-auto sm:h-28 sm:w-40">
              {details.thumbnails?.high?.url ? (
                <Image
                  src={details.thumbnails.high.url}
                  alt={details.title ?? 'Thumbnail'}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-500">No thumbnail</div>
              )}
            </div>
            <div>
              <div className="text-base font-semibold text-white">{details.title}</div>
              {details.channelTitle && (
                <div className="text-sm text-gray-400">by {details.channelTitle}</div>
              )}
              {details.publishedAt && (
                <div className="text-xs text-gray-500">Published {new Date(details.publishedAt).toLocaleDateString()}</div>
              )}
            </div>
          </div>
        )}
        {timestamps.length === 0 && details && !loading && (
          <p className="mt-4 text-sm text-gray-400">No chapters detected in the description.</p>
        )}
        {timestamps.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-200">Chapters</h3>
              <CopyChapters timestamps={timestamps} />
            </div>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {timestamps.map((t) => (
                <li key={t.time + t.label} className="text-sm text-gray-300"><span className="text-gray-400">{t.time}</span> — {t.label}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Transcript section */}
        {(transcriptLoading || effectiveTranscript.length > 0) && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-200">Transcript</h3>
            {transcriptLoading ? (
              <p className="mt-2 text-sm text-gray-400">Loading transcript…</p>
            ) : effectiveTranscript.length > 0 ? (
              <div className="mt-2 max-h-64 overflow-auto rounded-md border border-gray-800 bg-gray-950 p-3 text-sm leading-relaxed text-gray-300">
                {effectiveTranscript.map((seg, idx) => (
                  <p key={`${seg.start}-${idx}`} className="mb-1"><span className="text-gray-500">[{formatTime(seg.start)}]</span> {seg.text}</p>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
