import React from 'react';
import { Link } from 'react-router-dom';
import { Dog, Package, Heart, MessageCircle, Tag, Gift } from 'lucide-react';
import { SearchBar } from '../../search/components';
import { UserMenu } from '../../auth/components';
import { DogSelector } from '../../dogs/components';
import { useDogProfiles } from '../../dogs/hooks';
import { useBundles } from '../../bundle-builder/hooks/useBundles';

const DesktopHeader: React.FC = () => {
  const { dogs, activeDogId, setActiveDogId } = useDogProfiles();
  const { bundles } = useBundles();

  const navigationItems = [
    { path: '/category/all', icon: Package, label: 'Products' },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
    { path: '/community', icon: MessageCircle, label: 'Community' },
    { path: '/black-friday', icon: Tag, label: 'Black Friday' },
    { 
      path: '/bundles', 
      icon: Gift, 
      label: 'My Bundles',
      badge: bundles.length > 0 ? bundles.length : undefined
    },
  ];

  return (
    <header className="sticky top-0 z-40 hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Dog className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              PawfectFind
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <item.icon className="w-5 h-5 mr-1" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div className="w-64">
              <SearchBar />
            </div>
            <DogSelector
              dogs={dogs}
              activeDogId={activeDogId}
              onDogSelect={setActiveDogId}
            />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;