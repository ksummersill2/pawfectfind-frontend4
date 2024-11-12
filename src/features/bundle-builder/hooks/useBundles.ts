import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Bundle } from '../types';
import { useAuth } from '../../auth/hooks';

export const useBundles = () => {
  const { user } = useAuth();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBundles();
    }
  }, [user]);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('bundles')
        .select(`
          *,
          items:bundle_items(
            id,
            product_id,
            price,
            products(*)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBundles(data || []);
    } catch (err) {
      console.error('Error fetching bundles:', err);
      setError('Failed to load bundles');
    } finally {
      setLoading(false);
    }
  };

  const saveBundle = async (
    name: string,
    breed: string,
    items: { id: string; price: number }[],
    existingBundleId?: string
  ) => {
    try {
      const total = items.reduce((sum, item) => sum + item.price, 0);
      const discountPercentage = items.length >= 3 ? 15 : items.length >= 2 ? 10 : 0;

      if (existingBundleId) {
        // Update existing bundle
        const { error: bundleError } = await supabase
          .from('bundles')
          .update({
            name,
            breed,
            total_price: total,
            discount_percentage: discountPercentage,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBundleId)
          .eq('user_id', user?.id);

        if (bundleError) throw bundleError;

        // Delete existing items
        const { error: deleteError } = await supabase
          .from('bundle_items')
          .delete()
          .eq('bundle_id', existingBundleId);

        if (deleteError) throw deleteError;

        // Insert new items
        const bundleItems = items.map(item => ({
          bundle_id: existingBundleId,
          product_id: item.id,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('bundle_items')
          .insert(bundleItems);

        if (itemsError) throw itemsError;
      } else {
        // Create new bundle
        const { data: bundle, error: bundleError } = await supabase
          .from('bundles')
          .insert({
            user_id: user?.id,
            name,
            breed,
            total_price: total,
            discount_percentage: discountPercentage,
            status: 'active'
          })
          .select()
          .single();

        if (bundleError) throw bundleError;

        // Create bundle items
        const bundleItems = items.map(item => ({
          bundle_id: bundle.id,
          product_id: item.id,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('bundle_items')
          .insert(bundleItems);

        if (itemsError) throw itemsError;
      }

      await fetchBundles();
    } catch (err) {
      console.error('Error saving bundle:', err);
      throw err;
    }
  };

  const deleteBundle = async (bundleId: string) => {
    try {
      const { error } = await supabase
        .from('bundles')
        .delete()
        .eq('id', bundleId)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchBundles();
    } catch (err) {
      console.error('Error deleting bundle:', err);
      throw err;
    }
  };

  return {
    bundles,
    loading,
    error,
    saveBundle,
    deleteBundle,
    refreshBundles: fetchBundles
  };
};

export default useBundles;