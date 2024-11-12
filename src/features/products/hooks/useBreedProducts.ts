import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Product } from '../types';

interface UseBreedProductsProps {
  breed: string | null;
  categoryId?: string;
}

export const useBreedProducts = ({ breed, categoryId }: UseBreedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (breed) {
      fetchBreedProducts();
    } else {
      fetchAllProducts();
    }
  }, [breed, categoryId]);

  const fetchBreedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get the breed information to determine size category
      const { data: breedData, error: breedError } = await supabase
        .from('dog_breeds')
        .select(`
          id,
          name,
          breed_size_variations (
            size_category
          )
        `)
        .eq('name', breed)
        .single();

      if (breedError) throw breedError;

      const sizeCategory = breedData?.breed_size_variations?.[0]?.size_category;

      // Build the product query
      let query = supabase
        .from('products')
        .select(`
          *,
          breed_recommendations (
            breed_id,
            recommendation_strength
          )
        `);

      // Apply category filter if specified
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }

      // Get products with exact breed match or matching size category
      const { data: productsData, error: productsError } = await query
        .or(`breed_tags.cs.{${breed}},size_category.eq.${sizeCategory}`);

      if (productsError) throw productsError;

      // Sort products: exact breed matches first, then by size category
      const sortedProducts = (productsData || []).sort((a, b) => {
        const aIsExactMatch = a.breed_tags?.includes(breed);
        const bIsExactMatch = b.breed_tags?.includes(breed);

        if (aIsExactMatch && !bIsExactMatch) return -1;
        if (!aIsExactMatch && bIsExactMatch) return 1;

        // If both are size matches, sort by recommendation strength
        const aStrength = a.breed_recommendations?.[0]?.recommendation_strength || 0;
        const bStrength = b.breed_recommendations?.[0]?.recommendation_strength || 0;
        return bStrength - aStrength;
      });

      setProducts(sortedProducts);
    } catch (err) {
      console.error('Error fetching breed products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select('*')
        .order('popularity', { ascending: false });

      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }

      const { data, error: productsError } = await query;

      if (productsError) throw productsError;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error
  };
};

export default useBreedProducts;