import { Dog } from '../types';

export const validateDogForm = (data: Partial<Dog>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.breed?.trim()) {
    errors.breed = 'Breed is required';
  }

  if (typeof data.age !== 'number' || data.age < 0) {
    errors.age = 'Valid age is required';
  }

  if (typeof data.weight !== 'number' || data.weight <= 0) {
    errors.weight = 'Valid weight is required';
  }

  if (typeof data.activity_level !== 'number' || data.activity_level < 1 || data.activity_level > 10) {
    errors.activity_level = 'Activity level must be between 1 and 10';
  }

  return errors;
};