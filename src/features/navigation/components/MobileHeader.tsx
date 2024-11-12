import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, X, Dog } from 'lucide-react';
import { SearchBar } from '../../search/components';
import { DogSelector } from '../../dogs/components';
import { useDogProfiles } from '../../dogs/hooks';

interface MobileHeaderProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  isSearchOpen,
  setIsSearchOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  const { dogs, activeDogId, setActiveDogId } = useDogProfiles();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Dog className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              PawfectFind
            </span>
          </Link>

          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 -mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {isSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-3">
            <SearchBar />
          </div>
        )}

        {/* Dog Selector */}
        <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
          <DogSelector
            dogs={dogs}
            activeDogId={activeDogId}
            onDogSelect={setActiveDogId}
          />
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;