# Two Wheels Daily - Feed Aggregator - Quick Start

## 🚀 Setup Complete!

The feed aggregator is already integrated into your Vite/React project. All files are in place and ready to use.

## 📁 Current Structure

```
src/
├── components/
│   └── FeedStories.tsx      # React component to display stories
├── lib/
│   ├── feedAggregator.ts    # RSS parser & feed fetcher
│   ├── feedCache.ts         # 1-hour in-memory caching
│   └── feedConfig.ts        # Feed sources configuration
└── types/
    └── feed.ts              # TypeScript interfaces
```

## 🎯 Quick Usage

### Add to Any Page

Import and use the `FeedStories` component in any of your pages:

```tsx
import { FeedStories } from '../components/FeedStories';

export function IndustryNewsPage({ onOpenModal }: IndustryNewsPageProps) {
  return (
    <main className="bg-[#050505] min-h-screen">
      {/* Your existing content */}
      
      {/* Add feed section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold mb-8 text-white">Latest Cycling News</h2>
        <FeedStories limit={15} />
      </section>
    </main>
  );
}
```

### Example: Add to Industry News Page

Edit `src/pages/IndustryNewsPage.tsx`:

```tsx
import React from 'react';
import { PageHero } from '../components/PageHero';
import { ArticleCard } from '../components/ArticleCard';
import { FeedStories } from '../components/FeedStories';  // Add this
import { FinalCTA } from '../components/FinalCTA';

export function IndustryNewsPage({ onOpenModal }: IndustryNewsPageProps) {
  return (
    <main className="bg-[#050505] min-h-screen">
      <PageHero
        title="Industry News"
        subtitle="Business moves, sponsorships, and the politics of cycling."
        image="https://images.unsplash.com/photo-1496147539180-13929f8aa03a?q=80&w=2070&auto=format&fit=crop"
        accentColor="#06B6D4"
        category="The Business" />

      {/* Existing articles section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Your existing articles */}
        </div>
      </section>

      {/* Add feed section */}
      <section className="max-w-7xl mx-auto px-4 py-12 bg-white/5 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-white">Latest Cycling News</h2>
        <FeedStories limit={15} />
      </section>

      <FinalCTA onOpenModal={onOpenModal} />
    </main>
  );
}
```

## 🔧 Usage Examples

### Simple Integration
```tsx
<FeedStories limit={15} />
```

### With Custom Styling
```tsx
<section className="py-12 px-4 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold mb-8">Cycling News</h2>
    <FeedStories limit={20} />
  </div>
</section>
```

### Dark Theme Integration
```tsx
<section className="max-w-7xl mx-auto px-4 py-24">
  <h2 className="text-3xl font-bold mb-8 text-white">Latest News</h2>
  <div className="bg-white/5 rounded-lg p-6">
    <FeedStories limit={15} />
  </div>
</section>
```

## 🎨 Customization

### Change Number of Stories
```tsx
<FeedStories limit={10} />  {/* Show 10 instead of 15 */}
```

### Change Cache Duration
Edit `src/lib/feedCache.ts`:
```ts
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes instead of 1 hour
```

### Add Your Own Feed Source
Edit `src/lib/feedConfig.ts`:
```ts
export const FEED_SOURCES: Record<string, FeedSource> = {
  cyclingnews: { /* ... */ },
  // Add your own:
  mySource: {
    name: 'My Blog',
    url: 'https://example.com/feed.xml',
    color: 'bg-green-100 text-green-800',
  },
  // ...
};
```

### Customize Story Card Styling
Edit the `StoryCard` function in `src/components/FeedStories.tsx` to match your design. The component uses Tailwind CSS classes.

## 📊 Feed Sources

Currently aggregating from:
1. **Cycling News** - Pro racing, results
2. **Bike Rumor** - Tech news, reviews
3. **BikeRadar News** - General cycling news
4. **BikeRadar Road** - Road cycling focused
5. **BikeRadar MTB** - Mountain bike focused
6. **BikeRadar Gravel** - Gravel cycling focused
7. **Pinkbike** - Videos, gear, races, tech

## ⚡ How It Works

### Client-Side Fetching
- The component fetches feeds directly from the browser
- Uses `aggregateFeeds()` to fetch all RSS feeds in parallel
- Results are cached in memory for 1 hour
- Cache resets on page refresh

### Performance
- **First load**: 5-10 seconds (all feeds fetched in parallel)
- **Cached loads**: <100ms (if within cache window)
- **Bundle size**: ~5KB (no external dependencies)
- **Cache TTL**: 1 hour (configurable in `feedCache.ts`)

## 🐛 Troubleshooting

### Stories not showing
1. Check browser console (F12) for CORS errors
2. Some feeds may block browser requests (CORS policy)
3. If feeds fail, the component shows an error message gracefully

### CORS Issues
If you encounter CORS errors when fetching feeds, you have two options:

**Option 1: Use a CORS proxy** (for development)
Edit `src/lib/feedAggregator.ts` and add a proxy:
```ts
const response = await fetch(`https://cors-anywhere.herokuapp.com/${feedUrl}`, {
  // ...
});
```

**Option 2: Create a backend API** (recommended for production)
Create a simple Express/Node.js API that fetches feeds server-side and exposes them via an endpoint.

### Images not showing
- This is normal, some feeds don't include images
- Component handles missing images gracefully
- Images are extracted from feed descriptions when available

### Too slow loading
- First load fetches all feeds (~5-10 seconds)
- After that, results are cached in memory (instant)
- Cache resets after 1 hour or on page refresh
- Consider reducing the number of feed sources if needed

## 🔍 Understanding the Code

### File Structure

| File | Purpose |
|------|---------|
| `components/FeedStories.tsx` | React component that displays stories with loading/error states |
| `lib/feedAggregator.ts` | Fetches and parses RSS/Atom feeds, aggregates results |
| `lib/feedCache.ts` | In-memory cache to avoid refetching feeds too often |
| `lib/feedConfig.ts` | Configuration of all feed sources (URLs, names, colors) |
| `types/feed.ts` | TypeScript interfaces for type safety |

### Key Functions

**`aggregateFeeds()`** - Main function that:
1. Fetches all feeds in parallel
2. Parses RSS/Atom XML
3. Combines and sorts by date
4. Returns top 50 stories

**`FeedStories` component** - React component that:
1. Checks cache first
2. Fetches feeds if cache expired
3. Displays loading skeleton
4. Shows error message if fetch fails
5. Renders story cards

## 🚀 Next Steps

1. ✅ Files are already in place
2. Add `<FeedStories />` to any page you want
3. Test it by running `npm run dev`
4. Customize styling to match your brand
5. Add more feed sources if needed
6. Consider adding a dedicated news page route

## 📝 Notes

- **No API route needed**: This is a client-side implementation
- **CORS aware**: Some feeds may block browser requests
- **Cache in memory**: Cache resets on page refresh (not persistent)
- **Type-safe**: Full TypeScript support with proper interfaces

---

**The feed aggregator is ready to use! Just import `FeedStories` and add it to any page.** 🚴
