import React, { useRef } from 'react';
import { Dog, ShoppingBag, Book, FileText, Newspaper, Video, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breed } from '../types';
import RecommendedProducts from './RecommendedProducts';
import VideoSection from './VideoSection';
import BlogSection from './BlogSection';
import ArticleSection from './ArticleSection';
import BreedInfo from './BreedInfo';
import BreedCareGuide from './BreedCareGuide';

interface BreedDashboardProps {
  breed: Breed;
}

const BreedDashboard: React.FC<BreedDashboardProps> = ({ breed }) => {
  const mainVariation = breed.size_variations[0];
  const guidesRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);

  const quickNavItems = [
    { icon: ShoppingBag, label: 'Products', href: `/category/all?breed=${encodeURIComponent(breed.name)}` },
    { 
      icon: Book, 
      label: 'Guides', 
      onClick: () => {
        guidesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    { 
      icon: FileText, 
      label: 'Articles', 
      onClick: () => {
        articlesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    { 
      icon: Video, 
      label: 'Videos', 
      onClick: () => {
        videosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    { icon: Newspaper, label: 'Blogs', href: `/blogs/${encodeURIComponent(breed.name)}` }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Quick Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8 sticky top-0 z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {quickNavItems.map((item) => (
            item.href ? (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
                {item.href.startsWith('http') && <ExternalLink className="w-4 h-4 ml-1" />}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Breed Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            <Dog className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {breed.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {breed.description}
            </p>
          </div>
        </div>

        {mainVariation && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white">Size</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {mainVariation.size_description}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white">Activity Level</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {mainVariation.breed_characteristics[0]?.energy_level}/10
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-white">Special Considerations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {mainVariation.special_considerations || 'None'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column - Breed Info & Care */}
        <div className="xl:col-span-3 space-y-8">
          {mainVariation && (
            <>
              <BreedInfo variation={mainVariation} />
              <div ref={guidesRef} className="scroll-mt-24">
                <BreedCareGuide variation={mainVariation} />
              </div>
            </>
          )}
        </div>

        {/* Right Column - Content Sections */}
        <div className="xl:col-span-9 space-y-12">
          {/* Recommended Products Section */}
          <section>
            <RecommendedProducts breedName={breed.name} />
          </section>

          {/* Videos Section */}
          <section ref={videosRef} className="scroll-mt-24">
            <VideoSection breedId={breed.id} breedName={breed.name} />
          </section>

          {/* Blog Posts Section */}
          <section>
            <BlogSection breedId={breed.id} breedName={breed.name} />
          </section>

          {/* External Articles Section */}
          <section ref={articlesRef} className="scroll-mt-24">
            <ArticleSection breedId={breed.id} breedName={breed.name} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default BreedDashboard;