'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Category, NewsItem, Paginated } from '@/lib/types';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { locale, t } = useLocale();
  const [category, setCategory] = useState<Category | null>(null);
  const [data, setData] = useState<Paginated<NewsItem> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Category>(`/categories/${slug}/`).then(setCategory).catch(() => setCategory(null));
  }, [slug, locale]);

  useEffect(() => {
    setLoading(true);
    api.get<Paginated<NewsItem>>('/news/', { params: { category: slug, page } })
      .then(setData)
      .finally(() => setLoading(false));
  }, [slug, locale, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {category && (
        <div className="mb-8 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
          <div>
            <h1 className="text-3xl font-bold">{category[`name_${locale}` as const]}</h1>
            {category[`description_${locale}` as const] && (
              <p className="text-gray-500 mt-1">{category[`description_${locale}` as const]}</p>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-16">{t('common_loading')}</div>
      ) : !data || data.results.length === 0 ? (
        <div className="text-center text-gray-500 py-16">{t('news_no_news')}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.results.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
          <Pagination page={page} hasNext={Boolean(data.next)} hasPrevious={Boolean(data.previous)} onChange={setPage} />
        </>
      )}
    </div>
  );
}
