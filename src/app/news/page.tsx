'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Category, NewsItem, Paginated } from '@/lib/types';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';

function NewsListContent() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const ordering = searchParams.get('ordering') || '';
  const page = Number(searchParams.get('page') || 1);

  const [searchInput, setSearchInput] = useState(search);
  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<Paginated<NewsItem> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ results: Category[] }>('/categories/').then((d) => setCategories(d.results)).catch(() => {});
  }, [locale]);

  useEffect(() => {
    setLoading(true);
    api.get<Paginated<NewsItem>>('/news/', { params: { search, category, ordering, page } })
      .then(setData)
      .finally(() => setLoading(false));
  }, [locale, search, category, ordering, page]);

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!('page' in updates)) next.delete('page');
    router.push(`/news?${next.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('news_all_news')}</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form
          className="flex flex-1"
          onSubmit={(e) => { e.preventDefault(); updateParams({ search: searchInput }); }}
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('common_search')}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 rounded-r-lg text-sm hover:bg-blue-700">{t('common_search')}</button>
        </form>

        <select
          value={category}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">{t('news_all')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c[`name_${locale}` as const]}</option>
          ))}
        </select>

        <select
          value={ordering}
          onChange={(e) => updateParams({ ordering: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">{t('news_sort_latest')}</option>
          <option value="popular">{t('news_sort_popular')}</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-16">{t('common_loading')}</div>
      ) : !data || data.results.length === 0 ? (
        <div className="text-center text-gray-500 py-16">{t('news_no_news')}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.results.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
          <Pagination
            page={page}
            hasNext={Boolean(data.next)}
            hasPrevious={Boolean(data.previous)}
            onChange={(p) => updateParams({ page: String(p) })}
          />
        </>
      )}
    </div>
  );
}

export default function NewsListPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">…</div>}>
      <NewsListContent />
    </Suspense>
  );
}
