"use client";
import { useState } from 'react';
import type { TimestampItem } from '@/lib/storage';

export default function CopyChapters({ timestamps }: { timestamps: TimestampItem[] }) {
  const [copied, setCopied] = useState(false);

  function formatForYouTube(items: TimestampItem[]) {
    return items.map((t) => `${t.time} ${t.label}`.trim()).join('\n');
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatForYouTube(timestamps));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op: could add toast later
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-md border border-fuchsia-700/40 bg-fuchsia-700/20 px-3 py-1.5 text-sm font-medium text-fuchsia-200 hover:bg-fuchsia-700/30"
    >
      {copied ? 'Copied!' : 'Copy timestamps'}
    </button>
  );
}
