import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Package, Heart, Star, ArrowRight } from 'lucide-react';

const BundleBuilderPromo: React.FC = () => {
  const bundleTemplates = [
    {
      name: "New Puppy Welcome Pack",
      description: "Everything needed for your new family member",
      discount: 20,
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Luxury Spa Day Bundle",
      description: "Premium grooming and wellness products",
      discount: 15,
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Training Success Kit",
      description: "Essential tools for effective training",
      discount: 15,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="mb-12 lg:mb-0">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-6">
              <Gift className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Featured Bundles
              </span>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Create the Pawfect Gift Bundle
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Mix and match products to create personalized gift sets for any dog lover.
              Save up to 20% when you bundle!
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Pre-designed bundles for every occasion
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Personalized for your dog's breed
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Save more with bundle discounts
                </span>
              </div>
            </div>

            <Link
              to="/bundle-builder"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Building
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {/* Right Column - Bundle Templates */}
          <div className="space-y-6">
            {bundleTemplates.map((template, index) => (
              <Link
                key={index}
                to="/bundle-builder"
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="w-1/3">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {template.description}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-600 text-sm font-medium rounded-full">
                      Save {template.discount}%
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleBuilderPromo;