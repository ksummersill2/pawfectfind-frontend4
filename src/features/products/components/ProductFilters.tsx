import React, { useState } from 'react';
import { Slider } from 'lucide-react';
import { useDogProfiles } from '../../dogs/hooks/useDogProfiles';
import { BreedSelect } from '../../dogs/components/BreedSelect';

interface ProductFiltersProps {
  onFilterChange: (filters: {
    priceRange: [number, number];
    breed?: string;
    vendors?: string[];
    sortBy?: string;
  }) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const { dogs, activeDogId } = useDogProfiles();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  const vendors = [
    'PawNatural',
    'SmartPup',
    'ComfortPets',
    'HealthyHound',
    'PetPremium'
  ];

  const handlePriceChange = (value: number, index: number) => {
    const newRange: [number, number] = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);
    onFilterChange({
      priceRange: newRange,
      breed: selectedBreed,
      vendors: selectedVendors,
      sortBy
    });
  };

  const handleVendorToggle = (vendor: string) => {
    const newVendors = selectedVendors.includes(vendor)
      ? selectedVendors.filter(v => v !== vendor)
      : [...selectedVendors, vendor];
    
    setSelectedVendors(newVendors);
    onFilterChange({
      priceRange,
      breed: selectedBreed,
      vendors: newVendors,
      sortBy
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange({
      priceRange,
      breed: selectedBreed,
      vendors: selectedVendors,
      sortBy: value
    });
  };

  const handleBreedChange = (breed: string) => {
    setSelectedBreed(breed);
    onFilterChange({
      priceRange,
      breed,
      vendors: selectedVendors,
      sortBy
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filters
        </h3>
        
        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), 0)}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
                  ${priceRange[0]}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(Number(e.target.value), 1)}
                  className="w-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
                  ${priceRange[1]}
                </span>
              </div>
            </div>
          </div>

          {/* Breed Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Breed
            </label>
            <BreedSelect
              value={selectedBreed}
              onChange={handleBreedChange}
              placeholder="All Breeds"
            />
          </div>

          {/* Vendors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vendors
            </label>
            <div className="space-y-2">
              {vendors.map((vendor) => (
                <label key={vendor} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(vendor)}
                    onChange={() => handleVendorToggle(vendor)}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;