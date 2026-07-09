'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { api } from '@/lib/api';
import { Category } from '@/lib/types';

export default function Footer() {
  const { locale, t } = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get<{ results: Category[] }>('/categories/').then((d) => setCategories(d.results)).catch(() => {});
  }, [locale]);

  return (
    <footer className="bg-slate-950 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 sm:grid-cols-4 gap-10 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-display font-extrabold">А</span>
            <span className="font-display text-xl font-extrabold text-white">{t('site_name')}</span>
          </div>
          <p className="text-slate-400 leading-relaxed">{t('site_tagline')}</p>
          <div className="flex gap-3 mt-4">
            {['Facebook', 'Instagram', 'Telegram', 'YouTube'].map((s) => (
              <span key={s} className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs hover:bg-blue-600 hover:text-white transition cursor-pointer" title={s}>
                {s[0]}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="font-display font-bold text-white mb-3">{t('footer_quick_links')}</div>
          <div className="flex flex-col gap-2">
            <Link href="/" className="hover:text-white transition">{t('nav_home')}</Link>
            <Link href="/news" className="hover:text-white transition">{t('news_all_news')}</Link>
            <Link href="/register" className="hover:text-white transition">{t('nav_register')}</Link>
            <Link href="/login" className="hover:text-white transition">{t('nav_login')}</Link>
          </div>
        </div>

        <div>
          <div className="font-display font-bold text-white mb-3">{t('nav_categories')}</div>
          <div className="flex flex-col gap-2">
            {categories.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="hover:text-white transition">
                {c[`name_${locale}` as const]}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="font-display font-bold text-white mb-3">{t('footer_contact')}</div>
          <p className="leading-relaxed">{t('footer_address')}</p>
          <p className="mt-2">info@newsportal.kz</p>
          <p>+7 (700) 000-00-00</p>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {t('site_name')}. {t('footer_rights')}</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition">{t('footer_privacy') || 'Құпиялылық'}</span>
            <span className="hover:text-white cursor-pointer transition">{t('footer_terms') || 'Ережелер'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
