import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, ExternalLink } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Article } from '../types';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';

const ArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('breed_articles')
        .select(`
          *,
          author:author_profile_id(
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('id', articleId)
        .single();

      if (fetchError) throw fetchError;
      setArticle(data);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-red-600 dark:text-red-400">
          {error || 'Article not found'}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={article.title}
        description={article.description}
        image={article.image_url}
        type="article"
      />

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to={`/breed/${article.breed_id}`}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Breed Page
        </Link>

        {/* Article Preview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Article Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 rounded-full capitalize">
                {article.category}
              </span>
              {article.read_time && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.read_time}
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {article.title}
            </h1>

            {article.author && (
              <div className="flex items-center">
                {article.author.avatar_url ? (
                  <img
                    src={article.author.avatar_url}
                    alt={article.author.display_name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400 mr-3" />
                )}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {article.author.display_name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="relative h-[400px]">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          {/* Article Preview */}
          <div className="p-6">
            <div className="prose prose-blue max-w-none dark:prose-invert mb-8">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {article.description}
              </p>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col items-center justify-center space-y-4 mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Continue reading this article on the original website
              </p>
              <a
                href={article.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read Full Article
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default ArticlePage;