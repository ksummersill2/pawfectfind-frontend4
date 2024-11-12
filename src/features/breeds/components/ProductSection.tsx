import React, { useState, useEffect } from 'react';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { ProductCard } from '../../products/components';
import { useFavorites } from '../../favorites/hooks';
import LoadingSpinner from '../../common/components/LoadingSpinner';

interface ProductSectionProps {
  breedId: string;
  breedName: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  vendor: string;
  discount: number;
  recommendation_strength?: number;
}

const ProductSection: React.FC<ProductSectionProps> = ({ breedId, breedName }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchProducts();
  }, [breedId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          rating,
          image,
          vendor,
          discount
        `)
        .limit(6);

      if (fetchError) throw fetchError;

      // Add recommendation strength (simulated for now)
      const recommendedProducts = data?.map(product => ({
        ...product,
        recommendation_strength: Math.floor(Math.random() * 30) + 70 // 70-100% match
      })) || [];

      setProducts(recommendedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load recommended products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
          <ShoppingBag className="w-6 h-6 mr-2" />
          Recommended Products
        </h2>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="text-red-600 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2" />
          Recommended Products
        </h2>
        <Link
          to={`/category/all?breed=${encodeURIComponent(breedName)}`}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center"
        >
          View All
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="relative">
              {product.recommendation_strength && (
                <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {product.recommendation_strength}% Match
                </div>
              )}
              <ProductCard
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            No products recommended yet for {breedName}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductSection;