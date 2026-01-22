import type { VercelRequest, VercelResponse } from '@vercel/node';
import { aggregateFeeds } from '../server/lib/feedAggregator.js';
import { getCachedFeeds, setCachedFeeds } from '../server/lib/feedCache.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
