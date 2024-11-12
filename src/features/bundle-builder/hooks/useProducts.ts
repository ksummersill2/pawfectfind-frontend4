import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Product } from '../../products/types';

interface UseProductsProps {
  breed?: string;
  searchQuery?: string;
}

export const useProducts = ({ breed, searchQuery }: UseProductsProps = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (breed) {
      fetchProducts();
    }
  }, [breed, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setInfoMessage(null);
      
      // First get the breed data
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

      const sizeCategory = breedData.breed_size_variations?.[0]?.size_category;

      // Then fetch all products
      let query = supabase
        .from('products')
        .select('*');

      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data: productsData, error: productsError } = await query;

      if (productsError) throw productsError;

      // Get size suitability for these products
      const { data: sizeSuitability, error: sizeError } = await supabase
        .from('product_size_suitability')
        .select('*')
        .in('product_id', productsData.map(p => p.id));

      if (sizeError) throw sizeError;

      // Get breed recommendations for these products
      const { data: breedRecommendations, error: recError } = await supabase
        .from('product_breed_recommendations')
        .select('*')
        .eq('breed_id', breedData.id)
        .in('product_id', productsData.map(p => p.id));

      if (recError) throw recError;

      // Combine the data
      const enrichedProducts = productsData.map(product => {
        const suitability = sizeSuitability?.find(s => s.product_id === product.id);
        const recommendation = breedRecommendations?.find(r => r.product_id === product.id);

        const isSizeCompatible = suitability && (
          (sizeCategory === 'small' && suitability.suitable_for_small) ||
          (sizeCategory === 'medium' && suitability.suitable_for_medium) ||
          (sizeCategory === 'large' && suitability.suitable_for_large) ||
          (sizeCategory === 'giant' && suitability.suitable_for_giant)
        );

        return {
          ...product,
          product_size_suitability: suitability ? [suitability] : [],
          product_breed_recommendations: recommendation ? [recommendation] : [],
          isCompatible: isSizeCompatible || !!recommendation
        };
      });

      // Filter compatible products
      const filteredProducts = enrichedProducts.filter(p => p.isCompatible);

      // Sort: breed recommendations first, then size-compatible
      filteredProducts.sort((a, b) => {
        const aHasRec = a.product_breed_recommendations?.length > 0;
        const bHasRec = b.product_breed_recommendations?.length > 0;
        
        if (aHasRec && !bHasRec) return -1;
        if (!aHasRec && bHasRec) return 1;
        return b.popularity - a.popularity;
      });

      setProducts(filteredProducts);

      // Set informative message
      if (filteredProducts.length > 0) {
        const breedSpecificCount = filteredProducts.filter(p => 
          p.product_breed_recommendations?.length > 0
        ).length;

        if (breedSpecificCount === 0) {
          setInfoMessage(`Showing ${filteredProducts.length} products suitable for ${sizeCategory}-sized dogs like ${breed}s`);
        } else {
          setInfoMessage(`Showing ${breedSpecificCount} ${breed}-specific products and ${filteredProducts.length - breedSpecificCount} size-appropriate products`);
        }
      } else {
        setError(`No products found specifically for ${breed}s or ${sizeCategory}-sized dogs`);
      }

    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    infoMessage,
    refreshProducts: fetchProducts
  };
};

export default useProducts;