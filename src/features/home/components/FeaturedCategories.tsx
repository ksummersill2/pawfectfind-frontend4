import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, Bath, Cookie } from 'lucide-react';

const categories = [
  {
    id: 'food',
    name: 'Food & Nutrition',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    description: 'Premium food for every life stage',
    icon: Cookie
  },
  {
    id: 'toys',
    name: 'Toys & Play',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    description: 'Engaging toys for mental stimulation',
    icon: Package
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
    description: 'Keep your pet healthy & happy',
    icon: Heart
  },
  {
    id: 'grooming',
    name: 'Grooming',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
    description: 'Professional grooming supplies',
    icon: Bath
  }
];

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find the perfect products for your furry friend
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <category.icon className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">
                    {category.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-200">
                  {category.description}
                </p>
              </div>

              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-900">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;