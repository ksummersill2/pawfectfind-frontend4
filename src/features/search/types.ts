export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  popularity: number;
  discount: number;
  vendor: string;
  image: string;
  additional_images?: string[];
  category_id: string;
  tags: string[];
  affiliate_type?: 'amazon' | null;
  affiliate_link?: string;
  is_black_friday?: boolean;
  black_friday_price?: number;
}

export interface SearchFilters {
  priceRange?: [number, number];
  breed?: string;
  vendors?: string[];
  sortBy?: 'popular' | 'rating' | 'price-asc' | 'price-desc';
}

export * from './hooks/types';