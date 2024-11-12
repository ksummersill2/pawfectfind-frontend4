import React from 'react';
import { Plus, Check, Star } from 'lucide-react';
import { Product } from '../../products/types';
import { formatCurrency } from '../../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onAddToBundle: () => void;
  isInBundle: boolean;
  breedId?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToBundle,
  isInBundle,
  breedId
}) => {
  const isBreedRecommended = breedId && product.product_breed_recommendations?.some(
    rec => rec.breed_id === breedId
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
      isInBundle ? 'ring-2 ring-blue-500' : ''
    }`}>
      <div className="aspect-square relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
            {product.discount}% OFF
          </div>
        )}
        {isBreedRecommended && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Recommended
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 dark:text-white font-medium mb-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(product.price)}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              {product.rating}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>
        <button
          onClick={onAddToBundle}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
            isInBundle
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isInBundle ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Added to Bundle
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add to Bundle
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;