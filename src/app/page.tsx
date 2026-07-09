'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { HomeData } from '@/lib/types';
import NewsCard from '@/components/NewsCard';

function SectionHeading({ title, href, accent }: { title: string; href?: string; accent?: string }) {
  const { t } = useLocale();
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-display text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
        <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent || '#1d4ed8' }} />
        {title}
      </h2>
      {href && (
        <Link href={href} className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition flex items-center gap-1">
          {t('news_view_all')} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-80 rounded-2xl skeleton" />
        <div className="grid grid-rows-2 gap-4">
          <div className="rounded-2xl skeleton" />
          <div className="rounded-2xl skeleton" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 rounded-2xl skeleton" />)}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { locale, t } = useLocale();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get<HomeData>('/home/').then(setData).finally(() => setLoading(false));
  }, [locale]);

  if (loading || !data) return <HomeSkeleton />;

  return (
    <div>
      {data.breaking_news.length > 0 && (
        <div className="bg-red-600 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 h-11 flex items-center gap-4">
            <span className="font-display font-extrabold shrink-0 text-xs tracking-wider bg-white/15 px-2.5 py-1 rounded">
              {t('news_breaking')}
            </span>
            <div className="overflow-hidden flex-1">
              <div className="flex gap-10 whitespace-nowrap animate-marquee w-max">
                {[...data.breaking_news, ...data.breaking_news].map((n, i) => (
                  <Link key={`${n.id}-${i}`} href={`/news/${n.slug}`} className="text-sm font-medium hover:underline">
                    {n.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">
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

        <section>
          <SectionHeading title={t('news_latest')} href="/news" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.latest_news.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            {data.categories.map((cat) => {
              const items = data.category_news[cat.slug] || [];
              if (items.length === 0) return null;
              return (
                <section key={cat.id}>
                  <SectionHeading
                    title={cat[`name_${locale}` as const]}
                    href={`/category/${cat.slug}`}
                    accent={cat.color}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {items.map((n) => <NewsCard key={n.id} news={n} />)}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h2 className="font-display text-xl font-extrabold text-slate-900 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-6 rounded-full bg-orange-500" />
                {t('news_popular')}
              </h2>
              <div className="space-y-5">
                {data.popular_news.map((n, i) => <NewsCard key={n.id} news={n} size="small" rank={i + 1} />)}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white">
              <h3 className="font-display text-lg font-extrabold mb-2">{t('site_name')}</h3>
              <p className="text-sm text-blue-100 leading-relaxed">{t('site_tagline')} — {t('news_all_news').toLowerCase()}.</p>
              <Link href="/news" className="inline-block mt-4 bg-white text-blue-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-50 transition">
                {t('news_view_all')}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
