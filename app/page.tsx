import Header from '../components/Header';
import HeroForm from '../components/HeroForm';
import VideoPreview from '../components/VideoPreview';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Generate YouTube Timestamps
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-400">
            Paste a YouTube URL and get clean, shareable chapter timestamps.
          </p>
        </div>
        <div className="mt-8">
          <HeroForm />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4">
        <VideoPreview />
      </section>

      <Footer />
    </main>
  );
}
