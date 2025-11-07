import Header from '../components/Header';
import MainClient from '../components/MainClient';
import CTAGrid from '../components/CTAGrid';
import StatsPanel from '../components/StatsPanel';
import HistoryCard from '../components/HistoryCard';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Header />

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
          <MainClient />
        </div>
      </section>

      <CTAGrid />
      <StatsPanel />
      <HistoryCard />

      <Footer />
    </main>
  );
}
