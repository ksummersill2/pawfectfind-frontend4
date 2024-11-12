import React from 'react';
import { FileText } from 'lucide-react';
import SEO from '../../common/components/SEO';

const TermsOfService: React.FC = () => {
  return (
    <>
      <SEO 
        title="Terms of Service - PawfectFind"
        description="Read our terms of service and user agreement for PawfectFind"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Terms of Service
            </h1>
          </div>

          <div className="prose prose-blue max-w-none dark:prose-invert">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using PawfectFind, you agree to be bound by these Terms of Service
              and all applicable laws and regulations.
            </p>

            <h2>2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information.
              You are responsible for maintaining the security of your account.
            </p>

            <h2>3. Product Information</h2>
            <p>
              We strive to provide accurate product information but do not warrant that product
              descriptions or prices are accurate, complete, or current.
            </p>

            <h2>4. User Content</h2>
            <p>
              By posting content on PawfectFind, you grant us a non-exclusive, worldwide, royalty-free
              license to use, display, and distribute your content.
            </p>

            <h2>5. Prohibited Activities</h2>
            <p>
              You agree not to:
            </p>
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Post false or misleading information</li>
              <li>Interfere with the proper working of the service</li>
              <li>Attempt to bypass any security measures</li>
            </ul>

            <h2>6. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to our services
              at our sole discretion, without notice.
            </p>

            <h2>7. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without any warranties, express or implied.
            </p>

            <h2>Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@pawfectfind.com</li>
              <li>Phone: 1-800-PAWFECT</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;