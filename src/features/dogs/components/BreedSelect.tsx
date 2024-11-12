import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface BreedSelectProps {
  value: string;
  onChange: (breed: string) => void;
  placeholder?: string;
}

interface Breed {
  id: string;
  name: string;
  size_category?: string;
}

export const BreedSelect: React.FC<BreedSelectProps> = ({
  value,
  onChange,
  placeholder = 'Select a breed...'
}) => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('dog_breeds')
        .select('id, name, breed_size_variations(size_category)')
        .order('name');

      if (fetchError) throw fetchError;

      const processedBreeds = data?.map(breed => ({
        id: breed.id,
        name: breed.name,
        size_category: breed.breed_size_variations?.[0]?.size_category
      })) || [];

      setBreeds(processedBreeds);
    } catch (err) {
      console.error('Error fetching breeds:', err);
      setError('Failed to load breeds');
    } finally {
      setLoading(false);
    }
  };

  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedBreed = breeds.find(breed => breed.name === value);

  return (
    <div className="relative">
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm cursor-pointer dark:border-gray-600 dark:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedBreed ? (
          <div className="flex justify-between items-center">
            <span className="text-gray-900 dark:text-white">{selectedBreed.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedBreed.size_category}
            </span>
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
                placeholder="Search breeds..."
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading breeds...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : filteredBreeds.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No breeds found</div>
            ) : (
              <div className="py-2">
                {filteredBreeds.map((breed) => (
                  <button
                    key={breed.id}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      breed.name === value ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => {
                      onChange(breed.name);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 dark:text-white">{breed.name}</span>
                      {breed.size_category && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {breed.size_category}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedSelect;