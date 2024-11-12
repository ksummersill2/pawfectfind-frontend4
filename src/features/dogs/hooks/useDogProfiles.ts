import { useState, useEffect } from 'react';
import { supabase, fetchWithRetry, handleSupabaseError } from '../../../lib/supabase';
import { useAuth } from '../../auth/hooks/useAuth';
import { Dog } from '../types';
import { DogProfileHook } from './types';

const TEMP_DOGS_KEY = 'temporary_dogs';

export const useDogProfiles = (): DogProfileHook => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [activeDogId, setActiveDogId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAuthenticatedDogs();
    } else {
      loadTemporaryDogs();
    }
  }, [isAuthenticated, user]);

  const fetchAuthenticatedDogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchWithRetry(
        () => supabase
          .from('dogs')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at'),
        {
          onRetry: (attempt) => {
            console.log(`Retrying fetch dogs (attempt ${attempt})...`);
          }
        }
      );
      
      const tempDogs = loadTemporaryDogsFromStorage();
      if (tempDogs.length > 0) {
        for (const dog of tempDogs) {
          await addDog(dog);
        }
        clearTemporaryDogs();
      }

      setDogs(data || []);
    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      console.error('Error fetching dogs:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadTemporaryDogs = () => {
    setLoading(true);
    const tempDogs = loadTemporaryDogsFromStorage();
    setDogs(tempDogs);
    if (tempDogs.length > 0 && !activeDogId) {
      setActiveDogId(tempDogs[0].id);
    }
    setLoading(false);
  };

  const loadTemporaryDogsFromStorage = (): Dog[] => {
    try {
      const stored = localStorage.getItem(TEMP_DOGS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error loading temporary dogs:', err);
      return [];
    }
  };

  const saveTemporaryDogsToStorage = (dogs: Dog[]) => {
    try {
      localStorage.setItem(TEMP_DOGS_KEY, JSON.stringify(dogs));
    } catch (err) {
      console.error('Error saving temporary dogs:', err);
    }
  };

  const clearTemporaryDogs = () => {
    localStorage.removeItem(TEMP_DOGS_KEY);
  };

  const generateTemporaryId = () => {
    return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addDog = async (dogData: Omit<Dog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (isAuthenticated && user) {
      try {
        const data = await fetchWithRetry(
          () => supabase
            .from('dogs')
            .insert([{
              ...dogData,
              user_id: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
            .single()
        );

        setDogs(prev => [...prev, data]);
        setActiveDogId(data.id);
        return data;
      } catch (err) {
        const errorMessage = handleSupabaseError(err);
        console.error('Error adding dog:', errorMessage);
        throw new Error(errorMessage);
      }
    } else {
      const tempDog: Dog = {
        id: generateTemporaryId(),
        user_id: 'temporary',
        ...dogData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedDogs = [...dogs, tempDog];
      setDogs(updatedDogs);
      setActiveDogId(tempDog.id);
      saveTemporaryDogsToStorage(updatedDogs);
      return tempDog;
    }
  };

  return {
    dogs,
    activeDogId,
    setActiveDogId,
    loading,
    error,
    addDog,
    refreshDogs: isAuthenticated ? fetchAuthenticatedDogs : loadTemporaryDogs,
    hasTemporaryDogs: !isAuthenticated && dogs.length > 0
  };
};

export default useDogProfiles;