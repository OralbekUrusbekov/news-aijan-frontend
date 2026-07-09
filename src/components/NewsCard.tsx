'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { NewsItem } from '@/lib/types';
import { formatDate } from '@/lib/i18n/date';

export default function NewsCard({ news, size = 'normal', rank }: { news: NewsItem; size?: 'normal' | 'large' | 'small'; rank?: number }) {
  const { locale, t } = useLocale();

  if (size === 'large') {
    return (
      <Link href={`/news/${news.slug}`} className="group relative block rounded-2xl overflow-hidden h-full min-h-[320px] ring-1 ring-slate-900/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={news.image_url} alt={news.title} className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
        <div className="absolute bottom-0 p-5 text-white">
          <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 tracking-wide" style={{ backgroundColor: news.category.color }}>
            {news.category[`name_${locale}` as const]}
          </span>
          <h3 className="font-display text-xl font-bold leading-snug mb-1.5 group-hover:underline decoration-2 underline-offset-2">{news.title}</h3>
          <p className="text-xs text-slate-300">
            {formatDate(news.published_at, locale)} · {news.views} {t('news_views')}
            {news.source_name && <> · <span className="text-slate-200">{news.source_name}</span></>}
          </p>
        </div>
      </Link>
    );
  }

  if (size === 'small') {
    return (
      <Link href={`/news/${news.slug}`} className="flex gap-3 group items-start">
        {rank ? (
          <span className="font-display text-2xl font-extrabold text-slate-200 w-7 shrink-0 leading-none group-hover:text-blue-600 transition">
            {rank}
          </span>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={news.image_url} alt={news.title} className="w-20 h-16 object-cover rounded-lg shrink-0" />
        )}
        <div>
          <h4 className="text-sm font-semibold leading-snug group-hover:text-blue-600 transition line-clamp-2">{news.title}</h4>
          <p className="text-xs text-slate-400 mt-1.5">
            {formatDate(news.published_at, locale)} · {news.views} {t('news_views')}
            {news.source_name && <> · {news.source_name}</>}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${news.slug}`} className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-300">
      <div className="aspect-[16/10] overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={news.image_url} alt={news.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
        <span
          className="absolute top-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-full shadow-sm"
          style={{ backgroundColor: news.category.color }}
        >
          {news.category[`name_${locale}` as const]}
        </span>
        {news.source_name && (
          <span className="absolute top-3 right-3 text-[11px] font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
            {news.source_name}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold leading-snug mb-2 group-hover:text-blue-600 transition line-clamp-2">{news.title}</h3>
        {news.excerpt && <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{news.excerpt}</p>}
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
          <span>{formatDate(news.published_at, locale)}</span>
          <span className="flex items-center gap-1">👁 {news.views}</span>
          <span className="flex items-center gap-1">👍 {news.likes}</span>
        </div>
      </div>
    </Link>
  );
}
