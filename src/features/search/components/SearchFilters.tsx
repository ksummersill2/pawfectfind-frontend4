import React from 'react';
import { Filter, ChevronDown, ChevronUp, Tag, DollarSign, Star, Package } from 'lucide-react';
import { BreedSelect } from '../../dogs/components';
import { SearchFilters as SearchFiltersType } from '../hooks/types';
import { useDogProfiles } from '../../dogs/hooks';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  const { dogs, activeDogId } = useDogProfiles();
  const [selectedVendors, setSelectedVendors] = React.useState<string[]>(filters.vendors || []);

  const vendors = [
    'PawNatural',
    'SmartPup',
    'ComfortPets',
    'HealthyHound',
    'PetPremium'
  ];

  const handlePriceRangeChange = (min: number, max: number) => {
    onFilterChange({
      ...filters,
      priceRange: [min, max]
    });
  };

  const handleBreedChange = (breed: string) => {
    onFilterChange({
      ...filters,
      breed: breed || undefined
    });
  };

  const handleVendorChange = (vendor: string) => {
    const updatedVendors = selectedVendors.includes(vendor)
      ? selectedVendors.filter(v => v !== vendor)
      : [...selectedVendors, vendor];
    
    setSelectedVendors(updatedVendors);
    onFilterChange({
      ...filters,
      vendors: updatedVendors.length > 0 ? updatedVendors : undefined
    });
  };

  const handleSortChange = (sortBy: SearchFiltersType['sortBy']) => {
    onFilterChange({
      ...filters,
      sortBy
    });
  };

  // Get active dog's breed
  const activeDog = dogs.find(dog => dog.id === activeDogId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
      {/* Price Range */}
      <div>
        <div className="flex items-center mb-2">
          <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Price Range
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="0"
              value={filters.priceRange?.[0] || 0}
              onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange?.[1] || 1000)}
              className="w-24 px-3 py-1 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              min="0"
              value={filters.priceRange?.[1] || 1000}
              onChange={(e) => handlePriceRangeChange(filters.priceRange?.[0] || 0, Number(e.target.value))}
              className="w-24 px-3 py-1 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Breed Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-1 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Breed
            </h3>
          </div>
          {activeDog && (
            <button
              onClick={() => handleBreedChange(activeDog.breed)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Use {activeDog.name}'s Breed
            </button>
          )}
        </div>
        <BreedSelect
          value={filters.breed || ''}
          onChange={handleBreedChange}
          placeholder="All breeds"
        />
      </div>

      {/* Vendors */}
      <div>
        <div className="flex items-center mb-2">
          <Package className="w-4 h-4 mr-1 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Vendors
          </h3>
        </div>
        <div className="space-y-2">
          {vendors.map((vendor) => (
            <label key={vendor} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedVendors.includes(vendor)}
                onChange={() => handleVendorChange(vendor)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {vendor}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 mr-1 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
          </h3>
        </div>
        <select
          value={filters.sortBy || 'popular'}
          onChange={(e) => handleSortChange(e.target.value as SearchFiltersType['sortBy'])}
          className="w-full px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
        >
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;