import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';
import { Product } from '../../products/types';
import { formatCurrency } from '../../../utils/formatters';

interface BundleCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (name: string) => void;
  items: Product[];
  breed: string;
  defaultName: string;
  isSubmitting?: boolean;
  error?: string | null;
}

const BundleCompletionModal: React.FC<BundleCompletionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  items,
  breed,
  defaultName,
  isSubmitting = false,
  error = null
}) => {
  const [name, setName] = useState(defaultName);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const discountPercentage = items.length >= 3 ? 15 : items.length >= 2 ? 10 : 0;
  const discountAmount = total * (discountPercentage / 100);
  const finalPrice = total - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;
    onComplete(name.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Gift className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Complete Your Bundle
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bundle Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
                placeholder="Enter bundle name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bundle Summary
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Items</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {items.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Breed</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {breed}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <span>Bundle Discount ({discountPercentage}%)</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">Total</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Complete Bundle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BundleCompletionModal;