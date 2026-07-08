export interface Category {
  id: number;
  slug: string;
  name_kk: string;
  name_ru: string;
  name_en: string;
  description_kk: string | null;
  description_ru: string | null;
  description_en: string | null;
  color: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  news_count?: number;
}

export interface Author {
  id: number;
  name: string;
  avatar_url: string;
}

export interface NewsItem {
  id: number;
  slug: string;
  category: Category;
  author: Author;
  title: string;
  title_kk: string;
  title_ru: string;
  title_en: string;
  excerpt: string;
  excerpt_kk: string | null;
  excerpt_ru: string | null;
  excerpt_en: string | null;
  image_url: string;
  video_type: string | null;
  views: number;
  likes: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export interface CommentUser {
  id: number;
  name: string;
  avatar_url: string;
}

export interface CommentItem {
  id: number;
  content: string;
  likes: number;
  is_liked: boolean;
  created_at: string;
  user: CommentUser;
  parent_id: number | null;
  replies?: CommentItem[];
}

export interface NewsDetail extends NewsItem {
  content: string;
  content_kk: string;
  content_ru: string;
  content_en: string;
  video_url: string | null;
  video_embed_url: string | null;
  reading_time: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  source_url: string | null;
  source_name: string | null;
  is_liked: boolean;
  is_bookmarked: boolean;
  comments: CommentItem[];
  related_news: NewsItem[];
}

export interface HomeData {
  featured_news: NewsItem[];
  latest_news: NewsItem[];
  breaking_news: NewsItem[];
  popular_news: NewsItem[];
  categories: Category[];
  category_news: Record<string, NewsItem[]>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  birth_date: string | null;
  gender: string | null;
  avatar: string | null;
  avatar_url: string;
  bio: string | null;
  role: 'user' | 'author' | 'admin';
  locale: 'kk' | 'ru' | 'en';
  is_active: boolean;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
