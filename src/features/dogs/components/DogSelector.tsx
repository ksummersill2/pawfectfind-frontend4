import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dog as DogIcon, Plus, Heart, X, Trash2, AlertCircle, ChevronDown } from 'lucide-react';
import { Dog } from '../types';
import DogDetails from './DogDetails';
import DogForm from './DogForm';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDogProfiles } from '../hooks/useDogProfiles';

interface DogSelectorProps {
  dogs: Dog[];
  activeDogId: string | null;
  onDogSelect: (dogId: string | null) => void;
}

const DogSelector: React.FC<DogSelectorProps> = ({
  dogs,
  activeDogId,
  onDogSelect
}) => {
  const { user } = useAuth();
  const { addDog } = useDogProfiles();
  const [isOpen, setIsOpen] = useState(false);
  const [showDogDetails, setShowDogDetails] = useState(false);
  const [showAddDog, setShowAddDog] = useState(false);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(
    dogs.find(dog => dog.id === activeDogId) || null
  );
  const [error, setError] = useState<string | null>(null);

  const handleDogClick = (dog: Dog) => {
    onDogSelect(dog.id);
    setSelectedDog(dog);
    setIsOpen(false);
  };

  const handleAddDog = async (dogData: Omit<Dog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user) {
        setError('You must be logged in to add a dog');
        return;
      }

      setError(null);
      const newDog = await addDog(dogData);
      setShowAddDog(false);
      setIsOpen(false);
      onDogSelect(newDog.id);
      setSelectedDog(newDog);
    } catch (err) {
      console.error('Error adding dog:', err);
      setError(err instanceof Error ? err.message : 'Failed to add dog');
    }
  };

  const handleOpenAddDog = () => {
    setShowAddDog(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {selectedDog ? (
            <>
              {selectedDog.image ? (
                <img
                  src={selectedDog.image}
                  alt={selectedDog.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <DogIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <span className="text-gray-900 dark:text-white font-medium">
                {selectedDog.name}
              </span>
            </>
          ) : (
            <>
              <DogIcon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Select Dog</span>
            </>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            {dogs.map((dog) => (
              <button
                key={dog.id}
                onClick={() => handleDogClick(dog)}
                className={`w-full flex items-center px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  dog.id === activeDogId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                {dog.image ? (
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <DogIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div className="ml-3 text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {dog.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {dog.breed}
                  </div>
                </div>
              </button>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 px-4">
              <button
                onClick={handleOpenAddDog}
                className="w-full flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 py-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Dog</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Dog Modal */}
      {showAddDog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Dog
              </h2>
              <button
                onClick={() => setShowAddDog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <DogForm
                onSubmit={handleAddDog}
                onCancel={() => setShowAddDog(false)}
              />
            </div>

            {error && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dog Details Modal */}
      {showDogDetails && selectedDog && (
        <DogDetails
          dog={selectedDog}
          onClose={() => setShowDogDetails(false)}
        />
      )}
    </>
  );
};

export default DogSelector;