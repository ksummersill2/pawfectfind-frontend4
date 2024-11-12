export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  breed: string | null;
  likes: number;
  created_at: string;
  updated_at: string;
  user?: {
    display_name: string | null;
    avatar_url: string | null;
  };
  comments?: {
    count: number;
  }[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
  breed?: string | null;
}