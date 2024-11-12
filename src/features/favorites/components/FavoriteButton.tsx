import React from 'react';
import PawIcon from '../../../components/icons/PawIcon';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <PawIcon
        className={`w-6 h-6 transform transition-transform ${
          isFavorite
            ? 'text-blue-500 fill-current rotate-12'
            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      />
    </button>
  );
};

export default FavoriteButton;