import React from 'react';
import { useParams } from 'react-router-dom';
import { Shield, FileText, Scale, AlertTriangle } from 'lucide-react';
import SEO from '../../common/components/SEO';

const LegalPages: React.FC = () => {
  const { page } = useParams<{ page: string }>();

  const legalContent = {
    'terms-of-service': {
      title: 'Terms of Service',
      icon: FileText,
      content: `
        <h2>1. Terms</h2>
        <p>By accessing PawfectFind, you agree to be bound by these terms of service and comply with all applicable laws and regulations.</p>

        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily access the materials on PawfectFind's website for personal, non-commercial viewing only.</p>

        <h2>3. Disclaimer</h2>
        <p>The materials on PawfectFind's website are provided on an 'as is' basis. PawfectFind makes no warranties, expressed or implied.</p>
      `
    },
    'privacy-policy': {
      title: 'Privacy Policy',
      icon: Shield,
      content: `
        <h2>Information Collection</h2>
        <p>We collect information that you provide directly to us, including when you create an account, make a purchase, or contact us for support.</p>

        <h2>Use of Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you.</p>

        <h2>Data Protection</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal information.</p>
      `
    },
    'shipping-policy': {
      title: 'Shipping Policy',
      icon: Scale,
      content: `
        <h2>Shipping Methods</h2>
        <p>We offer various shipping methods to meet your needs. Standard shipping typically takes 3-5 business days.</p>

        <h2>International Shipping</h2>
        <p>We ship to most countries worldwide. International shipping times vary by destination.</p>

        <h2>Tracking Orders</h2>
        <p>Once your order ships, you'll receive a tracking number to monitor your delivery status.</p>
      `
    },
    'refund-policy': {
      title: 'Refund Policy',
      icon: AlertTriangle,
      content: `
        <h2>Return Window</h2>
        <p>You have 30 days from the date of delivery to return unused items in their original packaging.</p>

        <h2>Refund Process</h2>
        <p>Refunds are processed within 5-7 business days of receiving the returned item.</p>

        <h2>Non-Returnable Items</h2>
        <p>Certain items, such as personalized products or opened pet food, cannot be returned.</p>
      `
    }
  };

  const selectedPage = page ? legalContent[page as keyof typeof legalContent] : null;

  if (!selectedPage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          Legal page not found
        </h1>
      </div>
    );
  }

  const Icon = selectedPage.icon;

  return (
    <>
      <SEO 
        title={`${selectedPage.title} | PawfectFind`}
        description={`Read our ${selectedPage.title.toLowerCase()} to understand your rights and our obligations.`}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedPage.title}
            </h1>
          </div>

          <div 
            className="prose prose-blue max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: selectedPage.content }}
          />

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalPages;