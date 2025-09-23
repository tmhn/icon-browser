import Fuse from 'fuse.js';
import { Icon, SearchFilters, SearchResult } from '@/types/icon';

// Configure Fuse.js for fuzzy search
const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'category', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'synonyms', weight: 0.1 }
  ],
  threshold: 0.4, // Lower threshold = more strict matching
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  findAllMatches: true
};

export class IconSearch {
  private fuse: Fuse<Icon>;

  constructor(icons: Icon[]) {
    this.fuse = new Fuse(icons, fuseOptions);
  }

  search(query: string, filters: SearchFilters = {}): SearchResult[] {
    if (!query.trim()) {
      return this.getAllIcons(filters);
    }

    const searchResults = this.fuse.search(query);
    
    return searchResults
      .map(result => ({
        icon: result.item,
        score: result.score || 0,
        matchedFields: result.matches?.map(match => match.key) || []
      }))
      .filter(result => this.matchesFilters(result.icon, filters))
      .sort((a, b) => a.score - b.score); // Lower score = better match
  }

  private getAllIcons(filters: SearchFilters): SearchResult[] {
    return this.fuse.getIndex()
      .docs
      .filter(icon => this.matchesFilters(icon, filters))
      .map(icon => ({
        icon,
        score: 0,
        matchedFields: []
      }));
  }

  private matchesFilters(icon: Icon, filters: SearchFilters): boolean {
    if (filters.category && icon.category !== filters.category) {
      return false;
    }

    if (filters.format && icon.format !== filters.format) {
      return false;
    }

    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        icon.tags.includes(tag) || icon.synonyms.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  }

  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query.trim()) return [];

    const results = this.fuse.search(query);
    const suggestions = new Set<string>();

    results.forEach(result => {
      // Add the icon name
      suggestions.add(result.item.name);
      
      // Add matching synonyms
      result.matches?.forEach(match => {
        if (match.key === 'synonyms' && match.value) {
          suggestions.add(match.value as string);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  getCategories(): string[] {
    const categories = new Set<string>();
    this.fuse.getIndex().docs.forEach(icon => {
      categories.add(icon.category);
    });
    return Array.from(categories).sort();
  }

  getFormats(): string[] {
    const formats = new Set<string>();
    this.fuse.getIndex().docs.forEach(icon => {
      formats.add(icon.format);
    });
    return Array.from(formats).sort();
  }

  getTags(): string[] {
    const tags = new Set<string>();
    this.fuse.getIndex().docs.forEach(icon => {
      icon.tags.forEach(tag => tags.add(tag));
      icon.synonyms.forEach(synonym => tags.add(synonym));
    });
    return Array.from(tags).sort();
  }
}
