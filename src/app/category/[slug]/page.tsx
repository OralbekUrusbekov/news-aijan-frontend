'use client';

import { use, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Category } from '@/lib/types';
import InfiniteNewsList from '@/components/InfiniteNewsList';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { locale } = useLocale();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    api.get<Category>(`/categories/${slug}/`).then(setCategory).catch(() => setCategory(null));
  }, [slug, locale]);

  return (
    <div>
      {category && (
        <div className="border-b border-slate-100" style={{ background: `linear-gradient(135deg, ${category.color}14, transparent)` }}>
          <div className="max-w-7xl mx-auto px-4 py-12 flex items-center gap-4">
            <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">{category[`name_${locale}` as const]}</h1>
              {category[`description_${locale}` as const] && (
                <p className="text-slate-500 mt-2">{category[`description_${locale}` as const]}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10">
        <InfiniteNewsList key={`${locale}-${slug}`} params={{ category: slug }} />
      </div>
    </div>
  );
}
