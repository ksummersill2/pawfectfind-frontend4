import React, { useState, useEffect } from 'react';
import { Heart, Activity, Calendar, Weight, Ruler, Plus, AlertCircle, Info } from 'lucide-react';
import { useDogProfiles } from '../../dogs/hooks';
import { supabase } from '../../../lib/supabase';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { formatDate } from '../../../utils/formatters';

interface HealthRecord {
  id: string;
  dog_id: string;
  date: string;
  weight: number;
  height?: number;
  activity_level: number;
  notes?: string;
  symptoms?: string[];
  medications?: string[];
}

const HealthTrackerPage: React.FC = () => {
  const { dogs, activeDogId } = useDogProfiles();
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<HealthRecord>>({
    date: new Date().toISOString().split('T')[0],
    activity_level: 5
  });

  const activeDog = dogs.find(dog => dog.id === activeDogId);

  useEffect(() => {
    if (activeDog) {
      fetchHealthRecords();
    }
  }, [activeDog]);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('health_records')
        .select('*')
        .eq('dog_id', activeDog?.id)
        .order('date', { ascending: false });

      if (fetchError) throw fetchError;
      setHealthRecords(data || []);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setError('Failed to load health records');
    } finally {
      setLoading(false);
    }
  };

  const addHealthRecord = async () => {
    if (!activeDog) return;

    try {
      const { error } = await supabase
        .from('health_records')
        .insert([{
          ...newRecord,
          dog_id: activeDog.id
        }]);

      if (error) throw error;
      
      await fetchHealthRecords();
      setShowAddRecord(false);
      setNewRecord({
        date: new Date().toISOString().split('T')[0],
        activity_level: 5
      });
    } catch (err) {
      console.error('Error adding health record:', err);
      setError('Failed to add health record');
    }
  };

  const getWeightTrend = () => {
    if (healthRecords.length < 2) return 'stable';
    const latest = healthRecords[0].weight;
    const previous = healthRecords[1].weight;
    return latest > previous ? 'increasing' : latest < previous ? 'decreasing' : 'stable';
  };

  const getActivityTrend = () => {
    if (healthRecords.length < 2) return 'stable';
    const latest = healthRecords[0].activity_level;
    const previous = healthRecords[1].activity_level;
    return latest > previous ? 'increasing' : latest < previous ? 'decreasing' : 'stable';
  };

  return (
    <>
      <SEO 
        title="Health Tracker - PawfectFind"
        description="Track and monitor your pet's health metrics and wellness journey"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/50 rounded-full mb-4">
            <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Health Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Monitor your pet's health and wellness journey
          </p>
        </div>

        {activeDog ? (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Weight className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weight</h3>
                  </div>
                  <span className={`text-sm font-medium ${
                    getWeightTrend() === 'increasing' ? 'text-red-500' :
                    getWeightTrend() === 'decreasing' ? 'text-green-500' :
                    'text-gray-500'
                  }`}>
                    {getWeightTrend() === 'increasing' ? '↑' :
                     getWeightTrend() === 'decreasing' ? '↓' : '→'}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {healthRecords[0]?.weight || activeDog.weight} kg
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Activity className="w-6 h-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity</h3>
                  </div>
                  <span className={`text-sm font-medium ${
                    getActivityTrend() === 'increasing' ? 'text-green-500' :
                    getActivityTrend() === 'decreasing' ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    {getActivityTrend() === 'increasing' ? '↑' :
                     getActivityTrend() === 'decreasing' ? '↓' : '→'}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {healthRecords[0]?.activity_level || activeDog.activity_level}/10
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Last Check</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {healthRecords[0] ? formatDate(healthRecords[0].date) : 'No records'}
                </p>
              </div>
            </div>

            {/* Add Record Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddRecord(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Record
              </button>
            </div>

            {/* Health Records */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Health Records
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Weight</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Activity</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {healthRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {record.weight} kg
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {record.activity_level}/10
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {record.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Select or add a dog to start tracking their health
            </p>
          </div>
        )}

        {/* Add Record Modal */}
        {showAddRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Add Health Record
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newRecord.weight}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Activity Level (1-10)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newRecord.activity_level}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, activity_level: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddRecord(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addHealthRecord}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HealthTrackerPage;