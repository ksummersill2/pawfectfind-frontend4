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
  breed_recommendations?: {
    breed_id: string;
    recommendation_strength: number;
  }[];
  breeds?: {
    id: string;
    name: string;
  }[];
}

export interface ProductFilters {
  priceRange?: [number, number];
  breed?: string;
  vendors?: string[];
  sortBy?: 'popular' | 'rating' | 'price-asc' | 'price-desc';
}

export interface Review {
  id: number;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export * from '../hooks/types';