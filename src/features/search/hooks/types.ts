import { Product } from '../types';

export interface SearchFilters {
  priceRange?: [number, number];
  breed?: string;
  vendors?: string[];
  sortBy?: 'popular' | 'rating' | 'price-asc' | 'price-desc';
}

export interface SearchHook {
  results: Product[];
  loading: boolean;
  error: string | null;
}