import React, { useState } from 'react';
import { Bell, Plus, Calendar, Clock, Trash2 } from 'lucide-react';
import SEO from '../../common/components/SEO';

const RemindersPage: React.FC = () => {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Vet Appointment",
      date: "2024-03-15",
      time: "14:30",
      type: "medical",
      description: "Annual checkup and vaccinations"
    },
    {
      id: 2,
      title: "Grooming Session",
      date: "2024-03-20",
      time: "10:00",
      type: "grooming",
      description: "Full grooming service"
    }
  ]);

  return (
    <>
      <SEO 
        title="Pet Reminders - PawfectFind"
        description="Set and manage reminders for your pet's care routine"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mb-4">
            <Bell className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pet Reminders
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Never miss an important date in your pet's care routine
          </p>
        </div>

        <div className="mb-6">
          <button className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
            <Plus className="w-5 h-5 mr-2" />
            Add Reminder
          </button>
        </div>

        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {reminder.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {reminder.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(reminder.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {reminder.time}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RemindersPage;