import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Dog as DogIcon, Package, Book, MessageCircle, Heart, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Dog } from '../types';
import { DogHealthCard, DogActivityCard, DogGuideCard } from '../components';
import { ProductCard } from '../../products/components';
import { useFavorites } from '../../favorites/hooks';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import ErrorMessage from '../../common/components/ErrorMessage';
import SEO from '../../common/components/SEO';

const DogDashboard: React.FC = () => {
  const { dogId } = useParams<{ dogId: string }>();
  const navigate = useNavigate();
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (dogId) {
      fetchDogData();
    }
  }, [dogId]);

  const fetchDogData = async () => {
    try {
      setLoading(true);
      const { data: dogData, error: dogError } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();

      if (dogError) throw dogError;
      if (!dogData) throw new Error('Dog not found');

      setDog(dogData);

      // Fetch recommended products based on dog's characteristics
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(6);

      if (productsError) throw productsError;
      setRecommendedProducts(products || []);

    } catch (err) {
      console.error('Error fetching dog data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dog data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !dog) {
    return <ErrorMessage message={error || 'Dog not found'} />;
  }

  return (
    <>
      <SEO 
        title={`${dog.name}'s Dashboard`}
        description={`View health metrics, activity tracking, and personalized recommendations for ${dog.name}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                {dog.image ? (
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <DogIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dog.name}'s Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {dog.breed} • {dog.age} years old
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DogHealthCard dog={dog} />
          <DogActivityCard dog={dog} />
          <DogGuideCard dog={dog} />
        </div>

        {/* Recommended Products */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recommended for {dog.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DogDashboard;