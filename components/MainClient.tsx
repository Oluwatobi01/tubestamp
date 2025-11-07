"use client";
import { useState } from 'react';
import HeroForm from './HeroForm';
import VideoPreview from './VideoPreview';
import type { VideoDetails } from '@/lib/api';
import { fetchVideoDetails } from '@/lib/api';
import { addHistory } from '@/lib/storage';

export default function MainClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<VideoDetails | null>(null);

  async function handleSubmit(input: string) {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchVideoDetails(input);
      setDetails(data);
      // Save to history
      await addHistory({
        id: `${data.id}-${Date.now()}`,
        title: data.title ?? 'Untitled video',
        url: input,
        createdAt: new Date().toISOString(),
        timestamps: [],
      });
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch video details');
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="container-max py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Generate YouTube Timestamps
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-400">
            Paste a YouTube URL and get clean, shareable chapter timestamps.
          </p>
        </div>
        <div className="mt-8">
          <HeroForm onSubmit={handleSubmit} loading={loading} />
          {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        </div>
      </section>

      <section className="container-max">
        <VideoPreview details={details} loading={loading} />
      </section>
    </>
  );
}
