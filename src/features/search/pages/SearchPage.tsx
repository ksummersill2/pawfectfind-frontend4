import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import { useSearch } from '../hooks';
import { useDogProfiles } from '../../dogs/hooks';
import SearchResults from '../components/SearchResults';
import SearchFilters from '../components/SearchFilters';
import SEO from '../../common/components/SEO';
import { SearchFilters as SearchFiltersType } from '../hooks/types';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { dogs, activeDogId } = useDogProfiles();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({
    priceRange: [0, 200],
    sortBy: 'popular'
  });

  const { results, loading, error } = useSearch(query, filters);

  // Auto-set breed filter if active dog is selected
  useEffect(() => {
    if (activeDogId) {
      const activeDog = dogs.find(dog => dog.id === activeDogId);
      if (activeDog) {
        setFilters(prev => ({
          ...prev,
          breed: activeDog.breed
        }));
      }
    }
  }, [activeDogId, dogs]);

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <>
      <SEO 
        title={`Search Results for "${query}"`}
        description={`Browse search results for "${query}" - Find the perfect products for your pet`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Search Results for "{query}"
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-1 ${showFilters ? 'transform rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {showFilters && (
            <div className="lg:col-span-1">
              <SearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}

          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <SearchResults
              results={results}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;