import { FeedSource } from '../types/feed.js';

export const FEED_SOURCES: Record<string, FeedSource> = {
  bikerumor: {
    name: 'Bike Rumor',
    url: 'https://bikerumor.com/feed/',
    color: 'bg-purple-100 text-purple-800',
    categories: ['gear', 'industry'], // Tech/gear news and industry updates
  },
  bikeradar_news: {
    name: 'BikeRadar News',
    url: 'https://feeds.purplemanager.com/193c804a-a673-47bd-b09b-11baf4822a17/bikeradar-news',
    color: 'bg-red-100 text-red-800',
    categories: ['industry', 'gear'], // General industry and gear news
  },
  bikeradar_road: {
    name: 'BikeRadar Road',
    url: 'https://feeds.purplemanager.com/193c804a-a673-47bd-b09b-11baf4822a17/bikeradar-road-news',
    color: 'bg-red-100 text-red-800',
    categories: ['pro'], // Pro racing and road cycling
  },
  bikeradar_mtb: {
    name: 'BikeRadar MTB',
    url: 'https://feeds.purplemanager.com/193c804a-a673-47bd-b09b-11baf4822a17/bikeradar-mtb-feed',
    color: 'bg-green-100 text-green-800',
    categories: ['gear', 'inspiration'], // MTB gear and ride inspiration
  },
  bikeradar_gravel: {
    name: 'BikeRadar Gravel',
    url: 'https://feeds.purplemanager.com/193c804a-a673-47bd-b09b-11baf4822a17/bikeradar-gravel-feed',
    color: 'bg-amber-100 text-amber-800',
    categories: ['gear', 'inspiration'], // Gravel gear and adventure inspiration
  },
  pinkbike: {
    name: 'Pinkbike',
    url: 'https://www.pinkbike.com/pinkbike_xml_feed.php',
    color: 'bg-pink-100 text-pink-800',
    categories: ['inspiration', 'gear'], // Videos, rides, and MTB gear
  },
  bikepacking: {
    name: 'Bikepacking.com',
    url: 'https://bikepacking.com/feed/',
    color: 'bg-cyan-100 text-cyan-800',
    categories: ['inspiration'], // Routes, stories, and bikepacking inspiration
  },
  bicycleretailer: {
    name: 'Bicycle Retailer',
    url: 'https://www.bicycleretailer.com/taxonomy/term/100/feed',
    color: 'bg-blue-100 text-blue-800',
    categories: ['industry'], // Industry news and business updates
  },
  velo: {
    name: 'Velo',
    url: 'https://velo.outsideonline.com/feed/',
    color: 'bg-orange-100 text-orange-800',
    categories: ['pro', 'gear'], // Competitive cycling news, race results, and bike reviews
  },
  cyclingnews: {
    name: 'Cyclingnews',
    url: 'https://www.cyclingnews.com/feeds.xml',
    color: 'bg-indigo-100 text-indigo-800',
    categories: ['pro'], // Pro cycling news, race results, and women's cycling
  },
};
