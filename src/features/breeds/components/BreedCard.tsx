import React from 'react';
import { Link } from 'react-router-dom';
import { Dog, Heart, Info } from 'lucide-react';
import { Breed } from '../types';

interface BreedCardProps {
  breed: Breed;
}

const BreedCard: React.FC<BreedCardProps> = ({ breed }) => {
  const mainVariation = breed.size_variations[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
        {mainVariation?.image ? (
          <img
            src={mainVariation.image}
            alt={breed.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Dog className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {breed.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {breed.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Size</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {mainVariation?.size_category || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Energy Level</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {mainVariation?.male_characteristics?.energy_level || 'N/A'}/10
            </span>
          </div>
        </div>

        <Link
          to={`/breed/${encodeURIComponent(breed.name)}`}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Info className="w-4 h-4 mr-2" />
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BreedCard;