'use client';

import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ReservationSection } from './components/ReservationSection';
import { SolutionsSection } from './components/SolutionsSection';

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden scroll-smooth">
      <Navbar />
      <HeroSection />
      <SolutionsSection />
      <ReservationSection />
      <Footer />
    </div>
  );
}
