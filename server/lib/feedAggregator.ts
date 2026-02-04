import { FeedItem, FeedSource } from '../types/feed.js';
import { FEED_SOURCES } from './feedConfig.js';

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
  if (!content) return 'No description available';
  
  // First decode HTML entities
  let cleaned = content
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  // Remove HTML tags (including nested ones)
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Limit to 150 characters
  if (cleaned.length > 150) {
    cleaned = cleaned.substring(0, 150) + '...';
  }
  
  return cleaned || 'No description available';
}

/**
 * Normalize image URL (handle relative URLs, protocol-relative URLs, etc.)
 */
function normalizeImageUrl(url: string, baseUrl?: string): string {
  if (!url) return url;
  
  // Remove leading/trailing whitespace
  url = url.trim();
  
  // Handle protocol-relative URLs (//example.com/image.jpg)
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  
  // Handle absolute URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle relative URLs if we have a base URL
  if (baseUrl && !url.startsWith('/')) {
    try {
      const base = new URL(baseUrl);
      return new URL(url, base.origin).href;
    } catch {
      // If baseUrl is invalid, return as-is
    }
  }
  
  return url;
}

/**
 * Extract image URL from RSS item using multiple methods
 */
function extractImageFromItem(
  itemXml: string,
  description?: string,
  contentEncoded?: string,
  articleLink?: string
): string | undefined {
  // Method 1: Check for <enclosure> tag (common for media)
  const enclosureMatch = /<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image\/([^"']+)["']/i.exec(itemXml) ||
                        /<enclosure[^>]*type=["']image\/([^"']+)["'][^>]*url=["']([^"']+)["']/i.exec(itemXml);
  if (enclosureMatch) {
    const imgUrl = enclosureMatch[1] || enclosureMatch[2];
    return normalizeImageUrl(imgUrl, articleLink);
  }

  // Method 2: Check for Media RSS <media:content> or <media:thumbnail>
  const mediaContentMatch = /<media:content[^>]*url=["']([^"']+)["']/i.exec(itemXml) ||
                           /<media:thumbnail[^>]*url=["']([^"']+)["']/i.exec(itemXml);
  if (mediaContentMatch) {
    const imgUrl = mediaContentMatch[1];
    const normalized = normalizeImageUrl(imgUrl, articleLink);
    return normalized;
  }
  
  // Also try without quotes (some feeds don't use quotes)
  const mediaContentMatchNoQuotes = /<media:content[^>]*url=([^\s>]+)/i.exec(itemXml) ||
                                    /<media:thumbnail[^>]*url=([^\s>]+)/i.exec(itemXml);
  if (mediaContentMatchNoQuotes) {
    let imgUrl = mediaContentMatchNoQuotes[1].replace(/["']/g, '');
    const normalized = normalizeImageUrl(imgUrl, articleLink);
    return normalized;
  }

  // Method 3: Check for <image> tag
  const imageTagMatch = /<image[^>]*>[\s\S]*?<url[^>]*>([^<]+)<\/url>/i.exec(itemXml);
  if (imageTagMatch) {
    return normalizeImageUrl(imageTagMatch[1].trim(), articleLink);
  }

  // Method 4: Extract from content:encoded (WordPress feeds)
  if (contentEncoded) {
    const imgMatches = [
      /<img[^>]*src=["']([^"']+)["']/i,
      /<img[^>]*src=([^\s>]+)/i,
    ];
    for (const pattern of imgMatches) {
      const match = pattern.exec(contentEncoded);
      if (match && match[1]) {
        let imgUrl = match[1].replace(/["']/g, '');
        // Filter out very small images (likely icons)
        if (!imgUrl.includes('icon') && !imgUrl.includes('logo') && imgUrl.length > 20) {
          return normalizeImageUrl(imgUrl, articleLink);
        }
      }
    }
  }

  // Method 5: Extract from description
  // Extract ALL images and pick the best one (prioritize article images, larger sizes)
  if (description) {
    const imgMatches = [
      /<img[^>]*src=["']([^"']+)["']/gi,
      /<img[^>]*src=([^\s>]+)/gi,
      /background-image:\s*url\(["']?([^"')]+)["']?\)/gi,
    ];
    
    const foundImages: Array<{ url: string; priority: number }> = [];
    
    for (const pattern of imgMatches) {
      let match;
      while ((match = pattern.exec(description)) !== null) {
        if (match && match[1]) {
          let imgUrl = match[1].replace(/["']/g, '').trim();
          
          // Skip data URIs, icons, and avatars
          if (
            !imgUrl.startsWith('data:') &&
            !imgUrl.includes('icon') &&
            !imgUrl.includes('avatar') &&
            imgUrl.length > 20 &&
            (imgUrl.startsWith('http') || imgUrl.startsWith('//'))
          ) {
            // Calculate priority: higher = better
            let priority = 0;
            
            // Prioritize article images (primary, featured, etc.)
            if (imgUrl.includes('article_primary_image') || imgUrl.includes('article-primary')) {
              priority += 100;
            } else if (imgUrl.includes('article') || imgUrl.includes('featured')) {
              priority += 50;
            }
            
            // Prioritize larger image sizes
            if (imgUrl.includes('large') || imgUrl.includes('full')) {
              priority += 30;
            } else if (imgUrl.includes('medium')) {
              priority += 10;
            } else if (imgUrl.includes('thumbnail') || imgUrl.includes('thumb')) {
              priority -= 20;
            }
            
            // Don't exclude logos if they're in article image paths (some feeds use this)
            // Only exclude if it's clearly a site logo (in root or logo-specific paths)
            if (imgUrl.includes('logo') && !imgUrl.includes('article') && !imgUrl.includes('images/article')) {
              priority -= 50;
            }
            
            foundImages.push({ url: imgUrl, priority });
          }
        }
      }
    }
    
    // Sort by priority (highest first) and return the best image
    if (foundImages.length > 0) {
      foundImages.sort((a, b) => b.priority - a.priority);
      const bestImage = foundImages[0].url;
      
      return normalizeImageUrl(bestImage, articleLink);
    }
  }

  // Method 6: Check for og:image or other meta tags in the item
  const ogImageMatch = /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i.exec(itemXml);
  if (ogImageMatch) {
    return normalizeImageUrl(ogImageMatch[1], articleLink);
  }

  // Method 7: Extract from itemXml directly (fallback - some feeds have images in item but not in description)
  // This is especially useful for feeds where description extraction might miss nested HTML
  if (itemXml) {
    const imgMatches = [
      /<img[^>]*src=["']([^"']+)["']/gi,
      /<img[^>]*src=([^\s>]+)/gi,
    ];
    
    const foundImages: Array<{ url: string; priority: number }> = [];
    
    for (const pattern of imgMatches) {
      let match;
      while ((match = pattern.exec(itemXml)) !== null) {
        if (match && match[1]) {
          let imgUrl = match[1].replace(/["']/g, '').trim();
          
          // Skip data URIs, icons, and avatars
          if (
            !imgUrl.startsWith('data:') &&
            !imgUrl.includes('icon') &&
            !imgUrl.includes('avatar') &&
            imgUrl.length > 20 &&
            (imgUrl.startsWith('http') || imgUrl.startsWith('//'))
          ) {
            // Calculate priority: higher = better
            let priority = 0;
            
            // Prioritize article images (primary, featured, etc.)
            if (imgUrl.includes('article_primary_image') || imgUrl.includes('article-primary')) {
              priority += 100;
            } else if (imgUrl.includes('article') || imgUrl.includes('featured')) {
              priority += 50;
            }
            
            // Prioritize larger image sizes
            if (imgUrl.includes('large') || imgUrl.includes('full')) {
              priority += 30;
            } else if (imgUrl.includes('medium')) {
              priority += 10;
            } else if (imgUrl.includes('thumbnail') || imgUrl.includes('thumb')) {
              priority -= 20;
            }
            
            // Don't exclude logos if they're in article image paths
            if (imgUrl.includes('logo') && !imgUrl.includes('article') && !imgUrl.includes('images/article')) {
              priority -= 50;
            }
            
            foundImages.push({ url: imgUrl, priority });
          }
        }
      }
    }
    
    // Sort by priority (highest first) and return the best image
    if (foundImages.length > 0) {
      foundImages.sort((a, b) => b.priority - a.priority);
      const bestImage = foundImages[0].url;
      
      return normalizeImageUrl(bestImage, articleLink);
    }
  }

  return undefined;
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
    });

    if (!response.ok) {
      console.error(`❌ Failed to fetch ${sourceKey} (${feedUrl}): ${response.statusText}`);
      return [];
    }

    const text = await response.text();
    const source = FEED_SOURCES[sourceKey];

    if (!source) {
      console.error(`❌ Unknown source key: ${sourceKey}`);
      return [];
    }

    // Parse RSS/Atom feed
    const items = parseRSSFeed(text, sourceKey, source);
    
    if (items.length === 0) {
      console.warn(`⚠️  No items parsed from ${sourceKey} (${feedUrl})`);
    } else {
    }
    
    return items;
  } catch (error) {
    console.error(`❌ Error fetching ${sourceKey} (${feedUrl}):`, error);
    return [];
  }
}

function parseRSSFeed(
  xml: string,
  sourceKey: string,
  source: FeedSource
): FeedItem[] {
  const items: FeedItem[] = [];

  try {
    // Match all <item> tags for RSS 2.0
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
    let itemMatch;

    while ((itemMatch = itemRegex.exec(xml)) !== null) {
      const itemXml = itemMatch[1];

      // Extract fields - try multiple patterns for flexibility
      // Handle CDATA sections (like Cyclingnews) - allow whitespace around CDATA
      const titleMatch = /<title[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/title>/.exec(itemXml) ||
                        /<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/.exec(itemXml) ||
                        /<title[^>]*>([\s\S]*?)<\/title>/.exec(itemXml);
      const linkMatch = /<link[^>]*>([\s\S]*?)<\/link>/.exec(itemXml) ||
                       /<link[^>]*href="([^"]*)"/.exec(itemXml);
      // Try pubDate, then dc:date, then published
      const pubDateMatch = /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/.exec(itemXml) ||
                          /<dc:date[^>]*>([\s\S]*?)<\/dc:date>/.exec(itemXml) ||
                          /<published[^>]*>([\s\S]*?)<\/published>/.exec(itemXml);
      // Try multiple patterns for description - some feeds have nested tags or HTML entities
      // Use non-greedy match first, then try with dotall flag for multiline
      // Handle CDATA sections (like Cyclingnews) - allow whitespace around CDATA
      const descMatch = /<description[^>]*>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/.exec(itemXml) ||
                       /<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/.exec(itemXml) ||
                       /<description[^>]*>([\s\S]*?)<\/description>/.exec(itemXml) ||
                       /<description[^>]*>([\s\S]*?)<\/description>/s.exec(itemXml);
      const contentEncodedMatch = /<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/.exec(itemXml) ||
                                 /<content:encoded[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/.exec(itemXml);
      const guidMatch = /<guid[^>]*>([\s\S]*?)<\/guid>/.exec(itemXml);

      // Extract image from multiple sources (we'll get link later, so pass undefined for now)
      let image: string | undefined = undefined;

      // Require title and link, but make pubDate optional (use current date if missing)
      if (titleMatch && linkMatch) {
        // Extract title - prioritize CDATA content (titleMatch[1] for CDATA patterns)
        const titleText = titleMatch[1] || titleMatch[2] || titleMatch[0];
        const title = stripHtml(titleText);
        let link = linkMatch[1].trim();
        link = link.startsWith('http') ? link : stripHtml(link);
        const pubDate = pubDateMatch
          ? parseXMLDate(stripHtml(pubDateMatch[1]))
          : new Date();
        // Extract description - prioritize CDATA content (descMatch[1] for CDATA patterns)
        // For CDATA patterns, descMatch[1] contains the content; for regular patterns, descMatch[1] contains the content
        const description = descMatch
          ? extractDescription(descMatch[1] || descMatch[2] || descMatch[0])
          : 'No description available';

        // Extract image now that we have the link (for URL normalization)
        // Pass the raw description HTML (descMatch[1]) not the stripped description
        const rawDescription = descMatch?.[1] || descMatch?.[2]; // Handle both regex patterns
        
        // Special handling for Bicycle Retailer - images are in field-image divs
        if (sourceKey === 'bicycleretailer') {
          // Try multiple sources: rawDescription, itemXml
          const sourcesToCheck = [
            { name: 'rawDescription', content: rawDescription },
            { name: 'itemXml', content: itemXml }
          ];
          
            for (const source of sourcesToCheck) {
            if (!source.content) continue;
            
            // Decode HTML entities first (some feeds encode & as &amp;, < as &lt;, etc.)
            let decodedContent = source.content
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&#x27;/g, "'");
            
            // Look for ANY img tag - be very aggressive
            const allImagePatterns = [
              // Match img tags with article_primary_image in src (highest priority)
              /<img[^>]*src=["']([^"']*article_primary_image[^"']*)["']/gi,
              /<img[^>]*src=([^\s>]*article_primary_image[^\s>]*)/gi,
              // Match img tags in field-image divs
              /<div[^>]*field-name-field-image[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/gi,
              /<div[^>]*field-name-field-image[^>]*>[\s\S]*?<img[^>]*src=([^\s>]+)/gi,
              // Match foaf:Image img tags
              /<img[^>]*typeof=["']?foaf:Image["']?[^>]*src=["']([^"']+)["']/gi,
              /<img[^>]*typeof=["']?foaf:Image["']?[^>]*src=([^\s>]+)/gi,
              // Match any img tag with bicycleretailer.com and article
              /<img[^>]*src=["']([^"']*bicycleretailer\.com[^"']*article[^"']*)["']/gi,
              /<img[^>]*src=([^\s>]*bicycleretailer\.com[^\s>]*article[^\s>]*)/gi,
              // Match ANY img tag with bicycleretailer.com (fallback)
              /<img[^>]*src=["']([^"']*bicycleretailer\.com[^"']*)["']/gi,
              /<img[^>]*src=([^\s>]*bicycleretailer\.com[^\s>]*)/gi,
              // Last resort: match ANY img tag
              /<img[^>]*src=["']([^"']+)["']/gi,
              /<img[^>]*src=([^\s>]+)/gi,
            ];
            
            for (const pattern of allImagePatterns) {
              let match;
              // Reset regex lastIndex for global patterns
              pattern.lastIndex = 0;
              while ((match = pattern.exec(decodedContent)) !== null) {
                if (match && match[1]) {
                  let imgUrl = match[1].replace(/["']/g, '').trim();
                  
                  // Decode any remaining HTML entities in URL
                  imgUrl = imgUrl
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"');
                  
                  // Must be a valid URL
                  if (imgUrl.length > 20 && 
                      (imgUrl.startsWith('http') || imgUrl.startsWith('//'))) {
                    // Prioritize article_primary_image URLs
                    const isArticleImage = imgUrl.includes('article_primary_image') || 
                                          imgUrl.includes('article') || 
                                          imgUrl.includes('bicycleretailer.com');
                    
                    // Skip if it's clearly not an image (icon, logo in wrong path, etc.)
                    const isBadImage = imgUrl.includes('icon') || 
                                      (imgUrl.includes('logo') && !imgUrl.includes('article') && !imgUrl.includes('images/article'));
                    
                    if (isArticleImage && !isBadImage) {
                      image = normalizeImageUrl(imgUrl, link);
                      break;
                    }
                  }
                }
              }
              if (image) break;
            }
            if (image) break;
          }
        }
        
        // If no image found yet, try standard extraction
        if (!image) {
          image = extractImageFromItem(itemXml, rawDescription, contentEncodedMatch?.[1], link);
        }
        

        const id = guidMatch
          ? stripHtml(guidMatch[1])
          : `${sourceKey}-${link}`;

        items.push({
          id,
          title,
          description,
          link,
          pubDate: pubDate.toISOString(), // Convert to ISO string for JSON
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
        const contentMatch = /<content[^>]*>([\s\S]*?)<\/content>/.exec(entryXml) ||
                            /<content[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/content>/.exec(entryXml);

        if (titleMatch && linkMatch) {
          const title = stripHtml(titleMatch[1]);
          const link = linkMatch[1];
          const pubDate = pubDateMatch
            ? parseXMLDate(stripHtml(pubDateMatch[1]))
            : new Date();
          const description = summaryMatch
            ? extractDescription(summaryMatch[1])
            : 'No description available';

          // Extract image from Atom feed
          const image = extractImageFromItem(entryXml, summaryMatch?.[1], contentMatch?.[1], link);

          items.push({
            id: link,
            title,
            description,
            link,
            pubDate: pubDate.toISOString(), // Convert to ISO string for JSON
            source,
            image,
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
  
  // Remove duplicates based on link (same article from different sources)
  const seenLinks = new Set<string>();
  const uniqueStories = allStories.filter(story => {
    if (seenLinks.has(story.link)) {
      return false;
    }
    seenLinks.add(story.link);
    return true;
  });
  
  // Ensure unique IDs (in case of duplicates)
  const seenIds = new Set<string>();
  uniqueStories.forEach((story, index) => {
    if (seenIds.has(story.id)) {
      // Make ID unique by appending index
      story.id = `${story.id}-${index}`;
    }
    seenIds.add(story.id);
  });

  // Filter stories to only include those from the last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0); // Set to start of day for consistent comparison
  
  const recentStories = uniqueStories.filter(story => {
    try {
      const storyDate = new Date(story.pubDate);
      // Check if date is valid
      if (isNaN(storyDate.getTime())) {
        console.warn(`Invalid date for story: ${story.title} - ${story.pubDate}`);
        return false;
      }
      // Compare dates (stories from 30 days ago or newer)
      return storyDate >= thirtyDaysAgo;
    } catch (error) {
      console.warn(`Error parsing date for story: ${story.title} - ${story.pubDate}`, error);
      return false;
    }
  });

  // Sort by publication date (newest first)
  recentStories.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Return all stories from the last 30 days
  return recentStories;
}
