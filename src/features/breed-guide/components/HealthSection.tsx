import React from 'react';
import { Heart } from 'lucide-react';
import { Dog } from '../../../types';

interface HealthSectionProps {
  dog: Dog;
}

const HealthSection: React.FC<HealthSectionProps> = ({ dog }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Health Information
        </h2>
      </div>
      
      <div className="space-y-4">
        {dog.health_conditions && dog.health_conditions.length > 0 ? (
          dog.health_conditions.map((condition, index) => (
            <div
              key={index}
              className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg px-3 py-2"
            >
              {condition}
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            No health conditions reported
          </p>
        )}
      </div>
    </div>
  );
};

export default HealthSection;