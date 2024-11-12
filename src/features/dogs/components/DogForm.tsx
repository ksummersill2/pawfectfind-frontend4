import React, { useState } from 'react';
import { AlertCircle, Upload, Dog, Info } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Dog as DogType } from '../types';
import { useAuth } from '../../auth/hooks/useAuth';
import { BreedSelect } from './BreedSelect';

interface DogFormProps {
  initialData?: DogType;
  onSubmit: (data: Omit<DogType, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
}

const DogForm: React.FC<DogFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<Omit<DogType, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
    name: initialData?.name || '',
    breed: initialData?.breed || '',
    age: initialData?.age || 0,
    weight: initialData?.weight || 0,
    activity_level: initialData?.activity_level || 5,
    image: initialData?.image || null,
    health_conditions: initialData?.health_conditions || []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(formData.image);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.breed) {
      newErrors.breed = 'Breed is required';
    }

    if (formData.age < 0) {
      newErrors.age = 'Age must be positive';
    }

    if (formData.weight <= 0) {
      newErrors.weight = 'Weight must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let imageUrl = formData.image;

      if (imageFile && isAuthenticated) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `dogs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('dogs')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('dogs')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      await onSubmit({
        ...formData,
        image: imageUrl
      });
    } catch (err) {
      console.error('Error submitting dog form:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save dog profile'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {!isAuthenticated && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start space-x-2">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              You're creating a temporary dog profile. 
              <a href="/login" className="ml-1 underline">Sign in</a> to save it permanently and access all features.
            </p>
          </div>
        </div>
      )}

      {/* Name Input */}
      <div>
        <label htmlFor="dogName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Name
        </label>
        <input
          id="dogName"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Enter your dog's name"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Breed Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Breed
        </label>
        <BreedSelect
          value={formData.breed}
          onChange={(breed) => setFormData(prev => ({ ...prev, breed }))}
        />
        {errors.breed && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.breed}
          </p>
        )}
      </div>

      {/* Age and Weight */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dogAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Age (years)
          </label>
          <input
            id="dogAge"
            type="number"
            min="0"
            step="0.1"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting}
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.age}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dogWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Weight (kg)
          </label>
          <input
            id="dogWeight"
            type="number"
            min="0"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting}
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.weight}
            </p>
          )}
        </div>
      </div>

      {/* Activity Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Activity Level
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.activity_level}
          onChange={(e) => setFormData(prev => ({ ...prev, activity_level: parseInt(e.target.value) }))}
          className="w-full"
          disabled={isSubmitting}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Low (1)</span>
          <span>Medium (5)</span>
          <span>High (10)</span>
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Photo
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Dog preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Dog className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <label className="flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-blue-600 rounded-lg border border-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600">
            <Upload className="w-5 h-5 mr-2" />
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isSubmitting}
            />
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Dog' : 'Add Dog'}
        </button>
      </div>

      {errors.submit && (
        <p className="text-sm text-red-600 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors.submit}
        </p>
      )}
    </form>
  );
};

export default DogForm;