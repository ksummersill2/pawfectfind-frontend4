import React from 'react';
import { Sparkles } from 'lucide-react';
import { Product } from '../../products/types';
import ProductCard from '../../products/components/ProductCard';
import { useFavorites } from '../../favorites/hooks';

interface RecommendedProductsProps {
  products: Product[];
  selectedProducts: string[];
  onAddProduct: (product: Product) => void;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  products,
  selectedProducts,
  onAddProduct
}) => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recommended Products
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={toggleFavorite}
            onAddToBundle={() => onAddProduct(product)}
            isInBundle={selectedProducts.includes(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;