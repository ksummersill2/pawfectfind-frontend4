import { Dog } from '../types';

export interface DogProfileHook {
  dogs: Dog[];
  activeDogId: string | null;
  setActiveDogId: (id: string | null) => void;
  loading: boolean;
  error: string | null;
  addDog: (data: Omit<Dog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Dog>;
  updateDog: (dogId: string, updates: Partial<Dog>) => Promise<Dog>;
  removeDog: (dogId: string) => Promise<void>;
  refreshDogs: () => Promise<void>;
  hasTemporaryDogs: boolean;
}

export interface BreedLifeStage {
  id: string;
  breed_id: string;
  stage_name: 'puppy' | 'junior' | 'adult' | 'senior' | 'geriatric';
  start_age_months: number;
  end_age_months: number;
  min_weight_kg: number;
  max_weight_kg: number;
  daily_calories_per_kg: number;
}

export interface BreedLifeStagesHook {
  stages: BreedLifeStage[];
  loading: boolean;
  error: string | null;
  saveLifeStages: (stages: Omit<BreedLifeStage, 'id' | 'breed_id'>[]) => Promise<boolean>;
  calculateDailyCalories: (ageMonths: number, weightKg: number) => Promise<number | null>;
  refreshStages: () => Promise<void>;
}