import React from 'react';
import { Bundle } from '../types';
import BundleCard from './BundleCard';
import ShareBundleModal from './ShareBundleModal';
import { useBundles } from '../hooks/useBundles';

interface BundleGridProps {
  bundles: Bundle[];
}

const BundleGrid: React.FC<BundleGridProps> = ({ bundles }) => {
  const [selectedBundle, setSelectedBundle] = React.useState<Bundle | null>(null);
  const { refreshBundles } = useBundles();

  const handleShare = (bundle: Bundle) => {
    setSelectedBundle(bundle);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <BundleCard
            key={bundle.id}
            bundle={bundle}
            onShare={() => handleShare(bundle)}
          />
        ))}
      </div>

      {selectedBundle && (
        <ShareBundleModal
          bundle={selectedBundle}
          onClose={() => setSelectedBundle(null)}
        />
      )}
    </>
  );
};

export default BundleGrid;