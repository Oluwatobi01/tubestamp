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

  // Patterns we support:
  //  - hh:mm:ss or mm:ss anywhere in the line
  //  - 1h02m03s, 2m45s formats
  // We will pick the first timestamp in a line and consider the rest as the label.
  const timeRegex = /(?:\b(\d{1,2}):(\d{2}):(\d{2})\b)|(?:\b(\d{1,2}):(\d{2})\b)|(?:\b(?:(\d{1,2})h)?(?:(\d{1,2})m)?(\d{1,2})s\b)/i;

  for (const raw of lines) {
    const line = raw.trim().replace(/[\[\]()]/g, '');
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

    const timeText = m[0];
    const time = normalize(h, mi, s);

    // Build label: remove the matched time and common separators around it
    const label = line
      .replace(timeText, '')
      .replace(/^[\s\-–—:\u2013\u2014]+/, '')
      .replace(/[\s\-–—:\u2013\u2014]+$/, '')
      .trim() || time;

    items.push({ time, label });
  }
  return items;
}
