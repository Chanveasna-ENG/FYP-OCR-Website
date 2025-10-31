import Header from './components/structure/Header';
import Hero from './components/structure/Hero';
import OCRChallenges from './components/structure/OCRChallenges';
import Purpose from './components/structure/Purpose';
import Footer from './components/structure/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      {/* spacer so fixed header doesn't overlap */}
      <div style={{ height: 85 }} />
      <Hero />
      <OCRChallenges />
      <Purpose />
      <Footer />
    </>
  );
}
