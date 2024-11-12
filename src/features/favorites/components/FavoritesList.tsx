import React from 'react';
import { Product } from '../../products/types';
import ProductCard from '../../products/components/ProductCard';

interface FavoritesListProps {
  products: Product[];
  onToggleFavorite: (id: string) => void;
  favorites: string[];
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  products,
  onToggleFavorite,
  favorites
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default FavoritesList;