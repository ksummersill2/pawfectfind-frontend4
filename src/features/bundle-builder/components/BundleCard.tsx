import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Heart, Share2, Package } from 'lucide-react';
import { Bundle } from '../types';
import { formatCurrency } from '../../../utils/formatters';

interface BundleCardProps {
  bundle: Bundle;
  onLike?: () => void;
  onShare?: () => void;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, onLike, onShare }) => {
  const previewProducts = bundle.products.slice(0, 4);
  const remainingProducts = bundle.products.length - 4;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Preview Grid */}
      <div className="grid grid-cols-2 gap-1 p-1">
        {previewProducts.map((product) => (
          <div key={product.id} className="aspect-square relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
            {product.quantity > 1 && (
              <span className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
                ×{product.quantity}
              </span>
            )}
          </div>
        ))}
        {remainingProducts > 0 && (
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              +{remainingProducts} more
            </span>
          </div>
        )}
      </div>

      {/* Bundle Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {bundle.name}
            </h3>
            {bundle.breed && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Perfect for {bundle.breed}s
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onLike}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Heart className={`w-5 h-5 ${bundle.likes ? 'fill-current text-red-500' : ''}`} />
            </button>
            <button
              onClick={onShare}
              className="p-1 text-gray-400 hover:text-blue-500"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(bundle.totalPrice)}
            {bundle.discount && (
              <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                Save {bundle.discount}%
              </span>
            )}
          </div>
          <Link
            to={`/bundle/${bundle.id}`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Package className="w-4 h-4 mr-2" />
            View Bundle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;