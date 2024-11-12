import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, ShoppingCart, Star, Info, ExternalLink } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useFavorites } from '../../favorites/hooks/useFavorites';
import { Product } from '../types';
import ProductReview from '../components/ProductReview';
import ReviewForm from '../components/ReviewForm';
import ShareModal from '../components/ShareModal';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import ErrorMessage from '../../common/components/ErrorMessage';
import { generateAffiliateLink } from '../../../lib/amazonAffiliateLink';
import PawIcon from '../../../components/icons/PawIcon';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  const isFavorite = favorites.includes(product.id);
  const affiliateUrl = product.affiliate_link ? generateAffiliateLink(product.affiliate_link) : null;

  return (
    <>
      <SEO
        title={product.name}
        description={product.description}
        image={product.image}
        type="product"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg shadow-lg object-cover"
            />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full">
                {product.discount}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-gray-600 dark:text-gray-400">
                    {product.rating} rating
                  </span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {product.vendor}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </div>
              {product.discount > 0 && (
                <div className="text-xl text-gray-500 line-through">
                  ${((product.price * 100) / (100 - product.discount)).toFixed(2)}
                </div>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              {product.description}
            </p>

            <div className="flex space-x-4">
              {affiliateUrl ? (
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  View on Amazon
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              ) : (
                <button className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              )}
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`p-3 rounded-lg border ${
                  isFavorite
                    ? 'bg-blue-50 border-blue-200 text-blue-500'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <PawIcon className={`w-6 h-6 transform transition-transform ${
                  isFavorite ? 'rotate-12' : ''
                }`} />
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="p-3 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
              >
                <Share2 />
              </button>
            </div>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Customer Reviews
            </h2>
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Write a Review
            </button>
          </div>

          {/* Review Form Modal */}
          {showReviewForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6">
                <ReviewForm
                  productId={product.id}
                  onSubmit={async (review) => {
                    // Handle review submission
                    setShowReviewForm(false);
                  }}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product}
      />
    </>
  );
};

export default ProductPage;