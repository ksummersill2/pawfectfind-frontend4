import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { useFavorites } from '../../favorites/hooks';

interface ProductListProps {
  products: Product[];
  onCompareToggle?: (product: Product) => void;
  selectedForComparison?: Product[];
  loading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onCompareToggle,
  selectedForComparison = [],
  loading = false
}) => {
  const { favorites, toggleFavorite } = useFavorites();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.includes(product.id)}
          onToggleFavorite={toggleFavorite}
          isCompareSelected={selectedForComparison?.some(p => p.id === product.id)}
          onCompareToggle={onCompareToggle ? () => onCompareToggle(product) : undefined}
        />
      ))}
    </div>
  );
};

export default ProductList;