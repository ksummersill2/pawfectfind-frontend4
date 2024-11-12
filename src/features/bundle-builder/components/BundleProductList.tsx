import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Product } from '../../products/types';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { formatCurrency } from '../../../utils/formatters';

interface BundleProductListProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  loading: boolean;
  error: string | null;
  selectedProducts: string[];
}

const BundleProductList: React.FC<BundleProductListProps> = ({
  products,
  onAddProduct,
  loading,
  error,
  selectedProducts
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const isSelected = selectedProducts.includes(product.id);
        
        return (
          <div
            key={product.id}
            className={`bg-white dark:bg-gray-700 rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
              isSelected ? 'ring-2 ring-blue-500' : ''
            }`}
          >
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
            </div>
            
            <div className="p-4">
              <h3 className="text-gray-900 dark:text-white font-medium mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {formatCurrency(product.price)}
              </p>
              <button
                onClick={() => onAddProduct(product)}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSelected ? (
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
      })}
    </div>
  );
};

export default BundleProductList;