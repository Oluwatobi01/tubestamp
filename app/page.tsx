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

      <MainClient />

      <CTAGrid />
      <StatsPanel />
      <HistoryCard />

      <Footer />
    </main>
  );
}
