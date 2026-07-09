'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Tag } from '@/lib/types';
import InfiniteNewsList from '@/components/InfiniteNewsList';

export default function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { locale } = useLocale();
  const [tag, setTag] = useState<Tag | null>(null);

  useEffect(() => {
    api.get<Tag>(`/tags/${slug}/`).then(setTag).catch(() => setTag(null));
  }, [slug, locale]);

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Tag</span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            #{tag ? tag[`name_${locale}` as const] : slug}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <InfiniteNewsList key={`${locale}-${slug}`} params={{ tag: slug }} />
      </div>
    </div>
  );
}
