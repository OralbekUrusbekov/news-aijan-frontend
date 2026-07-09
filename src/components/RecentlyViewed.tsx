'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useHistory } from '@/lib/useHistory';
import { formatDate } from '@/lib/i18n/date';

export default function RecentlyViewed({ excludeSlug, limit = 5 }: { excludeSlug?: string; limit?: number }) {
  const { locale, t } = useLocale();
  const history = useHistory().filter((entry) => entry.slug !== excludeSlug).slice(0, limit);

  if (history.length === 0) return null;

  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-emerald-500" />
          {t('common_history')}
        </h2>
        <Link href="/history" className="text-xs font-semibold text-blue-600 hover:underline">{t('news_view_all')}</Link>
      </div>
      <div className="space-y-4">
        {history.map((entry) => (
          <Link key={entry.slug} href={`/news/${entry.slug}`} className="flex gap-3 group items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={entry.image_url} alt={entry.title} className="w-16 h-14 object-cover rounded-lg shrink-0" />
            <div className="min-w-0">
              <h4 className="text-sm font-semibold leading-snug group-hover:text-blue-600 transition line-clamp-2">{entry.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{formatDate(entry.published_at, locale)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
