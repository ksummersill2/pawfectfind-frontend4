import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, MessageCircle, Tag, Dog, ArrowRight, Search, Shield, Star, Scale, Brain, Book } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDogProfiles } from '../../dogs/hooks/useDogProfiles';
import BreedSelector from '../components/BreedSelector';
import HeroSlider from '../components/HeroSlider';
import BundleBuilderPromo from '../components/BundleBuilderPromo';
import SEO from '../../common/components/SEO';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { dogs, activeDogId } = useDogProfiles();
  const [selectedBreed, setSelectedBreed] = useState<any>(null);

  useEffect(() => {
    const savedBreed = localStorage.getItem('selected_breed');
    if (savedBreed) {
      setSelectedBreed(JSON.parse(savedBreed));
    }
  }, []);

  const activeDog = dogs.find(dog => dog.id === activeDogId);

  const handleBreedSelect = (breed: any) => {
    setSelectedBreed(breed);
    localStorage.setItem('selected_breed', JSON.stringify(breed));
  };

  const pawsomeDifference = [
    {
      title: "Breed Guide",
      description: "Expert insights and care tips specific to your dog's breed",
      icon: Book,
      path: selectedBreed ? `/breed/${encodeURIComponent(selectedBreed.name)}` : "/breed-guide",
      color: "blue"
    },
    {
      title: "Size Calculator",
      description: "Track your dog's growth and ideal weight range",
      icon: Scale,
      path: selectedBreed ? `/size-calculator/${encodeURIComponent(selectedBreed.name)}` : "/size-calculator",
      color: "green"
    },
    {
      title: "Health Tracker",
      description: "Monitor your pet's health metrics and wellness journey",
      icon: Heart,
      path: "/health-tracker",
      color: "red"
    }
  ];

  return (
    <>
      <SEO />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Bundle Builder Promo */}
      <BundleBuilderPromo />

      {/* Choose Your Companion Section - Only show if no breed is selected */}
      {!selectedBreed && !activeDog && (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Companion
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Begin your journey with the perfect furry friend
              </p>
            </div>
            <BreedSelector onBreedSelect={handleBreedSelect} />
          </div>
        </div>
      )}

      {/* The Pawsome Difference */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              The Pawsome Difference
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover tools and resources tailored for your furry friend
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pawsomeDifference.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className={`p-3 bg-${item.color}-100 dark:bg-${item.color}-900/50 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {item.description}
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <span className="mr-2">Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Add Dog CTA for authenticated users without dogs */}
      {isAuthenticated && dogs.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <Dog className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Your Dog's Profile
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Get personalized product recommendations for your furry friend
                  </p>
                </div>
              </div>
              <Link
                to="/dogs"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                Add Dog
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;