import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, ChevronDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Article } from '../types';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';

const BlogsPage: React.FC = () => {
  const { breed } = useParams<{ breed: string }>();
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [breed]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data: breedData, error: breedError } = await supabase
        .from('dog_breeds')
        .select('id')
        .eq('name', breed)
        .single();

      if (breedError) throw breedError;

      const { data: blogsData, error: blogsError } = await supabase
        .from('breed_content')
        .select(`
          id,
          title,
          description,
          content,
          image_url,
          breed_id,
          category,
          read_time,
          author:user_id(
            name:display_name,
            avatar_url
          ),
          created_at
        `)
        .eq('breed_id', breedData.id)
        .eq('category', 'blog')
        .order('created_at', { ascending: false });

      if (blogsError) throw blogsError;
      setBlogs(blogsData || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <SEO 
        title={`${breed} Blog Posts`}
        description={`Read the latest blog posts about ${breed} care, experiences, and stories`}
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
            {breed} Blog Posts
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blog posts..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-red-600 dark:text-red-400">{error}</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No blog posts found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBlogs.map(blog => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-48">
                  <div className="w-1/3">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {blog.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <img
                        src={blog.author.avatar_url}
                        alt={blog.author.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span>{blog.author.name}</span>
                      <span className="mx-2">•</span>
                      <span>{blog.read_time} read</span>
                    </div>
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

export default BlogsPage;