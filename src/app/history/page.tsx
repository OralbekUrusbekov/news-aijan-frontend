'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useHistory } from '@/lib/useHistory';
import { clearHistory } from '@/lib/history';
import { formatDate } from '@/lib/i18n/date';

export default function HistoryPage() {
  const { locale, t } = useLocale();
  const history = useHistory();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">{t('common_history')}</h1>
        {history.length > 0 && (
          <button onClick={clearHistory} className="text-sm font-semibold text-red-600 hover:underline">
            {t('common_clear')}
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center text-slate-400 py-24">{t('common_empty_history')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {history.map((entry) => (
            <Link
              key={entry.slug}
              href={`/news/${entry.slug}`}
              className="flex gap-4 bg-white border border-slate-200 rounded-2xl p-3 hover:shadow-lg hover:shadow-slate-200/60 transition group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={entry.image_url} alt={entry.title} className="w-24 h-20 object-cover rounded-xl shrink-0" />
              <div className="min-w-0">
                <span
                  className="inline-block text-[11px] font-bold text-white px-2 py-0.5 rounded-full mb-1.5"
                  style={{ backgroundColor: entry.category.color }}
                >
                  {entry.category[`name_${locale}` as const]}
                </span>
                <h3 className="text-sm font-semibold leading-snug group-hover:text-blue-600 transition line-clamp-2">{entry.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5">{formatDate(entry.published_at, locale)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
