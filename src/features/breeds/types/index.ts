export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  breed_id: string;
  category: 'article' | 'blog';
  read_time: string;
  created_at: string;
  author_profile_id: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

export interface ArticleFilters {
  category?: 'article' | 'blog';
  searchQuery?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  breed_id: string;
  category: string;
  author_profile_id: string;
  author: {
    display_name: string;
    avatar_url: string;
  } | null;
  created_at: string;
}