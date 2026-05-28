import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { LandingSections, SystemRolesSection } from '@/components/landing/Sections';
import { EICriteria } from '@/components/landing/EICriteria';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-950">
        <Hero />
        <LandingSections />
        <SystemRolesSection />
        <EICriteria />
      </main>
      <Footer />
    </>
  );
}
