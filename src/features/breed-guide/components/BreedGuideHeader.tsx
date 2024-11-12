import React from 'react';
import { Dog } from '../../../types';
import { Dog as DogIcon } from 'lucide-react';

interface BreedGuideHeaderProps {
  dog: Dog;
}

const BreedGuideHeader: React.FC<BreedGuideHeaderProps> = ({ dog }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
          <DogIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {dog.breed} Guide
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete care guide for your {dog.breed}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreedGuideHeader;