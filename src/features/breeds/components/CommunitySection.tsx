import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';

interface CommunitySectionProps {
  breedName: string;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ breedName }) => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-4">
        <MessageCircle className="w-6 h-6 mr-2" />
        Join the Community
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Connect with other {breedName} owners, share experiences, and get advice.
      </p>
      <a
        href="/community"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400"
      >
        Visit Community
        <ExternalLink className="w-4 h-4 ml-1" />
      </a>
    </section>
  );
};

export default CommunitySection;