import { Product } from '../../products/types';

export interface FavoritesHook {
  favorites: string[];
  favoriteProducts: Product[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (productId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}