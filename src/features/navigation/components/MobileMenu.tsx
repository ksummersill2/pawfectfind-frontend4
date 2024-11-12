import React from 'react';
import { Link } from 'react-router-dom';
import { X, Package, Heart, MessageCircle, Tag, Dog, Info, Book, Settings, ShoppingBag, Users, HelpCircle, Gift } from 'lucide-react';
import { NavigationItem } from '../types';
import { useAuth } from '../../auth/hooks/useAuth';
import { useDogProfiles } from '../../dogs/hooks';
import { useBundles } from '../../bundle-builder/hooks/useBundles';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { dogs } = useDogProfiles();
  const { user } = useAuth();
  const { bundles } = useBundles();

  const menuSections = [
    {
      title: 'Shop',
      items: [
        { path: '/category/all', icon: Package, label: 'All Products' },
        { path: '/black-friday', icon: Tag, label: 'Black Friday Deals' },
        { path: '/favorites', icon: Heart, label: 'My Favorites' },
        { path: '/category/new', icon: ShoppingBag, label: 'New Arrivals' },
        { 
          path: '/bundles', 
          icon: Gift, 
          label: 'My Bundles',
          badge: bundles.length > 0 ? bundles.length : undefined
        }
      ]
    },
    // ... rest of the sections remain the same
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
              <Dog className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PawfectFind
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Sections */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuSections.map((section) => (
              <div key={section.title} className="px-4 mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={onClose}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;