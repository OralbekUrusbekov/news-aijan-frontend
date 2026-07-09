'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { NewsDetail } from '@/lib/types';
import NewsCard from '@/components/NewsCard';
import CommentSection from '@/components/CommentSection';
import RecentlyViewed from '@/components/RecentlyViewed';
import { formatDate } from '@/lib/i18n/date';
import { addToHistory } from '@/lib/history';

function NewsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      <div className="h-5 w-24 rounded-full skeleton" />
      <div className="h-10 rounded-lg w-full skeleton" />
      <div className="h-10 rounded-lg w-2/3 skeleton" />
      <div className="h-96 rounded-2xl mt-6 skeleton" />
    </div>
  );
}

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { locale, t } = useLocale();
  const { user } = useAuth();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get<NewsDetail>(`/news/${slug}/`, { auth: Boolean(user) })
      .then((data) => {
        setNews(data);
        addToHistory(data);
      })
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

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (loading) return <NewsSkeleton />;
  if (notFound || !news) return <div className="max-w-4xl mx-auto px-4 py-24 text-center text-slate-400">404</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-blue-600">{t('nav_home')}</Link>
            <span>/</span>
            <Link href={`/category/${news.category.slug}`} className="hover:text-blue-600">{news.category[`name_${locale}` as const]}</Link>
          </div>

          <Link href={`/category/${news.category.slug}`} className="inline-block text-xs font-bold text-white px-3 py-1.5 rounded-full mb-4 tracking-wide"
            style={{ backgroundColor: news.category.color }}>
            {news.category[`name_${locale}` as const]}
          </Link>

          <h1 className="font-display text-3xl md:text-[2.6rem] font-extrabold leading-[1.15] mb-4 text-slate-900">{news.title}</h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={news.author.avatar_url} alt={news.author.name} className="w-8 h-8 rounded-full ring-2 ring-slate-100" />
              {news.author.name}
            </span>
            <span>{formatDate(news.published_at, locale)}</span>
            <span className="flex items-center gap-1">👁 {news.views} {t('news_views')}</span>
            <span className="flex items-center gap-1">📖 {news.reading_time} {t('news_min_read')}</span>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={news.image_url} alt={news.title} className="w-full aspect-video object-cover rounded-2xl mb-8 shadow-sm" />

          {news.video_embed_url && (
            <div className="aspect-video mb-8 rounded-2xl overflow-hidden shadow-sm">
              <iframe src={news.video_embed_url} className="w-full h-full" allowFullScreen />
            </div>
          )}

          <div className="prose max-w-none mb-8 text-[17px]" dangerouslySetInnerHTML={{ __html: news.content }} />

          {news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {news.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-full px-3 py-1.5 transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-b border-slate-100 py-5 mb-10">
            <button
              onClick={toggleLike}
              disabled={!user}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition disabled:opacity-40 ${news.is_liked ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
            >
              👍 {t('news_like')} ({news.likes})
            </button>
            <button
              onClick={toggleBookmark}
              disabled={!user}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition disabled:opacity-40 ${news.is_bookmarked ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
            >
              🔖 {news.is_bookmarked ? t('news_bookmarked') : t('news_bookmark')}
            </button>
            <button
              onClick={share}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              🔗 {copied ? '✓' : t('news_share')}
            </button>
          </div>

          {news.source_name && (
            <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 mb-10">
              <div className="text-sm">
                <span className="text-slate-400">{t('news_source')}: </span>
                <span className="font-semibold text-slate-800">{news.source_name}</span>
              </div>
              {news.source_url && (
                <a
                  href={news.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                >
                  {t('news_view_original')} <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          )}

          <CommentSection newsSlug={news.slug} initialComments={news.comments} />

          {news.related_news.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display text-xl font-extrabold mb-5 text-slate-900 flex items-center gap-2.5">
                <span className="w-1.5 h-6 rounded-full bg-blue-600" />
                {t('news_related')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {news.related_news.map((n) => <NewsCard key={n.id} news={n} />)}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <RecentlyViewed excludeSlug={news.slug} />
        </aside>
      </div>
    </div>
  );
}
