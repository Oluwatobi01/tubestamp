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

  // Patterns supported:
  //  - hh:mm:ss or mm:ss anywhere in the line
  //  - token formats like 1h02m03s or 2m45s
  //  - common leading bullets/symbols are ignored
  const timeRegex = /(?:\b(\d{1,2}):(\d{2}):(\d{2})\b)|(?:\b(\d{1,2}):(\d{2})\b)|(?:\b(?:(\d{1,2})h)?(?:(\d{1,2})m)?(\d{1,2})s\b)/i;
  const bulletTrim = /^[•·*\s-]+|[•·*\s-]+$/g;

  for (const raw of lines) {
    const line = raw.trim().replace(/[()[\]]/g, '');
    if (!line) continue;
    const m = line.match(timeRegex);
    if (!m) continue;

    let h = 0, mi = 0, s = 0;
    if (m[1] && m[2] && m[3]) {
      // hh:mm:ss
      h = parseInt(m[1], 10); mi = parseInt(m[2], 10); s = parseInt(m[3], 10);
    } else if (m[4] && m[5]) {
      // mm:ss
      mi = parseInt(m[4], 10); s = parseInt(m[5], 10);
    } else if (m[6] || m[7] || m[8]) {
      // h m s tokens
      h = m[6] ? parseInt(m[6], 10) : 0;
      mi = m[7] ? parseInt(m[7], 10) : 0;
      s = m[8] ? parseInt(m[8], 10) : 0;
    }
    if (isNaN(mi) || isNaN(s)) continue;

    const timeText = m[0] as string;
    const time = normalize(h, mi, s);

    // Prefer label after the timestamp; if empty, fallback to before
    const idx = line.indexOf(timeText);
    const after = line.slice(idx + timeText.length).replace(/[\s–—:\u2013\u2014|-]+^/, '').replace(bulletTrim, '').trim();
    const before = line.slice(0, idx).replace(/[\s–—:\u2013\u2014|-]+$/, '').replace(bulletTrim, '').trim();
    const label = (after || before || time);

    items.push({ time, label });
  }
  return items;
}

// Parse an ISO-8601 YouTube duration (e.g., PT1H2M3S) into total seconds
export function durationToSeconds(iso: string): number {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i);
  if (!m) return 0;
  const h = parseInt(m[1] || '0', 10);
  const min = parseInt(m[2] || '0', 10);
  const s = parseInt(m[3] || '0', 10);
  return h * 3600 + min * 60 + s;
}

function formatSeconds(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return normalize(h, m, s);
}

// Generate simple auto-chapters based on duration when none are present
export function generateAutoChapters(durationIso: string): TimestampItem[] {
  const total = durationToSeconds(durationIso);
  if (!total || total < 60) return [{ time: '00:00', label: 'Intro' }];

  // Choose an interval based on total length
  let interval = 300; // 5 min default
  if (total <= 8 * 60) interval = 120;       // <=8 min -> 2m
  else if (total <= 20 * 60) interval = 180; // <=20 min -> 3m
  else if (total <= 40 * 60) interval = 300; // <=40 min -> 5m
  else if (total <= 90 * 60) interval = 480; // <=90 min -> 8m
  else interval = 600;                        // >90 min -> 10m

  const items: TimestampItem[] = [];
  items.push({ time: '00:00', label: 'Intro' });
  for (let t = interval; t < total - 30; t += interval) { // leave last <30s as tail
    items.push({ time: formatSeconds(t), label: 'Chapter' });
  }
  // Add an ending card if last gap is large
  if (total - (items.length ? durationToSeconds(items[items.length - 1].time) : 0) > interval / 2) {
    items.push({ time: formatSeconds(Math.max(total - Math.floor(interval / 2), 0)), label: 'Wrap-up' });
  }
  return items;
}
