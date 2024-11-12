import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Share2, Edit, Trash2, Plus } from 'lucide-react';
import { useBundles } from '../hooks/useBundles';
import { Bundle } from '../types';
import { formatCurrency } from '../../../utils/formatters';
import ShareModal from '../components/ShareModal';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import SEO from '../../common/components/SEO';

export const BundleManagerPage: React.FC = () => {
  const { bundles, loading, error, deleteBundle } = useBundles();
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO 
        title="My Pawfect Gift Bundles"
        description="Manage your custom gift bundles and share them with friends"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Pawfect Gift Bundles
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and share your custom gift bundles
            </p>
          </div>
          <Link
            to="/bundle-builder"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Bundle
          </Link>
        </div>

        {error ? (
          <div className="text-red-600 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
            {error}
          </div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bundles yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start creating your first Pawfect gift bundle
            </p>
            <Link
              to="/bundle-builder"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Bundle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {bundle.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedBundle(bundle);
                          setShowShareModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 rounded-full"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <Link
                        to={`/bundle-builder/${bundle.id}`}
                        className="p-2 text-gray-400 hover:text-green-500 rounded-full"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteBundle(bundle.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Created for {bundle.breed}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {bundle.items.length} items
                    </p>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Value
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(bundle.total_price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showShareModal && selectedBundle && (
          <ShareModal
            bundle={selectedBundle}
            onClose={() => {
              setShowShareModal(false);
              setSelectedBundle(null);
            }}
          />
        )}
      </div>
    </>
  );
};