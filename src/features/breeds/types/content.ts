export interface Article {
  id: string;
  breed_id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  read_time: string;
  category: 'article' | 'blog';
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