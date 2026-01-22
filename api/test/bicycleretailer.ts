import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchAndParseRSSFeed } from '../../server/lib/feedAggregator.js';
import { FEED_SOURCES } from '../../server/lib/feedConfig.js';

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
    console.error('Test error:', error);
    res.status(500).json({ error: String(error) });
  }
}
