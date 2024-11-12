import React from 'react';
import { Link } from 'react-router-dom';
import { User, MessageCircle, Heart, Trash2, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../types';
import { useAuth } from '../../auth/hooks/useAuth';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => Promise<void>;
  onEdit?: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onEdit }) => {
  const { user } = useAuth();
  const isAuthor = user?.id === post.user_id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            {post.user?.avatar_url ? (
              <img
                src={post.user.avatar_url}
                alt={post.user.display_name || ''}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {post.user?.display_name || 'Anonymous'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          {isAuthor && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit?.(post)}
                className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete?.(post.id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <Link to={`/community/post/${post.id}`} className="block mt-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            {post.title}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">
            {post.content}
          </p>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
              <Heart className="w-5 h-5 mr-1" />
              <span>{post.likes}</span>
            </button>
            <Link
              to={`/community/post/${post.id}`}
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <MessageCircle className="w-5 h-5 mr-1" />
              <span>{post.comments?.[0]?.count || 0}</span>
            </Link>
          </div>
          {post.breed && (
            <Link
              to={`/community/breed/${post.breed}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {post.breed}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;