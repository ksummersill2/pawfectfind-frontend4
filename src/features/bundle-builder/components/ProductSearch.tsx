import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Product } from '../../products/types';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  categories: string[];
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearch, onFilterChange, categories }) => {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onFilterChange({ categories: newCategories, priceRange });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryToggle(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategories.includes(category)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">Price Range:</span>
        <input
          type="range"
          min="0"
          max="200"
          value={priceRange[0]}
          onChange={(e) => {
            const newRange: [number, number] = [Number(e.target.value), priceRange[1]];
            setPriceRange(newRange);
            onFilterChange({ categories: selectedCategories, priceRange: newRange });
          }}
          className="flex-1"
        />
        <input
          type="range"
          min="0"
          max="200"
          value={priceRange[1]}
          onChange={(e) => {
            const newRange: [number, number] = [priceRange[0], Number(e.target.value)];
            setPriceRange(newRange);
            onFilterChange({ categories: selectedCategories, priceRange: newRange });
          }}
          className="flex-1"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ${priceRange[0]} - ${priceRange[1]}
        </span>
      </div>
    </div>
  );
};

export default ProductSearch;