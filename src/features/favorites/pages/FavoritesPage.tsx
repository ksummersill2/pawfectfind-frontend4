import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bone, Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import SEO from '../../common/components/SEO';
import ProductCard from '../../products/components/ProductCard';
import ProductComparison from '../../products/components/ProductComparison';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { Product } from '../../products/types';

const FavoritesPage: React.FC = () => {
  const { favoriteProducts, favorites, loading, error, toggleFavorite } = useFavorites();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleCompareToggle = (product: Product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length < 3) {
        return [...prev, product];
      }
      return prev;
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="My Favorites"
        description="View and manage your favorite pet products"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Favorites
            </h1>
          </div>
          {selectedProducts.length > 0 && (
            <button
              onClick={() => setShowComparison(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Compare ({selectedProducts.length})
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <Bone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start adding products to your favorites to see them here
            </p>
            <Link
              to="/category/all"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                isCompareSelected={selectedProducts.some(p => p.id === product.id)}
                onCompareToggle={() => handleCompareToggle(product)}
              />
            ))}
          </div>
        )}

        {showComparison && selectedProducts.length > 0 && (
          <ProductComparison
            products={selectedProducts}
            onClose={() => {
              setShowComparison(false);
              setSelectedProducts([]);
            }}
            onRemoveProduct={(productId) => {
              setSelectedProducts(prev => prev.filter(p => p.id !== productId));
            }}
          />
        )}
      </div>
    </>
  );
};

export default FavoritesPage;