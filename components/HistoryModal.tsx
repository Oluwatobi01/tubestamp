'use client';
import { Fragment } from 'react';
import type { HistoryItem } from '@/lib/storage';

export default function HistoryModal({ open, onClose, item }: { open: boolean; onClose: () => void; item: HistoryItem | null; }) {
  if (!open || !item) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <button onClick={onClose} aria-label="Close" className="rounded-md border border-gray-700 px-2 py-1 text-sm text-gray-300 hover:bg-gray-800">Close</button>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-[200px,1fr]">
            <div className="aspect-video w-full overflow-hidden rounded-md border border-gray-800 bg-black" style={{maxHeight:120}}>
              {item.thumbUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbUrl} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-500">No thumbnail</div>
              )}
            </div>
            <div className="text-sm text-gray-300">
              <div><span className="text-gray-400">URL:</span> <a className="text-fuchsia-400 hover:text-fuchsia-300" href={item.url} target="_blank" rel="noreferrer">{item.url}</a></div>
              <div className="mt-1 text-gray-400">Saved: {new Date(item.createdAt).toLocaleString()}</div>
              {item.videoId && <div className="mt-1 text-gray-400">Video ID: {item.videoId}</div>}
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-200">Timestamps</h4>
            {item.timestamps?.length ? (
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {item.timestamps.map((t) => (
                  <li key={t.time + t.label} className="text-sm text-gray-300"><span className="text-gray-400">{t.time}</span> — {t.label}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-400">No timestamps for this run.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
