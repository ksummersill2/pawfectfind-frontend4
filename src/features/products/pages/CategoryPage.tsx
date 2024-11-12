import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { useFavorites } from '../../favorites/hooks';
import { useDogProfiles } from '../../dogs/hooks';
import { useBreedProducts } from '../hooks/useBreedProducts';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import ErrorMessage from '../../common/components/ErrorMessage';
import { categories } from '../data/categories';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { dogs, activeDogId } = useDogProfiles();
  const [showFilters, setShowFilters] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);

  const category = categoryId === 'all' 
    ? { id: 'all', name: 'All Products', description: 'Browse our complete collection of pet products' }
    : categories.find(c => c.id === categoryId);

  // Get active dog's breed
  const activeDog = dogs.find(dog => dog.id === activeDogId);

  // Initialize breed filter from URL params or active dog
  useEffect(() => {
    const breedFromUrl = searchParams.get('breed');
    if (breedFromUrl) {
      setSelectedBreed(decodeURIComponent(breedFromUrl));
    } else if (activeDog) {
      setSelectedBreed(activeDog.breed);
      // Update URL with breed filter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('breed', activeDog.breed);
      navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
    }
  }, [activeDog, searchParams]);

  // Use the new breed products hook
  const { products, loading, error } = useBreedProducts({
    breed: selectedBreed,
    categoryId
  });

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  const handleCategoryChange = (newCategoryId: string) => {
    // Preserve breed filter when changing categories
    const newSearchParams = new URLSearchParams(searchParams);
    if (selectedBreed) {
      newSearchParams.set('breed', selectedBreed);
    }
    navigate(`/category/${newCategoryId}?${newSearchParams.toString()}`);
  };

  const handleBreedChange = (breed: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (breed) {
      newSearchParams.set('breed', breed);
    } else {
      newSearchParams.delete('breed');
    }
    setSelectedBreed(breed);
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  if (!category) {
    return <ErrorMessage message="Category not found" />;
  }

  return (
    <>
      <SEO
        title={`${category.name}${selectedBreed ? ` for ${selectedBreed}s` : ''}`}
        description={category.description}
        type="category"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {category.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {category.description}
            </p>
            {selectedBreed && (
              <div className="mt-2 flex items-center">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  Showing products for {selectedBreed}s
                </span>
                <button
                  onClick={() => handleBreedChange(null)}
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  (Show All)
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-1 ${showFilters ? 'transform rotate-180' : ''}`} />
          </button>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryId === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryId === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="mb-6">
            <ProductFilters
              selectedBreed={selectedBreed}
              onBreedChange={handleBreedChange}
              onFilterChange={(filters) => {
                // Handle other filter changes
                console.log('Filters:', filters);
              }}
            />
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No products found {selectedBreed ? `for ${selectedBreed}s` : ''} in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;