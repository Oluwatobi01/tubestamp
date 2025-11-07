import type { TimestampItem } from '@/lib/storage';

type Props = {
  loading?: boolean;
  details?: {
    id: string;
    title: string | null;
    description: string | null;
    channelTitle: string | null;
    publishedAt: string | null;
    thumbnails?: any;
    duration?: string | null;
  } | null;
  timestamps?: TimestampItem[];
};

export default function VideoPreview({ loading, details, timestamps = [] }: Props) {
  return (
    <section id="preview" className="mx-auto w-full max-w-3xl">
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-100">Preview</h2>
        {!details && !loading && (
          <p className="mt-2 text-sm text-gray-400">Your video details and generated timestamps will appear here.</p>
        )}
        {loading && <p className="mt-2 text-sm text-gray-400">Loading video details…</p>}
        {details && (
          <div className="mt-4">
            <div className="text-base font-semibold text-white">{details.title}</div>
            {details.channelTitle && (
              <div className="text-sm text-gray-400">by {details.channelTitle}</div>
            )}
            {details.publishedAt && (
              <div className="text-xs text-gray-500">Published {new Date(details.publishedAt).toLocaleDateString()}</div>
            )}
          </div>
        )}
        {timestamps.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-gray-200">Chapters</h3>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {timestamps.map((t) => (
                <li key={t.time + t.label} className="text-sm text-gray-300"><span className="text-gray-400">{t.time}</span> — {t.label}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 h-32 w-full rounded-md border border-dashed border-gray-700/80 bg-gray-900" />
      </div>
    </section>
  );
}
