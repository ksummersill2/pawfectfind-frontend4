import React, { useState, useEffect } from 'react';
import { Book, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import LoadingSpinner from '../../common/components/LoadingSpinner';

interface ArticleProps {
  breedId: string;
  breedName: string;
}

interface Article {
  id: string;
  title: string;
  description: string;
  external_url: string;
  image_url: string;
  read_time: string;
  source: string;
  created_at: string;
}

const ArticleSection: React.FC<ArticleProps> = ({ breedId, breedName }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, [breedId]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('breed_articles')
        .select('*')
        .eq('breed_id', breedId)
        .order('created_at', { ascending: false })
        .limit(4);

      if (fetchError) throw fetchError;
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Unable to load articles at this time');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article: Article) => {
    if (article.external_url) {
      window.open(article.external_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Book className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400">
          No articles available yet for {breedName}
        </p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
        <Book className="w-6 h-6 mr-2" />
        Featured Articles
      </h2>

      <div className="grid gap-6">
        {articles.map(article => (
          <button
            key={article.id}
            onClick={() => handleArticleClick(article)}
            className="block w-full text-left bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-48">
              <div className="w-1/3">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Book className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="w-2/3 p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 rounded-full">
                      {article.source}
                    </span>
                    {article.read_time && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.read_time}
                      </div>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ArticleSection;