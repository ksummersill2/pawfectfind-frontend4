import React, { useState } from 'react';
import { Dog, Search, Heart, MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OnboardingWalkthroughProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingWalkthrough: React.FC<OnboardingWalkthroughProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to PawfectFind",
      description: "Your personalized dog product discovery platform. We help you find the perfect products tailored to your dog's specific needs.",
      icon: Dog,
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Add Your Dog's Profile",
      description: "Tell us about your furry friend to get personalized product recommendations based on their breed, age, size, and activity level.",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Smart Product Search",
      description: "Find products that are perfect for your dog. Our intelligent search understands your dog's needs and suggests the best options.",
      icon: Search,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Join the Community",
      description: "Connect with other dog owners, share experiences, and get advice from our community of pet lovers.",
      icon: MessageCircle,
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl relative overflow-hidden">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative">
          <img
            src={steps[currentStep].image}
            alt={steps[currentStep].title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              {React.createElement(steps[currentStep].icon, {
                className: "w-6 h-6 text-blue-600 dark:text-blue-400"
              })}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {steps[currentStep].title}
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {steps[currentStep].description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onSkip}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              </button>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/dogs"
                className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={onComplete}
              >
                <Dog className="w-5 h-5 mr-2" />
                Add Your Dog Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWalkthrough;