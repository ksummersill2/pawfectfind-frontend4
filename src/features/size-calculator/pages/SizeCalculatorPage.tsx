import React, { useState, useEffect } from 'react';
import { Scale, Calculator, Dog, AlertCircle, Info } from 'lucide-react';
import { BreedSelect } from '../../dogs/components/BreedSelect';
import { useDogProfiles } from '../../dogs/hooks';
import { supabase } from '../../../lib/supabase';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';

interface WeightPrediction {
  idealWeight: number;
  weightRange: [number, number];
  growthPercentage: number;
  adultWeight: [number, number];
}

const SizeCalculatorPage: React.FC = () => {
  const { dogs, activeDogId } = useDogProfiles();
  const [breed, setBreed] = useState('');
  const [ageMonths, setAgeMonths] = useState<number>(0);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [prediction, setPrediction] = useState<WeightPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breedData, setBreedData] = useState<any>(null);

  useEffect(() => {
    // First try to get breed from active dog
    const activeDog = dogs.find(dog => dog.id === activeDogId);
    if (activeDog) {
      setBreed(activeDog.breed);
      setAgeMonths(Math.round(activeDog.age * 12));
      setCurrentWeight(activeDog.weight);
    }
  }, [dogs, activeDogId]);

  useEffect(() => {
    if (breed) {
      fetchBreedData();
    }
  }, [breed]);

  const fetchBreedData = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('dog_breeds')
        .select(`
          id,
          name,
          breed_size_variations (
            size_category,
            breed_characteristics (
              gender,
              min_weight_kg,
              max_weight_kg
            )
          )
        `)
        .eq('name', breed)
        .single();

      if (fetchError) throw fetchError;
      setBreedData(data);
      calculatePrediction(data);
    } catch (err) {
      console.error('Error fetching breed data:', err);
      setError('Failed to load breed data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrediction = (data: any) => {
    if (!data || !currentWeight || ageMonths === 0) return;

    const characteristics = data.breed_size_variations[0]?.breed_characteristics
      .find((c: any) => c.gender === gender);

    if (!characteristics) return;

    const { min_weight_kg, max_weight_kg } = characteristics;
    
    // Growth curve calculation
    const maxGrowthMonths = 24; // Most dogs reach full size by 24 months
    const growthPercentage = Math.min((ageMonths / maxGrowthMonths) * 100, 100);
    
    // Calculate predicted adult weight based on current weight and age
    const predictedMinWeight = (currentWeight / (growthPercentage / 100)) * 0.9;
    const predictedMaxWeight = (currentWeight / (growthPercentage / 100)) * 1.1;

    // Calculate ideal weight range for current age
    const idealMinWeight = (min_weight_kg * (growthPercentage / 100));
    const idealMaxWeight = (max_weight_kg * (growthPercentage / 100));
    
    setPrediction({
      idealWeight: (idealMinWeight + idealMaxWeight) / 2,
      weightRange: [idealMinWeight, idealMaxWeight],
      growthPercentage,
      adultWeight: [predictedMinWeight, predictedMaxWeight]
    });
  };

  const handleCalculate = () => {
    if (!breed || !currentWeight || ageMonths === 0) {
      setError('Please fill in all fields');
      return;
    }
    calculatePrediction(breedData);
  };

  return (
    <>
      <SEO 
        title="Size Calculator - PawfectFind"
        description="Calculate your dog's ideal weight and track their growth progress"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
            <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Size Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track your dog's growth and compare with breed standards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Enter Your Dog's Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Breed
                </label>
                <BreedSelect
                  value={breed}
                  onChange={setBreed}
                  placeholder="Select breed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setGender('male')}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      gender === 'male'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      gender === 'female'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age (months)
                </label>
                <input
                  type="number"
                  min="0"
                  max="240"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
                />
              </div>

              {error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Growth Prediction
            </h2>

            {loading ? (
              <LoadingSpinner />
            ) : prediction ? (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Current Growth Status
                  </h3>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          {prediction.growthPercentage.toFixed(0)}% Grown
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div
                        style={{ width: `${prediction.growthPercentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Ideal Weight Range
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {prediction.weightRange[0].toFixed(1)} - {prediction.weightRange[1].toFixed(1)} kg
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Predicted Adult Weight
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {prediction.adultWeight[0].toFixed(1)} - {prediction.adultWeight[1].toFixed(1)} kg
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    These predictions are based on breed standards and typical growth patterns.
                    Individual dogs may vary. Consult your veterinarian for personalized advice.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Dog className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  Enter your dog's details to see growth predictions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SizeCalculatorPage;