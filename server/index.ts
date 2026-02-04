import express from 'express';
import cors from 'cors';
import { aggregateFeeds } from './lib/feedAggregator.js';
import { getCachedFeeds, setCachedFeeds, clearFeedCache } from './lib/feedCache.js';
import { AggregatedFeed } from './types/feed.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Two Wheels Daily API',
    endpoints: {
      health: '/health',
      feeds: '/api/feeds'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Clear cache endpoint (for testing)
app.post('/api/feeds/clear-cache', (req, res) => {
  clearFeedCache();
  res.json({ message: 'Cache cleared' });
});

// Also allow GET for easier cache clearing
app.get('/api/feeds/clear-cache', (req, res) => {
  clearFeedCache();
  res.json({ message: 'Cache cleared' });
});

// Test endpoint to fetch Bicycle Retailer feed directly (for debugging)
app.get('/api/test/bicycleretailer', async (req, res) => {
  try {
    const { fetchAndParseRSSFeed } = await import('./lib/feedAggregator.js');
    const { FEED_SOURCES } = await import('./lib/feedConfig.js');
    const source = FEED_SOURCES.bicycleretailer;
    
    const stories = await fetchAndParseRSSFeed(source.url, 'bicycleretailer');
    
    res.json({
      feedUrl: source.url,
      storiesFound: stories.length,
      storiesWithImages: stories.filter(s => s.image).length,
      stories: stories.slice(0, 3).map(s => ({
        title: s.title.substring(0, 50),
        hasImage: !!s.image,
        image: s.image || null,
        link: s.link
      }))
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Test endpoint to fetch Velo feed directly (for debugging)
app.get('/api/test/velo', async (req, res) => {
  try {
    const { fetchAndParseRSSFeed } = await import('./lib/feedAggregator.js');
    const { FEED_SOURCES } = await import('./lib/feedConfig.js');
    const source = FEED_SOURCES.velo;
    
    if (!source) {
      return res.status(404).json({ error: 'Velo feed source not found' });
    }
    
    const stories = await fetchAndParseRSSFeed(source.url, 'velo');
    
    res.json({
      feedUrl: source.url,
      sourceKey: 'velo',
      sourceName: source.name,
      storiesFound: stories.length,
      storiesWithImages: stories.filter(s => s.image).length,
      stories: stories.slice(0, 5).map(s => ({
        title: s.title,
        hasImage: !!s.image,
        image: s.image || null,
        link: s.link,
        source: s.source.name
      }))
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Test endpoint to fetch Cyclingnews feed directly (for debugging)
app.get('/api/test/cyclingnews', async (req, res) => {
  try {
    const { fetchAndParseRSSFeed } = await import('./lib/feedAggregator.js');
    const { FEED_SOURCES } = await import('./lib/feedConfig.js');
    const source = FEED_SOURCES.cyclingnews;
    
    if (!source) {
      return res.status(404).json({ error: 'Cyclingnews feed source not found' });
    }
    
    const stories = await fetchAndParseRSSFeed(source.url, 'cyclingnews');
    
    res.json({
      feedUrl: source.url,
      sourceKey: 'cyclingnews',
      sourceName: source.name,
      storiesFound: stories.length,
      storiesWithImages: stories.filter(s => s.image).length,
      stories: stories.slice(0, 5).map(s => ({
        title: s.title,
        hasTitle: !!s.title && s.title.length > 0,
        description: s.description,
        hasDescription: !!s.description && s.description !== 'No description available',
        hasImage: !!s.image,
        image: s.image || null,
        link: s.link,
        source: s.source.name
      }))
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// Feed aggregation endpoint
app.get('/api/feeds', async (req, res) => {
  try {
    // Check cache first
    const cached = getCachedFeeds();
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).json(cached);
    }

    // Fetch and aggregate feeds
    const stories = await aggregateFeeds();

    // Cache the results
    const aggregated = setCachedFeeds(stories);

    // Set cache headers (1 hour)
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(aggregated);
  } catch (error) {
    console.error('Feed aggregation error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch feeds. Please try again later.' 
    });
  }
});

// Debug endpoint to check date filtering
app.get('/api/debug/dates', async (req, res) => {
  try {
    const { aggregateFeeds } = await import('./lib/feedAggregator.js');
    const stories = await aggregateFeeds();
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dateInfo = stories.slice(0, 10).map(s => {
      const storyDate = new Date(s.pubDate);
      const daysAgo = Math.floor((now.getTime() - storyDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        title: s.title.substring(0, 50),
        pubDate: s.pubDate,
        parsedDate: storyDate.toISOString(),
        isValid: !isNaN(storyDate.getTime()),
        daysAgo: daysAgo,
        isWithin30Days: storyDate >= thirtyDaysAgo,
        source: s.source.name
      };
    });
    
    res.json({
      totalStories: stories.length,
      thirtyDaysAgo: thirtyDaysAgo.toISOString(),
      now: now.toISOString(),
      sampleStories: dateInfo
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Feed API available at http://localhost:${PORT}/api/feeds`);
});
