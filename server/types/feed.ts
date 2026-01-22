export interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string; // ISO string for JSON serialization
  source: FeedSource;
  image?: string;
}

export interface FeedSource {
  name: string;
  url: string;
  color: string; // Tailwind color class
  categories?: string[]; // e.g., ['pro', 'gear', 'industry', 'inspiration']
}

export interface AggregatedFeed {
  stories: FeedItem[];
  lastUpdated: string; // ISO string for JSON serialization
  totalStories: number;
}
