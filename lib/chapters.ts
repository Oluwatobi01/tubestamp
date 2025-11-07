import type { TimestampItem } from './storage';

function pad(n: number) { return n.toString().padStart(2, '0'); }

function normalize(h: number, m: number, s: number) {
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export function parseChapters(description: string): TimestampItem[] {
  if (!description) return [];
  const lines = description.split(/\r?\n/);
  const items: TimestampItem[] = [];
  const re = /(\b(?:(\d{1,2}):)?(\d{1,2}):(\d{2}))\b\s*[-–—:\u2013\u2014\s]*\s*(.*)/; // captures [full, h?, m, s] and label
  for (const raw of lines) {
    const line = raw.trim();
    const m = line.match(re);
    if (!m) continue;
    const h = m[2] ? parseInt(m[2], 10) : 0;
    const mi = parseInt(m[3], 10);
    const s = parseInt(m[4], 10);
    if (isNaN(mi) || isNaN(s)) continue;
    const time = normalize(h, mi, s);
    const label = (m[5] || '').trim() || time;
    items.push({ time, label });
  }
  return items;
}
