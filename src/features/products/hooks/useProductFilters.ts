import { useState, useEffect } from 'react';
import { useDogProfiles } from '../../dogs/hooks';
import { ProductFilters } from '../types';

export const useProductFilters = () => {
  const { dogs, activeDogId } = useDogProfiles();
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  // Automatically set filters based on active dog
  useEffect(() => {
    if (activeDogId) {
      const activeDog = dogs.find(dog => dog.id === activeDogId);
      if (activeDog) {
        setSelectedBreed(activeDog.breed);
        
        // Determine size category based on weight
        const weight = activeDog.weight;
        let size = '';
        if (weight <= 4) size = 'toy';
        else if (weight <= 12) size = 'mini';
        else if (weight <= 25) size = 'small';
        else if (weight <= 50) size = 'medium';
        else if (weight <= 90) size = 'large';
        else size = 'giant';
        
        setSelectedSize(size);
      }
    }
  }, [activeDogId, dogs]);

  const filters: ProductFilters = {
    priceRange,
    breed: selectedBreed || undefined,
    vendors: selectedVendors.length > 0 ? selectedVendors : undefined,
    sortBy
  };

  return {
    filters,
    selectedBreed,
    setSelectedBreed,
    selectedSize,
    setSelectedSize,
    priceRange,
    setPriceRange,
    selectedVendors,
    setSelectedVendors,
    sortBy,
    setSortBy,
    clearFilters: () => {
      setSelectedBreed('');
      setSelectedSize('');
      setPriceRange([0, 200]);
      setSelectedVendors([]);
      setSortBy('popular');
    }
  };
};

export default useProductFilters;