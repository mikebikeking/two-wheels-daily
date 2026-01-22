export interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date | string; // Can be Date or ISO string from API
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
  lastUpdated: Date | string; // Can be Date or ISO string from API
  totalStories: number;
}
