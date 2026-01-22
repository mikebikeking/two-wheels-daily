import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { BentoGrid } from '../components/BentoGrid';
import { Timeline } from '../components/Timeline';
import { Testimonials } from '../components/Testimonials';
import { FinalCTA } from '../components/FinalCTA';
interface LandingPageProps {
  onOpenModal: () => void;
}
export function LandingPage({ onOpenModal }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#DFFF00] selection:text-black">
      <HeroSection />
      <BentoGrid />
      <Timeline />
      <Testimonials />
      <FinalCTA onOpenModal={onOpenModal} />

      {/* Simple Footer */}
      <footer className="bg-black py-8 border-t border-white/10 text-center">
        <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">
          © {new Date().getFullYear()} Two Wheels Daily. All rights reserved.
        </p>
      </footer>
    </main>);

}