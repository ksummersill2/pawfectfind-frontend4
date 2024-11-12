import React from 'react';
import { Dog } from '../types';
import { Edit2, Trash2, Info, LogIn } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Link } from 'react-router-dom';

interface DogListProps {
  dogs: Dog[];
  onSelect: (dog: Dog) => void;
  onDelete: (dogId: string) => Promise<void>;
}

const DogList: React.FC<DogListProps> = ({ dogs, onSelect, onDelete }) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {dogs.map((dog) => (
        <div
          key={dog.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-gray-700">
            {dog.image ? (
              <img
                src={dog.image}
                alt={dog.name}
                className="object-cover w-full h-48"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                <span className="text-4xl">🐕</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {dog.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {dog.breed}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onSelect(dog)}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="View Details"
                >
                  <Info className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(dog.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete Dog"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Age: {dog.age} years
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Weight: {dog.weight} kg
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Activity Level: {dog.activity_level}/10
              </p>
            </div>
            {!isAuthenticated && dog.user_id === 'temporary' && (
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <Link
                  to="/login"
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in to Save Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default DogList;