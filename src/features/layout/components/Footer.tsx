import React from 'react';
import { Link } from 'react-router-dom';
import { Dog, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/category/all' },
        { label: 'New Arrivals', href: '/category/new' },
        { label: 'Best Sellers', href: '/category/best-sellers' },
        { label: 'Deals', href: '/black-friday' }
      ]
    },
    {
      title: 'Learn',
      links: [
        { label: 'Breed Guide', href: '/breeds' },
        { label: 'Training Tips', href: '/training' },
        { label: 'Health & Care', href: '/health' },
        { label: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Discussion Forum', href: '/community' },
        { label: 'Expert Advice', href: '/community/experts' },
        { label: 'Events', href: '/community/events' },
        { label: 'Success Stories', href: '/community/stories' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Contact', href: '/contact' }
      ]
    }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Dog className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PawfectFind
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
              Your trusted companion in finding the perfect products for your furry friend.
              Join our community of pet lovers and discover the best for your dog.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Made with Love */}
        <div className="py-4 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> for pet lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;