import React from 'react';
import { X, Facebook, Twitter, MessageSquare, Link2, Copy, Check } from 'lucide-react';
import { Bundle } from '../types';
import { formatCurrency } from '../../../utils/formatters';

interface ShareBundleModalProps {
  bundle: Bundle;
  onClose: () => void;
}

const ShareBundleModal: React.FC<ShareBundleModalProps> = ({ bundle, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = `${window.location.origin}/bundle/${bundle.id}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this ${bundle.breed} gift bundle I created on PawfectFind!`)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this ${bundle.breed} gift bundle I created on PawfectFind! ${shareUrl}`)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Share Bundle
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {bundle.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {bundle.items?.length || 0} items • {formatCurrency(bundle.total_price)}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center space-x-6">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-blue-600"
              >
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-2">
                  <Facebook className="w-6 h-6" />
                </div>
                <span className="text-sm">Facebook</span>
              </a>
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-blue-400"
              >
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-2">
                  <Twitter className="w-6 h-6" />
                </div>
                <span className="text-sm">Twitter</span>
              </a>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-green-600"
              >
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-2">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-sm">WhatsApp</span>
              </a>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500">
                  or copy link
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareBundleModal;