import React from 'react';
import { Search, Heart, Shield, Users, Star, Package, Dog } from 'lucide-react';
import SEO from '../../common/components/SEO';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find the perfect products with our intelligent search system that understands your dog\'s specific needs.'
    },
    {
      icon: Heart,
      title: 'Personalized Recommendations',
      description: 'Get tailored product suggestions based on your dog\'s breed, age, size, and unique requirements.'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Every product is carefully vetted to ensure it meets our high standards for quality and safety.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join a community of dog lovers sharing experiences and recommendations.'
    },
    {
      icon: Star,
      title: 'Expert Reviews',
      description: 'Access detailed product reviews from veterinarians and dog care professionals.'
    },
    {
      icon: Package,
      title: 'Curated Selection',
      description: 'Browse our handpicked collection of the best dog products available in the market.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Veterinary Officer',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      description: 'Veterinarian with 15+ years of experience in pet care and nutrition.'
    },
    {
      name: 'Mike Anderson',
      role: 'Product Specialist',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      description: 'Expert in dog products with a background in animal behavior.'
    },
    {
      name: 'Emily Chen',
      role: 'Community Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      description: 'Passionate about building and nurturing our dog-loving community.'
    }
  ];

  return (
    <>
      <SEO 
        title="About PawfectFind - Our Mission and Team"
        description="Learn about PawfectFind's mission to help dog owners find the perfect products for their pets through personalized recommendations and expert guidance."
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Dog className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Making Pet Care Easier
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're on a mission to help dog owners find the perfect products for their pets through
            personalized recommendations and expert guidance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <feature.icon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Have questions or suggestions? We'd love to hear from you.
          </p>
          <a
            href="mailto:support@pawfectfind.com"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Contact Us
          </a>
        </section>
      </main>
    </>
  );
};

export default AboutPage;