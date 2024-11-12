import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/hooks/useAuth';
import { MessageCircle, Plus, Filter } from 'lucide-react';
import PostList from '../components/PostList';
import CreatePostModal from '../components/CreatePostModal';
import CategoryFilter from '../components/CategoryFilter';
import SEO from '../../common/components/SEO';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { Post } from '../types';

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          user:profiles(display_name, avatar_url),
          comments:post_comments(count),
          likes:post_likes(count)
        `)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData: Omit<Post, 'id' | 'user_id' | 'created_at'>) => {
    try {
      if (!user) throw new Error('Must be logged in to create a post');

      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          ...postData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const handleUpdatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update(updates)
        .eq('id', postId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, ...updates } : post
        )
      );
    } catch (err) {
      console.error('Error updating post:', err);
      throw err;
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  return (
    <>
      <SEO 
        title="Community - PawfectFind"
        description="Join our pet-loving community. Share experiences, ask questions, and connect with other pet owners."
        image="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Connect with fellow pet owners and share your experiences
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Post
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64">
            <div className="sticky top-24">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-5 h-5 mr-2" />
                {posts.length} posts
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <PostList
                posts={posts}
                onUpdate={fetchPosts}
                currentUser={user}
              />
            )}
          </div>
        </div>

        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      </div>
    </>
  );
};

export default CommunityPage;