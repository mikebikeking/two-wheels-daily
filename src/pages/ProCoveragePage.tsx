import { FeedStories } from '../components/FeedStories';
import { PageHero } from '../components/PageHero';
import { FinalCTA } from '../components/FinalCTA';

interface ProCoveragePageProps {
  onOpenModal: () => void;
}

export function ProCoveragePage({ onOpenModal }: ProCoveragePageProps) {
  return (
    <main className="bg-[#050505] min-h-screen">
      <PageHero
        title="Pro Coverage"
        subtitle="Race results, analysis, and transfer rumors from the peloton."
        image="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop"
        accentColor="#DFFF00"
        category="The Peloton" />

      <section className="max-w-7xl mx-auto px-4 py-24">
        {/* Live feed from all cycling news sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeedStories 
            limit={21}
            sources={['Pinkbike', 'BikeRadar Road']}
            accentColor="#DFFF00"
            gridLayout={true}
          />
        </div>
      </section>

      <FinalCTA onOpenModal={onOpenModal} />
    </main>
  );
}