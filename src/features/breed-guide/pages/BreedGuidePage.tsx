import React, { useState, useEffect } from 'react';
import { Book, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BreedSelect } from '../../dogs/components/BreedSelect';
import { useDogProfiles } from '../../dogs/hooks';
import SEO from '../../common/components/SEO';

const BreedGuidePage: React.FC = () => {
  const navigate = useNavigate();
  const { dogs, activeDogId } = useDogProfiles();
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // First try to get breed from active dog
    const activeDog = dogs.find(dog => dog.id === activeDogId);
    if (activeDog) {
      setSelectedBreed(activeDog.breed);
      return;
    }

    // Then try to get from localStorage
    const savedBreed = localStorage.getItem('selected_breed');
    if (savedBreed) {
      const breedData = JSON.parse(savedBreed);
      setSelectedBreed(breedData.name);
    }
  }, [dogs, activeDogId]);

  const handleBreedSelect = (breed: string) => {
    setSelectedBreed(breed);
    navigate(`/breed/${encodeURIComponent(breed)}`);
  };

  return (
    <>
      <SEO 
        title={selectedBreed ? `${selectedBreed} Guide - PawfectFind` : "Breed Guide - PawfectFind"}
        description="Comprehensive guide to dog breeds, their characteristics, and care requirements"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rest of the component remains the same */}
      </div>
    </>
  );
};

export default BreedGuidePage;