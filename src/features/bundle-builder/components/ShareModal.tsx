import React from 'react';
import { X, Facebook, Twitter, MessageCircle, Mail, Link2 } from 'lucide-react';
import { Bundle } from '../types';
import { formatCurrency } from '../../../utils/formatters';

interface ShareModalProps {
  bundle: Bundle;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ bundle, onClose }) => {
  const shareUrl = `${window.location.origin}/bundle/${bundle.id}`;
  const shareText = `Check out this Pawfect Gift Bundle for ${bundle.breed}s! Total value: ${formatCurrency(bundle.total_price)}`;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-[#1877f2] hover:bg-[#0d65d9]'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-[#1da1f2] hover:bg-[#0c85d0]'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      color: 'bg-[#25d366] hover:bg-[#1da851]'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=Check out this Pawfect Gift Bundle&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Share this bundle
          </h3>

          <div className="flex flex-wrap gap-4 mb-6">
            {shareLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${platform.color}`}
              >
                <platform.icon className="w-5 h-5 mr-2" />
                {platform.name}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            />
            <button
              onClick={copyToClipboard}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Link2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;