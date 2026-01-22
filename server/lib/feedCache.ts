import { FeedItem, AggregatedFeed } from '../types/feed.js';

// In-memory cache (will reset on server restart)
// For production, consider using Redis
interface CacheEntry {
  data: AggregatedFeed;
  timestamp: number;
}

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour
let feedCache: CacheEntry | null = null;

export function getCachedFeeds(): AggregatedFeed | null {
  if (!feedCache) {
    return null;
  }

  const now = Date.now();
  const age = now - feedCache.timestamp;

  // If cache is older than 1 hour, return null (expired)
  if (age > CACHE_DURATION_MS) {
    feedCache = null;
    return null;
  }

  return feedCache.data;
}

export function setCachedFeeds(stories: FeedItem[]): AggregatedFeed {
  const aggregated: AggregatedFeed = {
    stories,
    lastUpdated: new Date().toISOString(),
    totalStories: stories.length,
  };

  feedCache = {
    data: aggregated,
    timestamp: Date.now(),
  };

  return aggregated;
}

export function clearFeedCache(): void {
  feedCache = null;
}
