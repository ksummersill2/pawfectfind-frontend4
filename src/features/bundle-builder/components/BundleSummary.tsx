import React from 'react';
import { X, Gift, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../products/types';
import { formatCurrency } from '../../../utils/formatters';

interface BundleSummaryProps {
  items: Product[];
  onRemoveItem: (productId: string) => void;
  onComplete: () => void;
}

const BundleSummary: React.FC<BundleSummaryProps> = ({ items, onRemoveItem, onComplete }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = items.length >= 3 ? 0.15 : items.length >= 2 ? 0.10 : 0;
  const total = subtotal * (1 - discount);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Gift className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Bundle
          </h2>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {items.length === 0 ? (
            'Add items to your bundle to get started'
          ) : (
            `${items.length} ${items.length === 1 ? 'item' : 'items'} in your bundle`
          )}
        </div>
      </div>

      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Your bundle is empty
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}

            <div className="border-t dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Bundle Discount</span>
                  <span>-{(discount * 100).toFixed(0)}%</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button 
              onClick={onComplete}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Check className="w-5 h-5 mr-2" />
              Complete Bundle
            </button>

            {items.length > 0 && items.length < 3 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                Add {3 - items.length} more {items.length === 2 ? 'item' : 'items'} to save 15%
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleSummary;