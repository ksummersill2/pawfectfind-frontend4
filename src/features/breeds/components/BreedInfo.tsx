import React from 'react';
import { Activity, Heart, Shield, Users } from 'lucide-react';
import { BreedSizeVariation } from '../types';

interface BreedInfoProps {
  variation: BreedSizeVariation;
}

const BreedInfo: React.FC<BreedInfoProps> = ({ variation }) => {
  // Get the first set of characteristics or provide defaults
  const characteristics = variation.breed_characteristics?.[0] || {
    energy_level: 0,
    good_with_children: false,
    good_with_other_dogs: false,
    good_with_strangers: false,
    min_height_cm: 0,
    max_height_cm: 0,
    min_weight_kg: 0,
    max_weight_kg: 0,
    exercise_needs_minutes: 0
  };

  const stats = [
    {
      label: 'Energy Level',
      value: characteristics.energy_level,
      icon: Activity,
      description: `${characteristics.energy_level}/10`
    },
    {
      label: 'Good with Children',
      value: characteristics.good_with_children ? 1 : 0,
      icon: Heart,
      description: characteristics.good_with_children ? 'Yes' : 'No'
    },
    {
      label: 'Good with Dogs',
      value: characteristics.good_with_other_dogs ? 1 : 0,
      icon: Shield,
      description: characteristics.good_with_other_dogs ? 'Yes' : 'No'
    },
    {
      label: 'Good with Strangers',
      value: characteristics.good_with_strangers ? 1 : 0,
      icon: Users,
      description: characteristics.good_with_strangers ? 'Yes' : 'No'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Breed Characteristics
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.description}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Size Range
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Height: {characteristics.min_height_cm}-{characteristics.max_height_cm} cm<br />
            Weight: {characteristics.min_weight_kg}-{characteristics.max_weight_kg} kg
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Exercise Needs
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            {characteristics.exercise_needs_minutes} minutes per day
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreedInfo;