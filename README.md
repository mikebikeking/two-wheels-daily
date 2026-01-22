# Two Wheels Daily

A modern cycling news aggregator delivering curated content from 7 sources directly to your inbox. Every morning, pro racing, gear drops, industry news, and weekend ride inspiration—no noise, just the news that matters.

**Live:** https://two-wheels-daily.vercel.app/

## 🎯 Overview

Two Wheels Daily is a **free daily email newsletter** for cyclists who want to stay informed about:
- Pro racing results and transfer rumors
- New bike & gear releases
- Cycling industry news
- Weekend ride inspiration and bikepacking adventures

The site features a dynamic news feed that pulls live stories from 7 cycling sources, organized into 4 focused sections so you only see content relevant to you.

## 🏗️ What's Built

### Pages

1. **Landing Page** (`/`)
   - Hero section with email signup
   - "What You Get" feature breakdown
   - "How It Works" explainer
   - Live news feed preview
   - Social proof testimonials
   - Final CTA

2. **Pro Coverage** (`/pro-coverage`)
   - Live racing news from Pinkbike + BikeRadar Road
   - Race results, transfers, Grand Tour analysis
   - Dynamic feed (auto-updates hourly)

3. **Gear & Tech** (`/gear-tech`)
   - New bike releases and gear reviews
   - Tech announcements from Bike Rumor
   - Component reviews and gear drops

4. **Industry News** (`/industry-news`)
   - General cycling news from BikeRadar
   - Company updates and sponsorships
   - Business & career news in cycling

5. **Ride Inspiration** (`/ride-inspiration`)
   - Bikepacking routes and adventure guides
   - Weekend ride tips
   - Epic journey stories from Bikepacking.com

## 🔄 Feed Sources

| Source | Page(s) | Content |
|--------|---------|---------|
| **Pinkbike** | Pro Coverage, Ride Inspiration | Videos, races, downhill, gear |
| **BikeRadar Road** | Pro Coverage | Road racing, classics, road news |
| **Bike Rumor** | Gear & Tech | New bikes, components, gear reviews |
| **BikeRadar News** | Industry News | General cycling news |
| **Bikepacking.com** | Ride Inspiration | Routes, adventures, bikepacking |

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API Routes
- **Hosting:** Vercel
- **Feed Parsing:** Native Node.js RSS parsing (zero external dependencies)
- **Caching:** In-memory cache with 1-hour TTL

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd two-wheels-daily

# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
two-wheels-daily/
├── pages/
│   ├── index.tsx              # Landing page
│   ├── pro-coverage.tsx       # Pro Coverage page
│   ├── gear-tech.tsx          # Gear & Tech page
│   ├── industry-news.tsx      # Industry News page
│   ├── ride-inspiration.tsx   # Ride Inspiration page
│   └── api/
│       └── feeds.ts           # RSS feed aggregation API
├── components/
│   ├── FeedStories.tsx        # Live feed display component
│   ├── PageHero.tsx           # Page header hero
│   ├── ArticleCard.tsx        # Story card (landing page only)
│   └── ... (other components)
├── lib/
│   ├── feedAggregator.ts      # RSS parser
│   ├── feedCache.ts           # Caching system
│   └── feedConfig.ts          # Feed sources
├── types/
│   └── feed.ts                # TypeScript types
└── public/
    └── ... (images, icons)
```

## 🔧 Key Components

### FeedStories Component

Displays filtered cycling news with source filtering:

```tsx
import { FeedStories } from '@/components/FeedStories';

// Show stories from specific sources
<FeedStories 
  limit={12} 
  sources={['Pinkbike', 'BikeRadar Road']}
/>
```

**Props:**
- `limit` (number, default 15) - Max stories to display
- `sources` (string[], optional) - Filter by source names
- `showLastUpdated` (boolean, default true) - Show last update timestamp

### Feed API

Get aggregated cycling news programmatically:

```bash
GET /api/feeds
```

Response:
```json
{
  "stories": [
    {
      "id": "...",
      "title": "Story Title",
      "description": "Brief description",
      "link": "https://...",
      "pubDate": "2024-01-22T10:30:00Z",
      "source": {
        "name": "Pinkbike",
        "url": "https://pinkbike.com",
        "color": "bg-pink-100 text-pink-800"
      },
      "image": "https://..."
    }
  ],
  "lastUpdated": "2024-01-22T10:30:00Z",
  "totalStories": 50
}
```

## 📊 Performance

- **First Load:** 5-10 seconds (all feeds fetched in parallel)
- **Cached Load:** <100ms (1-hour TTL)
- **Bundle Size:** ~5KB (no external RSS libraries)
- **Lighthouse:** 90+ scores across all metrics

## 🎨 Design System

### Color Palette
- **Black:** `#050505` - Primary background
- **White:** Text on dark backgrounds
- **Yellow:** `#DFFF00` - Accent color & CTAs

### Typography
- **Headlines:** Bold sans-serif (Tailwind defaults)
- **Body:** Regular sans-serif
- **Mobile-first responsive design**

## 🚀 Deployment

Deployed on **Vercel** - auto-deploys on git push.

Visit: https://two-wheels-daily.vercel.app/

## 🐛 Troubleshooting

### Stories not loading
1. Check `/api/feeds` endpoint
2. Check browser console for errors
3. Verify feed URLs are accessible

### Feed sources missing stories
- First load takes 5-10 seconds
- Feeds may not have updated content yet
- Cache expires after 1 hour

## 📈 Future Roadmap

- [ ] Email newsletter integration
- [ ] User preferences (customize sources)
- [ ] Story bookmarking & history
- [ ] Advanced filtering
- [ ] Dark mode
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Sponsorship integration

## 👤 Author

Built by Mike King (@mikebikeking)
- GitHub: https://github.com/mikebikeking
- Portfolio: https://mikeking.dev

## 🙏 Credits

**Feed Sources:**
- Pinkbike (https://pinkbike.com)
- BikeRadar (https://bikeradar.com)
- Bike Rumor (https://bikerumor.com)
- Bikepacking.com (https://bikepacking.com)

**Built With:**
- Next.js
- Tailwind CSS
- Vercel

---

**Happy riding! 🚴**

Two Wheels Daily - All the cycling news. None of the noise.