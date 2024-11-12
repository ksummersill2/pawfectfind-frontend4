import React, { useState } from 'react';
import { Plus, Dog } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDogProfiles } from '../hooks/useDogProfiles';
import DogList from '../components/DogList';
import DogForm from '../components/DogForm';
import DogDetails from '../components/DogDetails';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { Dog as DogType } from '../types';

const DogsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { dogs, loading, error, addDog, removeDog } = useDogProfiles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDog, setSelectedDog] = useState<DogType | null>(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const handleAddDog = async (dogData: Omit<DogType, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await addDog(dogData);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding dog:', err);
    }
  };

  return (
    <>
      <SEO 
        title="My Dogs"
        description="Manage your dogs' profiles and get personalized recommendations"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dogs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your dogs' profiles and get personalized recommendations
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Dog
          </button>
        </div>

        {dogs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <Dog className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No dogs added yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add your first dog to get personalized recommendations
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Dog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DogList
              dogs={dogs}
              onSelect={setSelectedDog}
              onDelete={removeDog}
            />
          </div>
        )}

        {/* Add Dog Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Add New Dog
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <DogForm
                  onSubmit={handleAddDog}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dog Details Modal */}
        {selectedDog && (
          <DogDetails
            dog={selectedDog}
            onClose={() => setSelectedDog(null)}
          />
        )}
      </div>
    </>
  );
};

export default DogsPage;