import React from 'react';
import { PageHero } from '../components/PageHero';
import { FeedStories } from '../components/FeedStories';
import { FinalCTA } from '../components/FinalCTA';

interface IndustryNewsPageProps {
  onOpenModal: () => void;
}

export function IndustryNewsPage({ onOpenModal }: IndustryNewsPageProps) {
  return (
    <main className="bg-[#050505] min-h-screen">
      <PageHero
        title="Industry News"
        subtitle="Business moves, sponsorships, and the politics of cycling."
        image="https://images.unsplash.com/photo-1496147539180-13929f8aa03a?q=80&w=2070&auto=format&fit=crop"
        accentColor="#06B6D4"
        category="The Business" />


      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeedStories 
            limit={21}
            categories={['industry']}
            accentColor="#06B6D4"
            gridLayout={true}
          />
        </div>
      </section>

      <FinalCTA onOpenModal={onOpenModal} />
    </main>);

}