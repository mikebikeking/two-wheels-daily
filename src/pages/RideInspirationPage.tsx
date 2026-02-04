import React from 'react';
import { PageHero } from '../components/PageHero';
import { FeedStories } from '../components/FeedStories';
import { FinalCTA } from '../components/FinalCTA';

interface RideInspirationPageProps {
  onOpenModal: () => void;
}

export function RideInspirationPage({ onOpenModal }: RideInspirationPageProps) {
  return (
    <main className="bg-[#050505] min-h-screen">
      <PageHero
        title="Ride Inspiration"
        subtitle="Epic routes, coffee stops, and weekend warrior guides."
        image="https://images.unsplash.com/photo-1471506480208-91b3a4cc78be?q=80&w=2074&auto=format&fit=crop"
        accentColor="#FFFFFF"
        category="The Escape" />


      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeedStories 
            limit={21}
            categories={['inspiration']}
            accentColor="#FFFFFF"
            gridLayout={true}
          />
        </div>
      </section>

      <FinalCTA onOpenModal={onOpenModal} />
    </main>);

}