import React, { useState, useEffect } from 'react';
import { Book, ExternalLink, Clock, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

interface BlogSectionProps {
  breedId: string;
  breedName: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  cover_image: string;
  reading_time_minutes: number;
  published_at: string;
  meta_description: string;
  tags: string[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ breedId, breedName }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, [breedId]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get the breed name in lowercase for tag matching
      const breedTag = breedName.toLowerCase().replace(/\s+/g, '-');

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          excerpt,
          cover_image,
          reading_time_minutes,
          published_at,
          meta_description,
          tags
        `)
        .eq('status', 'published')
        .contains('tags', [breedTag]) // Filter posts that have the breed tag
        .order('published_at', { ascending: false })
        .limit(3);

      if (fetchError) {
        console.error('Error fetching blogs:', fetchError);
        setError('Failed to load blog posts');
        return;
      }

      setBlogs(data || []);
    } catch (err) {
      console.error('Error in blog fetch:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
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

  if (blogs.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Book className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400">
          No blog posts available yet for {breedName}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Check back later for breed-specific content
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Book className="w-6 h-6 mr-2" />
          Featured Blog Posts
        </h2>
        <a
          href={`/breed/${breedName}/blogs`}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center"
        >
          View All
          <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>

      <div className="space-y-6">
        {blogs.map((blog) => (
          <a
            key={blog.id}
            href={`/blog/${blog.id}`}
            className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-48">
              <div className="w-1/3">
                {blog.cover_image ? (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Book className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="w-2/3 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50 rounded-full">
                    Blog Post
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {blog.reading_time_minutes} min read
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {blog.excerpt || blog.meta_description}
                </p>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Published {formatDistanceToNow(new Date(blog.published_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;