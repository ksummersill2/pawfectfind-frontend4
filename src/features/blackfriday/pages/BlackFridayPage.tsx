import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Tag, Filter, ChevronDown } from 'lucide-react';
import ProductCard from '../../products/components/ProductCard';
import { useFavorites } from '../../favorites/hooks/useFavorites';
import { Product } from '../../products/types';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import ProductFilters from '../../products/components/ProductFilters';

const BlackFridayPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('discount');
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchBlackFridayProducts();
  }, []);

  const fetchBlackFridayProducts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('is_black_friday', true)
        .order('black_friday_price', { ascending: true });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching Black Friday products:', err);
      setError('Failed to load Black Friday deals');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(p => p.black_friday_price >= priceRange[0] && p.black_friday_price <= priceRange[1])
    .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category_id))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.black_friday_price || a.price) - (b.black_friday_price || b.price);
        case 'price-desc':
          return (b.black_friday_price || b.price) - (a.black_friday_price || a.price);
        case 'discount':
          return b.discount - a.discount;
        default:
          return 0;
      }
    });

  const calculateSavings = (product: Product) => {
    if (!product.black_friday_price) return 0;
    return product.price - product.black_friday_price;
  };

  return (
    <>
      <SEO 
        title="Black Friday Deals - PawfectFind"
        description="Discover amazing Black Friday deals on premium pet products. Save big on food, toys, accessories and more for your furry friend."
        image="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/50 rounded-full mb-4">
            <Tag className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Black Friday Deals
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exclusive discounts on premium pet products. Limited time offers available.
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-1 ${showFilters ? 'transform rotate-180' : ''}`} />
            </button>
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear filters
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            <option value="discount">Biggest Savings</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
            <ProductFilters
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
            />
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                savings={calculateSavings(product)}
              />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No Black Friday deals found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default BlackFridayPage;