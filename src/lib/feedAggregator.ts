import { FeedItem } from '../types/feed';
import { FEED_SOURCES } from './feedConfig';

/**
 * Simple RSS parser for the feed aggregator
 * Parses RSS 2.0 and Atom feeds
 */
function parseXMLDate(dateString: string): Date {
  try {
    return new Date(dateString);
  } catch {
    return new Date();
  }
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractDescription(content: string): string {
  // Remove HTML tags and clean up
  let cleaned = stripHtml(content);
  // Limit to 150 characters
  if (cleaned.length > 150) {
    cleaned = cleaned.substring(0, 150) + '...';
  }
  return cleaned;
}

export async function fetchAndParseRSSFeed(
  feedUrl: string,
  sourceKey: string
): Promise<FeedItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TwoWheelsDaily/1.0)',
      },
      mode: 'cors', // Explicitly request CORS
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${feedUrl}: ${response.statusText}`);
      return [];
    }

    const text = await response.text();
    const source = FEED_SOURCES[sourceKey];

    if (!source) {
      console.error(`Unknown source key: ${sourceKey}`);
      return [];
    }

    // Parse RSS/Atom feed
    const items = parseRSSFeed(text, sourceKey, source);
    return items;
  } catch (error) {
    // Handle CORS and network errors gracefully
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn(`CORS or network error fetching ${feedUrl}. This is expected for browser-based RSS fetching.`);
    } else {
      console.error(`Error fetching ${feedUrl}:`, error);
    }
    return [];
  }
}

function parseRSSFeed(
  xml: string,
  sourceKey: string,
  source: any
): FeedItem[] {
  const items: FeedItem[] = [];

  try {
    // Match all <item> tags for RSS 2.0
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
    let itemMatch;

    while ((itemMatch = itemRegex.exec(xml)) !== null) {
      const itemXml = itemMatch[1];

      // Extract fields
      const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/.exec(itemXml);
      const linkMatch = /<link[^>]*>([\s\S]*?)<\/link>/.exec(itemXml);
      const pubDateMatch = /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/.exec(itemXml);
      const descMatch = /<description[^>]*>([\s\S]*?)<\/description>/.exec(itemXml);
      const guidMatch = /<guid[^>]*>([\s\S]*?)<\/guid>/.exec(itemXml);

      // Extract image from description CDATA
      let image = undefined;
      if (descMatch) {
        const imgMatch = /<img[^>]*src="([^"]*)"/.exec(descMatch[1]);
        if (imgMatch) {
          image = imgMatch[1];
        }
      }

      if (titleMatch && linkMatch && pubDateMatch) {
        const title = stripHtml(titleMatch[1]);
        const link = stripHtml(linkMatch[1]);
        const pubDate = parseXMLDate(stripHtml(pubDateMatch[1]));
        const description = descMatch
          ? extractDescription(descMatch[1])
          : 'No description available';

        const id = guidMatch
          ? stripHtml(guidMatch[1])
          : `${sourceKey}-${link}`;

        items.push({
          id,
          title,
          description,
          link,
          pubDate,
          source,
          image,
        });
      }
    }

    // Also try to parse Atom feeds if no items found
    if (items.length === 0) {
      const atomItemRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/g;
      let atomMatch;

      while ((atomMatch = atomItemRegex.exec(xml)) !== null) {
        const entryXml = atomMatch[1];

        const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/.exec(entryXml);
        const linkMatch = /<link[^>]*href="([^"]*)"/.exec(entryXml);
        const pubDateMatch = /<published[^>]*>([\s\S]*?)<\/published>/.exec(
          entryXml
        );
        const summaryMatch = /<summary[^>]*>([\s\S]*?)<\/summary>/.exec(
          entryXml
        );

        if (titleMatch && linkMatch) {
          const title = stripHtml(titleMatch[1]);
          const link = linkMatch[1];
          const pubDate = pubDateMatch
            ? parseXMLDate(stripHtml(pubDateMatch[1]))
            : new Date();
          const description = summaryMatch
            ? extractDescription(summaryMatch[1])
            : 'No description available';

          items.push({
            id: link,
            title,
            description,
            link,
            pubDate,
            source,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
  }

  return items;
}

export async function aggregateFeeds(): Promise<FeedItem[]> {
  // Fetch all feeds in parallel
  const feedPromises = Object.entries(FEED_SOURCES).map(([key, source]) =>
    fetchAndParseRSSFeed(source.url, key)
  );

  const allFeeds = await Promise.all(feedPromises);

  // Flatten and combine all stories
  const allStories = allFeeds.flat();

  // Filter stories to only include those from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentStories = allStories.filter(story => {
    const storyDate = new Date(story.pubDate);
    return storyDate >= thirtyDaysAgo;
  });

  // Sort by publication date (newest first)
  recentStories.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Return all stories from the last 30 days
  return recentStories;
}
