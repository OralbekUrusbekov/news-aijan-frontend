'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { NewsDetail } from '@/lib/types';
import NewsCard from '@/components/NewsCard';
import CommentSection from '@/components/CommentSection';

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { locale, t } = useLocale();
  const { user } = useAuth();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get<NewsDetail>(`/news/${slug}/`, { auth: Boolean(user) })
      .then(setNews)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, locale]);

  const toggleLike = async () => {
    if (!user || !news) return;
    const res = await api.post<{ liked: boolean; likes: number }>(`/news/${slug}/like/`, undefined, { auth: true });
    setNews({ ...news, is_liked: res.liked, likes: res.likes });
  };

  const toggleBookmark = async () => {
    if (!user || !news) return;
    const res = await api.post<{ bookmarked: boolean }>(`/news/${slug}/bookmark/`, undefined, { auth: true });
    setNews({ ...news, is_bookmarked: res.bookmarked });
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">{t('common_loading')}</div>;
  if (notFound || !news) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">404</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href={`/category/${news.category.slug}`} className="inline-block text-xs font-semibold text-white px-3 py-1 rounded-full mb-4"
        style={{ backgroundColor: news.category.color }}>
        {news.category[`name_${locale}` as const]}
      </Link>

      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">{news.title}</h1>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-6">
        <span className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={news.author.avatar_url} alt={news.author.name} className="w-6 h-6 rounded-full" />
          {news.author.name}
        </span>
        <span>· {new Date(news.published_at).toLocaleDateString(locale === 'kk' ? 'kk-KZ' : locale === 'ru' ? 'ru-RU' : 'en-US')}</span>
        <span>· {news.views} {t('news_views')}</span>
        <span>· {news.reading_time} {t('news_min_read')}</span>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={news.image_url} alt={news.title} className="w-full aspect-video object-cover rounded-xl mb-6" />

      {news.video_embed_url && (
        <div className="aspect-video mb-6">
          <iframe src={news.video_embed_url} className="w-full h-full rounded-xl" allowFullScreen />
        </div>
      )}

      <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: news.content }} />

      <div className="flex items-center gap-3 border-t border-b border-gray-100 py-4 mb-8">
        <button
          onClick={toggleLike}
          disabled={!user}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${news.is_liked ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          👍 {t('news_like')} ({news.likes})
        </button>
        <button
          onClick={toggleBookmark}
          disabled={!user}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${news.is_bookmarked ? 'bg-yellow-500 text-white border-yellow-500' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          🔖 {news.is_bookmarked ? t('news_bookmarked') : t('news_bookmark')}
        </button>
      </div>

      <CommentSection newsSlug={news.slug} initialComments={news.comments} />

      {news.related_news.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">{t('news_related')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {news.related_news.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
        </section>
      )}
    </div>
  );
}
