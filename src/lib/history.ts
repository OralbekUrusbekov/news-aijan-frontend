import { NewsItem } from '@/lib/types';

export type HistoryEntry = Pick<NewsItem, 'id' | 'slug' | 'title' | 'image_url' | 'category' | 'published_at' | 'views' | 'likes'> & {
  viewed_at: string;
};

const STORAGE_KEY = 'news_history';
const MAX_ITEMS = 20;

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function addToHistory(news: NewsItem) {
  if (typeof window === 'undefined') return;
  const existing = getHistory().filter((entry) => entry.slug !== news.slug);
  const next: HistoryEntry[] = [
    {
      id: news.id,
      slug: news.slug,
      title: news.title,
      image_url: news.image_url,
      category: news.category,
      published_at: news.published_at,
      views: news.views,
      likes: news.likes,
      viewed_at: new Date().toISOString(),
    },
    ...existing,
  ].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('news-history-updated'));
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('news-history-updated'));
}
