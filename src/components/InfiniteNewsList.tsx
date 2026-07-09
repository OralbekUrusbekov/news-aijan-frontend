'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { NewsItem, Paginated } from '@/lib/types';
import NewsCard from '@/components/NewsCard';
import { useInfiniteScrollSentinel } from '@/lib/useInfiniteScrollSentinel';

function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => <div key={i} className="h-72 rounded-2xl skeleton" />)}
    </div>
  );
}

/**
 * Renders a news grid that loads more pages automatically as the user scrolls.
 * Pass a `key` from the parent that changes whenever `params` changes, so the
 * component remounts (and its internal paging state resets) instead of racing
 * stale in-flight requests against new filters.
 */
export default function InfiniteNewsList({ params }: { params: Record<string, string | number | undefined> }) {
  const { t } = useLocale();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    api.get<Paginated<NewsItem>>('/news/', { params: { ...params, page } })
      .then((data) => {
        if (ignore) return;
        setItems((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setHasMore(Boolean(data.next));
        setCount(data.count);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const sentinelRef = useInfiniteScrollSentinel(() => {
    if (hasMore && !loading) setPage((p) => p + 1);
  }, hasMore);

  if (loading && items.length === 0) {
    return <SkeletonGrid count={6} />;
  }

  if (items.length === 0) {
    return <div className="text-center text-slate-400 py-24">{t('news_no_news')}</div>;
  }

  return (
    <div>
      <p className="text-sm text-slate-400 mb-5">{count} {t('news_all_news').toLowerCase()}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((n) => <NewsCard key={n.id} news={n} />)}
      </div>

      {loading && (
        <div className="mt-6">
          <SkeletonGrid count={3} />
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />

      {!hasMore && (
        <p className="text-center text-sm text-slate-400 mt-10">{t('common_end_of_list')}</p>
      )}
    </div>
  );
}
