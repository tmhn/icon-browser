export interface Icon {
  id: string;
  name: string;
  displayName: string;
  filename: string;
  slug: string;
  format: string;
  category: string;
  categoryId: string;
  tags: string[];
  synonyms: string[];
  filePath: string;
  size?: {
    width: number;
    height: number;
  };
  description: string;
}

export interface IconCategory {
  id: string;
  name: string;
  description?: string;
  iconCount: number;
}

export interface SearchFilters {
  category?: string;
  format?: string;
  tags?: string[];
}

export interface SearchResult {
  icon: Icon;
  score: number;
  matchedFields: string[];
}
