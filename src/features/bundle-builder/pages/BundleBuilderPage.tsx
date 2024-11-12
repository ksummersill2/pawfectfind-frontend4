import React from 'react';
import { useParams } from 'react-router-dom';
import { BundleBuilder } from '../components';
import SEO from '../../common/components/SEO';

export const BundleBuilderPage: React.FC = () => {
  const { bundleId } = useParams<{ bundleId?: string }>();

  return (
    <>
      <SEO
        title={bundleId ? "Edit Bundle" : "Create a Pawfect Gift Bundle"}
        description={bundleId 
          ? "Edit your gift bundle" 
          : "Build the perfect gift bundle for your furry friend with our curated selection of products"}
      />
      <BundleBuilder />
    </>
  );
};