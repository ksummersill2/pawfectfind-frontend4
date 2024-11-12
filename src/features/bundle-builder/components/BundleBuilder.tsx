import React, { useState, useEffect } from 'react';
import { Gift, Search, Plus, X, Dog } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { BreedSelect } from '../../dogs/components/BreedSelect';
import { ProductCard } from '../../products/components';
import { MiniBundleSummary } from './MiniBundleSummary';
import { Product } from '../../products/types';
import { useDogProfiles } from '../../dogs/hooks';
import { useBundleCreation } from '../hooks/useBundleCreation';
import { UserAuthModal } from '../../auth/components';
import { useProducts } from '../hooks/useProducts';
import LoadingSpinner from '../../common/components/LoadingSpinner';

interface BundleItem extends Product {
  bundleItemId: string;
}

interface BundleBuilderProps {
  existingBundle?: any;
}

const BundleBuilder: React.FC<BundleBuilderProps> = ({ existingBundle }) => {
  const navigate = useNavigate();
  const { bundleId } = useParams();
  const { dogs, activeDogId } = useDogProfiles();
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingBundle, setLoadingBundle] = useState(!!bundleId);

  const { products, loading, error, infoMessage } = useProducts({
    breed: selectedBreed,
    searchQuery
  });

  const { createBundle, isAuthenticated, isSubmitting } = useBundleCreation({
    onSuccess: () => {
      navigate(`/bundles`);
    }
  });

  // Load existing bundle if editing
  useEffect(() => {
    const loadExistingBundle = async () => {
      if (!bundleId) return;

      try {
        setLoadingBundle(true);
        const { data: bundle, error: bundleError } = await supabase
          .from('bundles')
          .select(`
            *,
            bundle_items (
              id,
              product_id,
              price,
              products (*)
            )
          `)
          .eq('id', bundleId)
          .single();

        if (bundleError) throw bundleError;

        setSelectedBreed(bundle.breed);
        setBundleItems(
          bundle.bundle_items.map((item: any) => ({
            ...item.products,
            bundleItemId: item.id,
            price: item.price
          }))
        );
      } catch (err) {
        console.error('Error loading bundle:', err);
        navigate('/bundles');
      } finally {
        setLoadingBundle(false);
      }
    };

    loadExistingBundle();
  }, [bundleId]);

  // Set initial breed from active dog if not editing
  useEffect(() => {
    if (!bundleId) {
      const activeDog = dogs.find(dog => dog.id === activeDogId);
      if (activeDog) {
        setSelectedBreed(activeDog.breed);
      }
    }
  }, [dogs, activeDogId, bundleId]);

  const addToBundle = (product: Product) => {
    setBundleItems(prev => [
      ...prev,
      { 
        ...product, 
        bundleItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
      }
    ]);
  };

  const removeFromBundle = (bundleItemId: string) => {
    setBundleItems(prev => prev.filter(item => item.bundleItemId !== bundleItemId));
  };

  const handleComplete = async () => {
    if (bundleItems.length === 0) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (bundleId) {
        // Update existing bundle
        const total = bundleItems.reduce((sum, item) => sum + item.price, 0);
        const discountPercentage = bundleItems.length >= 3 ? 15 : bundleItems.length >= 2 ? 10 : 0;

        await supabase
          .from('bundles')
          .update({
            breed: selectedBreed,
            total_price: total,
            discount_percentage: discountPercentage,
            updated_at: new Date().toISOString()
          })
          .eq('id', bundleId);

        // Delete existing items
        await supabase
          .from('bundle_items')
          .delete()
          .eq('bundle_id', bundleId);

        // Add new items
        const bundleItemsData = bundleItems.map(item => ({
          bundle_id: bundleId,
          product_id: item.id,
          price: item.price,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        await supabase
          .from('bundle_items')
          .insert(bundleItemsData);

        navigate('/bundles');
      } else {
        // Create new bundle
        await createBundle({
          name: `${selectedBreed} Bundle`,
          breed: selectedBreed,
          items: bundleItems
        });
      }
    } catch (err) {
      console.error('Error completing bundle:', err);
    }
  };

  if (loadingBundle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {bundleId ? 'Edit Bundle' : 'Create Pawfect Gift Bundle'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {bundleId ? 'Update your bundle items' : 'Select products to create the perfect gift bundle'}
          </p>
        </div>
        <div className="w-64">
          <BreedSelect
            value={selectedBreed}
            onChange={setSelectedBreed}
            placeholder="Select breed..."
          />
        </div>
      </div>

      {!selectedBreed ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Dog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Select a Breed to Start
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Choose a breed to see personalized product recommendations for your bundle
          </p>
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
            />
          </div>

          {infoMessage && (
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-4 rounded-lg mb-6">
              {infoMessage}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 dark:text-red-400 text-center py-12">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToBundle={() => addToBundle(product)}
                  isInBundle={bundleItems.some(item => item.id === product.id)}
                  breedId={product.breed_id}
                />
              ))}
            </div>
          )}

          {bundleItems.length > 0 && (
            <MiniBundleSummary
              items={bundleItems}
              onRemoveItem={removeFromBundle}
              expanded={summaryExpanded}
              onToggle={() => setSummaryExpanded(!summaryExpanded)}
              onComplete={handleComplete}
              isSubmitting={isSubmitting}
            />
          )}
        </>
      )}

      <UserAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectTo="/bundle-builder"
      />
    </div>
  );
};

export default BundleBuilder;