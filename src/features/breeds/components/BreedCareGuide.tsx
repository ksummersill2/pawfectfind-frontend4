import React from 'react';
import { Heart, Shield, Activity, AlertCircle } from 'lucide-react';
import { BreedSizeVariation } from '../types';

interface BreedCareGuideProps {
  variation: BreedSizeVariation;
}

const BreedCareGuide: React.FC<BreedCareGuideProps> = ({ variation }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Care Guide
      </h3>

      <div className="space-y-6">
        {/* Dietary Needs */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Dietary Needs
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {variation.dietary_needs || 'No specific dietary requirements noted.'}
          </p>
        </div>

        {/* Health Issues */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Health Considerations
            </h4>
          </div>
          {variation.health_issues.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
              {variation.health_issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No specific health issues noted.
            </p>
          )}
        </div>

        {/* Care Instructions */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="w-5 h-5 text-blue-500" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Care Instructions
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {variation.care_instructions || 'No specific care instructions noted.'}
          </p>
        </div>

        {/* Special Considerations */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="w-5 h-5 text-purple-500" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Special Considerations
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {variation.special_considerations || 'No special considerations noted.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreedCareGuide;