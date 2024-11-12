import React, { useState } from 'react';
import { Heart, AlertCircle, Plus, X, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Dog } from '../types';

interface DogHealthConditionsProps {
  dog: Dog;
  onUpdate: (conditions: string[]) => Promise<void>;
}

const DogHealthConditions: React.FC<DogHealthConditionsProps> = ({ dog, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [conditions, setConditions] = useState<string[]>(dog.health_conditions || []);
  const [newCondition, setNewCondition] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commonConditions = [
    'Allergies',
    'Arthritis',
    'Dental Issues',
    'Diabetes',
    'Heart Disease',
    'Hip Dysplasia',
    'Obesity',
    'Skin Issues'
  ];

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    
    const condition = newCondition.trim();
    if (!conditions.includes(condition)) {
      setConditions([...conditions, condition]);
    }
    setNewCondition('');
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      await onUpdate(conditions);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating health conditions:', err);
      setError('Failed to update health conditions');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Health Conditions
          </h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Enter health condition"
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
            <button
              onClick={handleAddCondition}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            {conditions.map((condition, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
              >
                <span className="text-gray-700 dark:text-gray-300">{condition}</span>
                <button
                  onClick={() => handleRemoveCondition(index)}
                  className="text-red-500 hover:text-red-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Common Conditions
            </h4>
            <div className="flex flex-wrap gap-2">
              {commonConditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => {
                    if (!conditions.includes(condition)) {
                      setConditions([...conditions, condition]);
                    }
                  }}
                  disabled={conditions.includes(condition)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    conditions.includes(condition)
                      ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setConditions(dog.health_conditions || []);
                setIsEditing(false);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {conditions.length > 0 ? (
            conditions.map((condition, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg px-3 py-2"
              >
                <Check className="w-4 h-4" />
                <span>{condition}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No health conditions reported
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DogHealthConditions;