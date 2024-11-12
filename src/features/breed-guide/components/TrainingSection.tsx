import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Dog } from '../../../types';

interface TrainingSectionProps {
  dog: Dog;
}

const TrainingSection: React.FC<TrainingSectionProps> = ({ dog }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <GraduationCap className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Training Guide
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Basic Training
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start with basic commands and positive reinforcement training methods.
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Socialization
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Early socialization is key for a well-adjusted {dog.breed}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingSection;