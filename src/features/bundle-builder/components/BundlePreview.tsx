import React from 'react';
import { Gift, Tag } from 'lucide-react';
import { Product } from '../../products/types';
import { formatCurrency } from '../../../utils/formatters';

interface BundlePreviewProps {
  products: Product[];
  breed?: string;
  discount?: number;
}

const BundlePreview: React.FC<BundlePreviewProps> = ({ products, breed, discount }) => {
  const total = products.reduce((sum, product) => sum + product.price, 0);
  const discountedTotal = discount ? total * (1 - discount / 100) : total;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Preview Grid */}
      <div className="grid grid-cols-2 gap-1 p-1">
        {products.slice(0, 4).map((product) => (
          <div key={product.id} className="aspect-square relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
        {products.length > 4 && (
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              +{products.length - 4} more
            </span>
          </div>
        )}
      </div>

      {/* Bundle Info */}
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Gift className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {breed ? `${breed} Bundle` : 'Custom Bundle'}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(discountedTotal)}
            </div>
            {discount && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(total)}
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-600 text-xs font-medium rounded-full">
                  <Tag className="w-3 h-3 mr-1" />
                  Save {discount}%
                </span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {products.length} items
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundlePreview;