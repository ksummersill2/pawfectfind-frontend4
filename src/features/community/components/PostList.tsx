import React from 'react';
import PostCard from './PostCard';
import { Post } from '../types';

interface PostListProps {
  posts: Post[];
  onDelete?: (postId: string) => Promise<void>;
  onEdit?: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onDelete, onEdit }) => {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default PostList;