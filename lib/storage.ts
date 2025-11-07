export type TimestampItem = { time: string; label: string };
export type HistoryItem = {
  id: string; // unique key (can be videoId or composite)
  videoId?: string;
  title: string;
  url: string;
  thumbUrl?: string;
  createdAt: string; // ISO string
  timestamps: TimestampItem[];
};

const KEY = 'tubestamp_history';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export async function getHistory(): Promise<HistoryItem[]> {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seed: HistoryItem[] = [
        {
          id: 'seed-1',
          title: 'Example: Learn Tailwind in 15 Minutes',
          url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          timestamps: [
            { time: '00:00', label: 'Intro' },
            { time: '02:15', label: 'Setup' },
            { time: '06:40', label: 'Utilities' },
          ],
        },
      ];
      window.localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addHistory(item: HistoryItem): Promise<void> {
  return addOrUpdateHistory(item);
}

export async function addOrUpdateHistory(item: HistoryItem): Promise<void> {
  if (!isBrowser()) return;
  try {
    const list = await getHistory();
    // If same video (prefer by videoId; fallback by normalized URL), update the existing entry
    const normalize = (u: string) => u.trim();
    const idx = list.findIndex((h) => (item.videoId && h.videoId === item.videoId) || normalize(h.url) === normalize(item.url));
    if (idx >= 0) {
      const prev = list[idx];
      const updated: HistoryItem = {
        ...prev,
        ...item,
        // Preserve earliest createdAt? Spec says "latest run" should update; so refresh createdAt now
        createdAt: item.createdAt || new Date().toISOString(),
      };
      const next = [updated, ...list.filter((_, i) => i !== idx)];
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } else {
      const next = [item, ...list];
      window.localStorage.setItem(KEY, JSON.stringify(next));
    }
  } catch {
    // ignore storage errors
  }
}
