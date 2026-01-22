import { useEffect, useState } from 'react';
import { FeedItem, AggregatedFeed } from '../types/feed';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface FeedStoriesProps {
  limit?: number;
  sources?: string[]; // e.g., ['Cycling News', 'BikeRadar Road']
  categories?: string[]; // e.g., ['pro', 'gear', 'industry', 'inspiration']
  showLastUpdated?: boolean;
  accentColor?: string; // For styling to match page theme
  gridLayout?: boolean; // Whether to use grid card layout
}

export function FeedStories({ 
  limit = 15, 
  sources,
  categories,
  showLastUpdated = true,
  accentColor = '#DFFF00',
  gridLayout = false
}: FeedStoriesProps) {
  const [stories, setStories] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);


  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from backend API (add cache-busting to ensure fresh data)
        const response = await fetch(`/api/feeds?t=${Date.now()}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch feeds:', errorText);
          throw new Error(`Failed to fetch feeds: ${response.status} ${response.statusText}`);
        }

        const data: AggregatedFeed = await response.json();
        
        // Convert ISO date strings back to Date objects
        const storiesWithDates: FeedItem[] = (data.stories || []).map((story: any) => {
          // Get image value - check multiple ways to ensure we capture it
          let imageValue: string | undefined = undefined;
          
          // Try direct property access
          if (story.image) {
            if (typeof story.image === 'string' && story.image.trim().length > 0) {
              imageValue = story.image.trim();
            }
          }
          
          // Also check for alternative property names (just in case)
          if (!imageValue && (story as any).imageUrl) {
            imageValue = String((story as any).imageUrl).trim();
          }
          if (!imageValue && (story as any).img) {
            imageValue = String((story as any).img).trim();
          }
          
          // Explicitly map all properties to ensure image is preserved
          const mapped: FeedItem = {
            id: String(story.id || ''),
            title: String(story.title || ''),
            description: String(story.description || ''),
            link: String(story.link || ''),
            pubDate: new Date(story.pubDate),
            source: story.source,
            image: imageValue, // Preserve image exactly as received
          };
          
          return mapped;
        });
        
        // Filter by sources if specified
        let filtered = storiesWithDates;
        if (sources && sources.length > 0) {
          // Log available source names
          const availableSources = new Set<string>();
          filtered.forEach(story => {
            availableSources.add(story.source.name);
          });
          
          filtered = filtered.filter(story => {
            // Try exact match first, then partial match
            const matches = sources.some(sourceName => {
              const storySourceLower = story.source.name.toLowerCase();
              const filterSourceLower = sourceName.toLowerCase();
              return storySourceLower === filterSourceLower || 
                     storySourceLower.includes(filterSourceLower) ||
                     filterSourceLower.includes(storySourceLower);
            });
            return matches;
          });
          
          if (filtered.length === 0) {
            console.warn(`No stories match sources: ${sources.join(', ')}`);
            console.warn(`Available sources: ${Array.from(availableSources).join(', ')}`);
          }
        }
        
        // Filter by categories if specified
        if (categories && categories.length > 0) {
          const availableCategories = new Set<string>();
          filtered.forEach(story => {
            const storyCats = story.source.categories || [];
            storyCats.forEach((cat: string) => availableCategories.add(cat));
          });
          
          filtered = filtered.filter(story => {
            const storyCategories = story.source.categories || [];
            const matches = categories.some(cat => 
              storyCategories.includes(cat)
            );
            return matches;
          });
          
          if (filtered.length === 0) {
            console.warn(`No stories match categories: ${categories.join(', ')}`);
            console.warn(`Available categories: ${Array.from(availableCategories).join(', ')}`);
            // Fallback: show all stories if category filter results in empty
            filtered = storiesWithDates;
          }
        }
        
        // Sort to prioritize images, then by date (newest first)
        // This ensures stories with images appear first, regardless of source
        const sorted = [...filtered].sort((a, b) => {
          const aHasImage = !!a.image;
          const bHasImage = !!b.image;
          const aDate = new Date(a.pubDate).getTime();
          const bDate = new Date(b.pubDate).getTime();
          
          // Primary sort: prioritize images
          if (aHasImage && !bHasImage) return -1;
          if (!aHasImage && bHasImage) return 1;
          
          // Secondary sort: by date (newest first)
          return bDate - aDate;
        });
        
        // Ensure source diversity: limit stories per source, but prioritize images
        const maxPerSource = Math.ceil(limit / 3); // Max 4 per source for 12 total
        const sourceCounts = new Map<string, number>();
        const usedStoryIds = new Set<string>();
        const finalStories: FeedItem[] = [];
        
        // First pass: prioritize stories with images per source
        for (const story of sorted) {
          if (usedStoryIds.has(story.id)) continue;
          
          const sourceName = story.source.name;
          const count = sourceCounts.get(sourceName) || 0;
          
          // If source hasn't reached max, add story (preferring ones with images due to sort order)
          if (count < maxPerSource) {
            finalStories.push(story);
            usedStoryIds.add(story.id);
            sourceCounts.set(sourceName, count + 1);
            
            if (finalStories.length >= limit) {
              break;
            }
          }
        }
        
        // Second pass: fill remaining slots with best remaining stories (prioritizing images)
        if (finalStories.length < limit) {
          for (const story of sorted) {
            if (!usedStoryIds.has(story.id)) {
              finalStories.push(story);
              usedStoryIds.add(story.id);
              if (finalStories.length >= limit) break;
            }
          }
        }
        
        
        setStories(finalStories);
        setLastUpdated(new Date(data.lastUpdated));
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load cycling news. Please try again.'
        );
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, [limit, sources, categories]);

  if (loading) {
    if (gridLayout) {
      return (
        <>
          {Array.from({ length: limit || 12 }).map((_, i) => (
            <div key={i} className="bg-[#111] border border-white/10 h-full animate-pulse">
              <div className="h-48 bg-gray-800"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                <div className="h-6 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </>
      );
    }
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    if (gridLayout) {
      return (
        <div className="col-span-full p-8 bg-[#111] border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-medium">Unable to load stories</p>
          <p className="text-red-500/70 text-sm mt-1">{error}</p>
        </div>
      );
    }
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-medium">Unable to load stories</p>
        <p className="text-red-700 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (stories.length === 0) {
    if (gridLayout) {
      return (
        <div className="col-span-full p-8 bg-[#111] border border-white/10 rounded-lg text-center">
          <p className="text-gray-400">No stories available at the moment.</p>
        </div>
      );
    }
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-700">No stories available at the moment.</p>
      </div>
    );
  }

  if (gridLayout) {
    // Debug: Always log when rendering
    console.log('🎨 Rendering FeedStories in grid layout:', {
      totalStories: stories.length,
      storiesWithImages: stories.filter(s => s.image).length,
      firstStoryImage: stories[0]?.image
    });
    
    return (
      <>
        {stories.map((story, index) => (
          <StoryCard 
            key={`${story.id}-${story.link}-${index}`} 
            story={story} 
            accentColor={accentColor}
            delay={index * 0.1}
            gridLayout={true}
          />
        ))}
        {lastUpdated && showLastUpdated && (
          <div className="col-span-full text-xs text-gray-500 pt-4 border-t border-white/10 text-center">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="space-y-4">
      {stories.map((story, index) => (
        <StoryCard key={`${story.id}-${story.link}-${index}`} story={story} accentColor={accentColor} />
      ))}

      {lastUpdated && showLastUpdated && (
        <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
}

function StoryCard({ 
  story, 
  accentColor = '#DFFF00',
  delay = 0,
  gridLayout = false
}: { 
  story: FeedItem;
  accentColor?: string;
  delay?: number;
  gridLayout?: boolean;
}) {
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return dateObj.toLocaleDateString();
  };

  const formatDateForCard = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'TODAY';
    if (diffHours < 24) return 'TODAY';
    if (diffDays === 1) return 'YESTERDAY';
    if (diffDays < 7) return `${diffDays} DAYS AGO`;
    
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  if (gridLayout) {
    const CardWrapper = motion.article;
    
    return (
      <CardWrapper
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="group relative bg-[#111] border border-white/10 hover:border-white/20 transition-colors h-full flex flex-col cursor-pointer"
      >
        <a
          href={story.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-[1]"
          aria-label={`Read article: ${story.title}`}
          onClick={(e) => {
            // Allow the link to work normally
            e.stopPropagation();
          }}
        />
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {story.image && story.image.trim() ? (
            <>
              <img
                key={`img-${story.id}`}
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                loading="lazy"
                style={{ display: 'block' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const container = target.parentElement;
                  if (container) {
                    const existing = container.querySelector('.image-error-fallback');
                    if (!existing) {
                      const fallback = document.createElement('div');
                      fallback.className = 'image-error-fallback absolute inset-0 bg-red-900/20 flex items-center justify-center';
                      fallback.innerHTML = '<span class="text-red-400 text-xs">Image Error</span>';
                      container.appendChild(fallback);
                    }
                  }
                }}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <span className="text-gray-600 text-xs uppercase tracking-widest">
                {story.image ? `Invalid: ${story.image.substring(0, 20)}` : 'No Image'}
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span
              className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black pointer-events-auto"
              style={{ backgroundColor: accentColor }}
            >
              {story.source.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow pointer-events-none">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs text-gray-500 font-mono">{formatDateForCard(story.pubDate)}</span>
            <ArrowUpRight className="w-5 h-5 text-gray-600 transition-colors group-hover:text-white" />
          </div>

          <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
            {story.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
            {story.description}
          </p>

          <div className="w-full h-px bg-white/10 group-hover:bg-white/30 transition-colors" />
        </div>

        {/* Hover Border Effect */}
        <div
          className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full`}
          style={{ backgroundColor: accentColor }}
        />
      </CardWrapper>
    );
  }

  // Original list layout (for backwards compatibility)
  return (
    <article className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative">
      <a
        href={story.link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-[1]"
        aria-label={`Read article: ${story.title}`}
      />
      {/* Source Badge */}
      <div className="flex items-start justify-between gap-3 mb-2 relative z-10 pointer-events-none">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${story.source.color}`}>
          {story.source.name}
        </span>
        <time className="text-xs text-gray-500 whitespace-nowrap">
          {formatDate(story.pubDate)}
        </time>
      </div>

      {/* Image (if available) */}
      {story.image && (
        <div className="mb-3 rounded overflow-hidden bg-gray-100 h-32 sm:h-40 relative z-10 pointer-events-none">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight hover:text-blue-600 relative z-10 pointer-events-none">
        {story.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2 relative z-10 pointer-events-none">
        {story.description}
      </p>

      {/* Read More Link */}
      <div className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm relative z-10 pointer-events-none">
        Read more
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </article>
  );
}
