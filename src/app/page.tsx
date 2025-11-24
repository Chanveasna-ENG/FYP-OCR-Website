import Header from '../components/structure/Header';
import Hero from '../components/structure/Hero';
import OCRChallenges from '../components/structure/OCRChallenges';
import Purpose from '../components/structure/Purpose';
import Footer from '../components/structure/Footer';
import OurPipeline from '../components/structure/OurPipeline';

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <OurPipeline />
      <OCRChallenges />
      <Purpose />
      <Footer />
    </>
  );
}

// src\app\page.tsx