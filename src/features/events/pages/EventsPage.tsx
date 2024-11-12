import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import SEO from '../../common/components/SEO';

const EventsPage: React.FC = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Puppy Playdate in the Park",
      date: "2024-03-15",
      time: "10:00 AM",
      location: "Central Park Dog Run",
      description: "Join us for a fun morning of puppy socialization and play!",
      attendees: 12
    },
    {
      id: 2,
      title: "Dog Training Workshop",
      date: "2024-03-20",
      time: "2:00 PM",
      location: "PawfectFind Training Center",
      description: "Learn essential training techniques from professional trainers.",
      attendees: 8
    }
  ];

  return (
    <>
      <SEO 
        title="Pet Events - PawfectFind"
        description="Discover and join local pet events in your area"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pet Events
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join local events and connect with other pet owners
          </p>
        </div>

        <div className="grid gap-6">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {event.attendees} attending
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Join Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EventsPage;