import React from 'react';
import { Link } from 'react-router-dom';
import { Star, SplitSquareHorizontal, ExternalLink, Plus, Check } from 'lucide-react';
import PawIcon from '../../../components/icons/PawIcon';
import { Product } from '../types';
import { formatCurrency } from '../../../utils/formatters';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCompareToggle?: () => void;
  onAddToBundle?: () => void;
  isInBundle?: boolean;
  actionButton?: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onCompareToggle,
  onAddToBundle,
  isInBundle,
  actionButton
}) => {
  const handleAddToBundle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToBundle) {
      onAddToBundle();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative group">
      <div className="absolute top-2 right-2 z-10 flex space-x-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <PawIcon
            className={`w-5 h-5 transform transition-transform ${
              isFavorite
                ? 'text-blue-500 fill-current rotate-12'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          />
        </button>
        {onCompareToggle && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompareToggle();
            }}
            className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
            aria-label="Compare product"
          >
            <SplitSquareHorizontal className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      {product.discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium z-10">
          {product.discount}% OFF
        </div>
      )}

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          {product.affiliate_type && (
            <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
              <ExternalLink className="w-3 h-3" />
              <span>{product.affiliate_type === 'amazon' ? 'Amazon' : 'Affiliate'}</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{product.vendor}</p>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{product.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">${product.price}</span>
              {product.discount > 0 && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${(product.price * (100 + product.discount) / 100).toFixed(2)}
                </span>
              )}
            </div>
            {actionButton || (onAddToBundle && (
              <button 
                onClick={handleAddToBundle}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  isInBundle
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isInBundle ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Bundle
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;