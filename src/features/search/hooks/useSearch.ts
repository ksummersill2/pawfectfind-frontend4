import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Product } from '../types';
import { SearchFilters } from './types';

export const useSearch = (query: string, filters?: SearchFilters) => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let searchQuery = supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);

        // Apply filters if provided
        if (filters) {
          if (filters.priceRange) {
            searchQuery = searchQuery
              .gte('price', filters.priceRange[0])
              .lte('price', filters.priceRange[1]);
          }

          if (filters.vendors && filters.vendors.length > 0) {
            searchQuery = searchQuery
              .in('vendor', filters.vendors);
          }

          if (filters.sortBy) {
            switch (filters.sortBy) {
              case 'price-asc':
                searchQuery = searchQuery.order('price', { ascending: true });
                break;
              case 'price-desc':
                searchQuery = searchQuery.order('price', { ascending: false });
                break;
              case 'rating':
                searchQuery = searchQuery.order('rating', { ascending: false });
                break;
              default:
                searchQuery = searchQuery.order('popularity', { ascending: false });
            }
          }
        }

        const { data, error: searchError } = await searchQuery;

        if (searchError) throw searchError;
        
        // If breed filter is applied, filter results in memory
        if (filters?.breed && data) {
          const filteredResults = data.filter(product => 
            product.tags?.some(tag => 
              tag.toLowerCase().includes(filters.breed?.toLowerCase() || '')
            )
          );
          setResults(filteredResults);
        } else {
          setResults(data || []);
        }
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to search products');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchProducts();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query, filters]);

  return {
    results,
    loading,
    error
  };
};

export default useSearch;