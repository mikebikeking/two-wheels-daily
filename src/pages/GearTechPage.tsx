import React from 'react';
import { PageHero } from '../components/PageHero';
import { FeedStories } from '../components/FeedStories';
import { FinalCTA } from '../components/FinalCTA';

interface GearTechPageProps {
  onOpenModal: () => void;
}

export function GearTechPage({ onOpenModal }: GearTechPageProps) {
  return (
    <main className="bg-[#050505] min-h-screen">
      <PageHero
        title="Gear Tech"
        subtitle="Deep dives into the latest aero frames, groupsets, and marginal gains."
        image="https://images.unsplash.com/photo-1559348349-86f1f65817fe?q=80&w=2070&auto=format&fit=crop"
        accentColor="#E11D48"
        category="The Garage" />


      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeedStories 
            limit={12}
            sources={['Bike Rumor']}
            accentColor="#E11D48"
            gridLayout={true}
          />
        </div>
      </section>

      <FinalCTA onOpenModal={onOpenModal} />
    </main>);

}