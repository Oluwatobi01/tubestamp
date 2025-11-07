'use client';
import { useQuery } from '@tanstack/react-query';
import { getHistory, type HistoryItem } from '@/lib/storage';
import { useState } from 'react';
import HistoryModal from './HistoryModal';

function Card({ item, onClick }: { item: HistoryItem; onClick: (i: HistoryItem) => void }) {
  return (
    <article onClick={() => onClick(item)} className="cursor-pointer rounded-xl border border-gray-800 bg-gray-900/50 p-4 hover:border-fuchsia-600/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">{item.title}</h3>
          <p className="mt-1 text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
          <a className="mt-1 inline-block text-xs text-fuchsia-400 hover:text-fuchsia-300" href={item.url} target="_blank" rel="noreferrer">
            Open video ↗
          </a>
        </div>
        <div className="text-right text-xs text-gray-400">{item.timestamps.length} chapters</div>
      </div>
      {item.timestamps.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-gray-300 sm:grid-cols-3">
          {item.timestamps.slice(0, 6).map((t) => (
            <li key={t.time + t.label} className="truncate"><span className="text-gray-400">{t.time}</span> — {t.label}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function HistoryCard() {
  const { data = [], isLoading } = useQuery({ queryKey: ['history'], queryFn: getHistory });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  function onClick(i: HistoryItem) {
    setSelected(i);
    setOpen(true);
  }

  if (isLoading) return <div className="text-sm text-gray-400">Loading history…</div>;
  if (!data.length) return <div className="text-sm text-gray-400">No history yet. Generate timestamps to see recent items here.</div>;

  return (
    <section className="container-max py-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent history</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.slice(0, 6).map((item) => (
          <Card key={item.id} item={item} onClick={onClick} />
        ))}
      </div>
      <HistoryModal open={open} onClose={() => setOpen(false)} item={selected} />
    </section>
  );
}
