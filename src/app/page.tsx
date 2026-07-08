'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { HomeData } from '@/lib/types';
import NewsCard from '@/components/NewsCard';

export default function HomePage() {
  const { locale, t } = useLocale();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get<HomeData>('/home/').then(setData).finally(() => setLoading(false));
  }, [locale]);

  if (loading || !data) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">{t('common_loading')}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-14">
      {data.featured_news.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <NewsCard news={data.featured_news[0]} size="large" />
            </div>
            <div className="grid grid-rows-2 gap-4">
              {data.featured_news.slice(1, 3).map((n) => (
                <NewsCard key={n.id} news={n} size="large" />
              ))}
            </div>
          </div>
        </section>
      )}

      {data.breaking_news.length > 0 && (
        <section className="bg-red-600 text-white rounded-xl px-4 py-3 flex items-center gap-4 overflow-x-auto">
          <span className="font-bold shrink-0 bg-white/20 px-2 py-1 rounded text-xs">{t('news_breaking')}</span>
          <div className="flex gap-6 text-sm whitespace-nowrap">
            {data.breaking_news.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`} className="hover:underline">{n.title}</Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t('news_latest')}</h2>
          <Link href="/news" className="text-blue-600 text-sm font-medium hover:underline">{t('news_view_all')} →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.latest_news.map((n) => <NewsCard key={n.id} news={n} />)}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {data.categories.map((cat) => {
            const items = data.category_news[cat.slug] || [];
            if (items.length === 0) return null;
            return (
              <section key={cat.id}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat[`name_${locale}` as const]}
                  </h2>
                  <Link href={`/category/${cat.slug}`} className="text-blue-600 text-sm font-medium hover:underline">
                    {t('news_view_all')} →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((n) => <NewsCard key={n.id} news={n} />)}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="space-y-4">
          <h2 className="text-xl font-bold">{t('news_popular')}</h2>
          <div className="space-y-4">
            {data.popular_news.map((n) => <NewsCard key={n.id} news={n} size="small" />)}
          </div>
        </aside>
      </div>
    </div>
  );
}
