import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { Dog } from '../../../types';

interface ExerciseSectionProps {
  dog: Dog;
}

const ExerciseSection: React.FC<ExerciseSectionProps> = ({ dog }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Exercise Needs
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Activity Level</span>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-blue-600" />
            <span className="font-medium">{dog.activity_level}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSection;