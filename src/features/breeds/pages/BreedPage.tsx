import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { BreedDashboard } from '../components';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import SEO from '../../common/components/SEO';
import { Breed } from '../types';

const BreedPage: React.FC = () => {
  const { breed } = useParams<{ breed: string }>();
  const [breedData, setBreedData] = useState<Breed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    fetchBreedData();
  }, [breed]);

  const fetchBreedData = async () => {
    try {
      setLoading(true);
      setError(null);

      // First fetch the breed
      const { data: breedData, error: breedError } = await supabase
        .from('dog_breeds')
        .select(`
          id,
          name,
          description,
          breed_size_variations (
            id,
            size_category,
            size_description,
            image,
            dietary_needs,
            health_issues,
            care_instructions,
            special_considerations,
            breed_characteristics (
              id,
              gender,
              min_height_cm,
              max_height_cm,
              min_weight_kg,
              max_weight_kg,
              life_expectancy_years,
              energy_level,
              grooming_needs,
              shedding_level,
              trainability,
              barking_level,
              good_with_children,
              good_with_other_dogs,
              good_with_strangers,
              exercise_needs_minutes
            )
          )
        `)
        .eq('name', breed)
        .single();

      if (breedError) throw breedError;
      if (!breedData) throw new Error('Breed not found');

      setBreedData({
        ...breedData,
        size_variations: breedData.breed_size_variations || []
      });

    } catch (err) {
      console.error('Error fetching breed data:', err);
      setError('Failed to load breed information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !breedData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error || 'Breed information not available'}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${breedData.name} - Breed Information & Care Guide`}
        description={breedData.description}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BreedDashboard breed={breedData} />
      </div>
    </>
  );
};

export default BreedPage;