import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Book, User, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { Article, ArticleFilters } from '../types/content';

const ArticlesPage: React.FC = () => {
  const { breed } = useParams<{ breed: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ArticleFilters>({
    category: undefined,
    searchQuery: ''
  });

  useEffect(() => {
    fetchArticles();
  }, [breed, filters.category]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data: breedData, error: breedError } = await supabase
        .from('dog_breeds')
        .select('id')
        .eq('name', breed)
        .single();

      if (breedError) throw breedError;

      let query = supabase
        .from('breed_content')
        .select(`
          id,
          breed_id,
          title,
          description,
          content,
          image_url,
          read_time,
          category,
          created_at,
          author_profile_id,
          author:profiles(id, display_name, avatar_url)
        `)
        .eq('breed_id', breedData.id)
        .order('created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error: articlesError } = await query;

      if (articlesError) throw articlesError;
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    !filters.searchQuery || 
    article.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO 
        title={`${breed} Articles & Blogs`}
        description={`Read helpful articles and blog posts about ${breed} care, training, and more`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link
            to={`/breed/${breed}`}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to {breed} Overview
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {breed} Articles & Blogs
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div className="flex gap-2">
              {(['all', 'article', 'blog'] as const).map((category) => (
                <button
                  key={category}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    category: category === 'all' ? undefined : category
                  }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    (category === 'all' && !filters.category) || filters.category === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category === 'all' ? 'All Content' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-600 dark:text-red-400">{error}</div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              No articles found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredArticles.map(article => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-48">
                  <div className="w-1/3">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 rounded-full capitalize">
                        {article.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.read_time}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                      {article.description}
                    </p>

                    {article.author && (
                      <div className="flex items-center">
                        {article.author.avatar_url ? (
                          <img
                            src={article.author.avatar_url}
                            alt={article.author.display_name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400 mr-2" />
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {article.author.display_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ArticlesPage;