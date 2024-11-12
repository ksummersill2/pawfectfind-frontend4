import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Product } from '../../products/types';
import { useAuth } from '../../auth/hooks/useAuth';

interface BundleCreationProps {
  onSuccess: (bundleId: string) => void;
}

interface CreateBundleParams {
  name: string;
  breed: string;
  items: Product[];
}

export const useBundleCreation = ({ onSuccess }: BundleCreationProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createBundle = async ({ name, breed, items }: CreateBundleParams) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!user?.id) {
        throw new Error('You must be logged in to create a bundle');
      }

      // Calculate totals
      const total = items.reduce((sum, item) => sum + item.price, 0);
      const discountPercentage = items.length >= 3 ? 15 : items.length >= 2 ? 10 : 0;

      // Create bundle
      const { data: bundle, error: bundleError } = await supabase
        .from('bundles')
        .insert([{
          user_id: user.id,
          name,
          breed,
          total_price: total,
          discount_percentage: discountPercentage,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (bundleError) throw bundleError;

      // Create bundle items
      const bundleItems = items.map(item => ({
        bundle_id: bundle.id,
        product_id: item.id,
        price: item.price,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: itemsError } = await supabase
        .from('bundle_items')
        .insert(bundleItems);

      if (itemsError) throw itemsError;

      onSuccess(bundle.id);
      return bundle.id;
    } catch (err) {
      console.error('Error creating bundle:', err);
      setError(err instanceof Error ? err.message : 'Failed to create bundle');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createBundle,
    isSubmitting,
    error,
    isAuthenticated: !!user?.id
  };
};

export default useBundleCreation;