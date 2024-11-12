import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem } from '../types';

interface NavigationProps {
  items: NavigationItem[];
}

const Navigation: React.FC<NavigationProps> = ({ items }) => {
  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <item.icon className="w-5 h-5 mr-1" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;