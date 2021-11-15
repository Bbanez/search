export interface SearchSetItem {
  id: string;
  data: string[];
}

export interface SearchResultItem {
  id: string;
  score: number;
  matches: number;
  positions: number[][];
}

export interface SearchResult {
  items: SearchResultItem[];
}

export interface SearchScoreTransFunction {
  (position: number): number;
}
