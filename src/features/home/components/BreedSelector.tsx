import React, { useState, useEffect } from 'react';
import { Search, PawPrint } from 'lucide-react';
import { supabase, fetchWithRetry } from '../../../lib/supabase/client';

interface Breed {
  id: string;
  name: string;
  description: string;
  image?: string;
  size_category?: string;
}

interface BreedSelectorProps {
  onBreedSelect: (breed: Breed) => void;
}

const BreedSelector: React.FC<BreedSelectorProps> = ({ onBreedSelect }) => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('dog_breeds')
        .select(`
          id,
          name,
          description,
          breed_size_variations (
            image,
            size_category
          )
        `)
        .order('name');

      if (fetchError) throw fetchError;

      const processedBreeds = (data || []).map(breed => ({
        id: breed.id,
        name: breed.name,
        description: breed.description,
        image: breed.breed_size_variations?.[0]?.image || null,
        size_category: breed.breed_size_variations?.[0]?.size_category
      }));

      setBreeds(processedBreeds);
    } catch (err) {
      console.error('Error in fetchBreeds:', err);
      setError('Unable to load breeds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for your perfect breed..."
          className="w-full pl-12 pr-4 py-4 text-lg border rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchBreeds}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBreeds.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No breeds found matching your search.
              </p>
            </div>
          ) : (
            filteredBreeds.map((breed) => (
              <button
                key={breed.id}
                onClick={() => onBreedSelect(breed)}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
                  {breed.image ? (
                    <img
                      src={breed.image}
                      alt={breed.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PawPrint className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {breed.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {breed.size_category ? `${breed.size_category} Size` : 'Size varies'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BreedSelector;