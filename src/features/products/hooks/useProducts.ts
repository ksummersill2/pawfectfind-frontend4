import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Product, ProductFilters } from '../types';

const useProducts = (initialFilters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select(`
          *,
          breed_recommendations:product_breed_recommendations!inner(
            breed_id,
            recommendation_strength
          ),
          breeds:dog_breeds!inner(
            id,
            name
          )
        `);

      // Apply filters
      if (filters.priceRange) {
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
      }

      if (filters.breed) {
        query = query
          .eq('breeds.name', filters.breed);
      }

      if (filters.vendors && filters.vendors.length > 0) {
        query = query
          .in('vendor', filters.vendors);
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'rating':
            query = query.order('rating', { ascending: false });
            break;
          default:
            query = query.order('popularity', { ascending: false });
        }
      } else {
        query = query.order('popularity', { ascending: false });
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return {
    products,
    loading,
    error,
    filters,
    setFilters,
    refreshProducts: fetchProducts
  };
};

export default useProducts;