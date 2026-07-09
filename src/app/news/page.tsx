'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Category } from '@/lib/types';
import InfiniteNewsList from '@/components/InfiniteNewsList';

function NewsListContent() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const ordering = searchParams.get('ordering') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get<{ results: Category[] }>('/categories/').then((d) => setCategories(d.results)).catch(() => {});
  }, [locale]);

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    router.push(`/news?${next.toString()}`);
  };

  const params = { search, category, ordering };
  const listKey = `${locale}-${search}-${category}-${ordering}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-8 text-slate-900">{t('news_all_news')}</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-10 bg-slate-50 border border-slate-100 rounded-2xl p-3">
        <form
          className="flex flex-1"
          onSubmit={(e) => { e.preventDefault(); updateParams({ search: searchInput }); }}
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('common_search')}
            className="flex-1 bg-white border border-slate-200 rounded-l-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
          <button className="bg-blue-600 text-white px-5 rounded-r-xl text-sm font-semibold hover:bg-blue-700 transition">{t('common_search')}</button>
        </form>

        <select
          value={category}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700"
        >
          <option value="">{t('news_all')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c[`name_${locale}` as const]}</option>
          ))}
        </select>

        <select
          value={ordering}
          onChange={(e) => updateParams({ ordering: e.target.value })}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700"
        >
          <option value="">{t('news_sort_latest')}</option>
          <option value="popular">{t('news_sort_popular')}</option>
        </select>
      </div>

      <InfiniteNewsList key={listKey} params={params} />
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
