import React from 'react';
import { ChevronUp, ChevronDown, X, Gift } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { Product } from '../../products/types';

interface BundleItem extends Product {
  bundleItemId: string;
}

interface MiniBundleSummaryProps {
  items: BundleItem[];
  onRemoveItem: (bundleItemId: string) => void;
  expanded: boolean;
  onToggle: () => void;
  onComplete: () => void;
  isSubmitting?: boolean;
}

export const MiniBundleSummary: React.FC<MiniBundleSummaryProps> = ({
  items,
  onRemoveItem,
  expanded,
  onToggle,
  onComplete,
  isSubmitting = false
}) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const discountPercentage = items.length >= 3 ? 15 : items.length >= 2 ? 10 : 0;
  const finalPrice = total * (1 - discountPercentage / 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Gift className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bundle Summary ({items.length} items)
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total: {formatCurrency(total)}
                </div>
                {discountPercentage > 0 && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    {discountPercentage}% Bundle Discount
                  </div>
                )}
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  Final Price: {formatCurrency(finalPrice)}
                </div>
              </div>
              <button
                onClick={onComplete}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Complete Bundle'}
              </button>
              <button
                onClick={onToggle}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                {expanded ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {expanded && (
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <div
                  key={item.bundleItemId}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.bundleItemId)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniBundleSummary;