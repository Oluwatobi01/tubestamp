export type TimestampItem = { time: string; label: string };
export type HistoryItem = {
  id: string;
  title: string;
  url: string;
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
  if (!isBrowser()) return;
  try {
    const list = await getHistory();
    const next = [item, ...list];
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}
