import React from 'react';
import { User, Trash2 } from 'lucide-react';
import { Comment } from '../types';
import { useAuth } from '../../auth/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface CommentListProps {
  comments: Comment[];
  onDelete: (commentId: string) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onDelete }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3">
          {comment.user?.avatar_url ? (
            <img
              src={comment.user.avatar_url}
              alt={comment.user.display_name || ''}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.user?.display_name || 'Anonymous'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;