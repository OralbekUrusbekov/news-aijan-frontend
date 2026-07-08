'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { NewsItem } from '@/lib/types';

function formatDate(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale === 'kk' ? 'kk-KZ' : locale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function NewsCard({ news, size = 'normal' }: { news: NewsItem; size?: 'normal' | 'large' | 'small' }) {
  const { locale, t } = useLocale();

  if (size === 'large') {
    return (
      <Link href={`/news/${news.slug}`} className="group relative block rounded-xl overflow-hidden h-full min-h-[320px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={news.image_url} alt={news.title} className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-5 text-white">
          <span className="inline-block text-xs font-semibold px-2 py-1 rounded mb-2" style={{ backgroundColor: news.category.color }}>
            {news.category[`name_${locale}` as const]}
          </span>
          <h3 className="text-xl font-bold leading-snug mb-1">{news.title}</h3>
          <p className="text-xs text-gray-300">{formatDate(news.published_at, locale)} · {news.views} {t('news_views')}</p>
        </div>
      </Link>
    );
  }

  if (size === 'small') {
    return (
      <Link href={`/news/${news.slug}`} className="flex gap-3 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={news.image_url} alt={news.title} className="w-20 h-16 object-cover rounded-lg shrink-0" />
        <div>
          <h4 className="text-sm font-semibold leading-snug group-hover:text-blue-600 line-clamp-2">{news.title}</h4>
          <p className="text-xs text-gray-500 mt-1">{formatDate(news.published_at, locale)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${news.slug}`} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
      <div className="aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={news.image_url} alt={news.title} className="w-full h-full object-cover transition group-hover:scale-105" />
      </div>
      <div className="p-4">
        <span className="inline-block text-xs font-semibold text-white px-2 py-0.5 rounded mb-2" style={{ backgroundColor: news.category.color }}>
          {news.category[`name_${locale}` as const]}
        </span>
        <h3 className="font-bold leading-snug mb-1 group-hover:text-blue-600 line-clamp-2">{news.title}</h3>
        {news.excerpt && <p className="text-sm text-gray-500 line-clamp-2">{news.excerpt}</p>}
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
          <span>{formatDate(news.published_at, locale)}</span>
          <span>· {news.views} {t('news_views')}</span>
        </div>
      </div>
    </Link>
  );
}
