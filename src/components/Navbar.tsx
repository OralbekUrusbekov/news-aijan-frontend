'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n/dictionaries';
import { api } from '@/lib/api';
import { Category } from '@/lib/types';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.get<{ results: Category[] }>('/categories/').then((data) => setCategories(data.results)).catch(() => {});
  }, [locale]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/news?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-extrabold text-blue-600">{t('site_name')}</span>
            <span className="hidden sm:inline text-xs text-gray-500">{t('site_tagline')}</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-gray-700">
            <Link href="/" className="hover:text-blue-600">{t('nav_home')}</Link>
            <Link href="/news" className="hover:text-blue-600">{t('news_all_news')}</Link>
            {categories.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} className="hover:text-blue-600">
                {c[`name_${locale}` as const]}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('nav_search_placeholder')}
              className="w-full border border-gray-300 rounded-l-full px-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white rounded-r-full px-3 text-sm hover:bg-blue-700">🔍</button>
          </form>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex gap-1">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-1.5 py-0.5 rounded ${locale === l ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {LOCALE_LABELS[l]}
                </button>
              ))}
            </div>

            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                {user.role === 'admin' && (
                  <a href="http://127.0.0.1:8001/admin/" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-blue-600">
                    {t('nav_admin')}
                  </a>
                )}
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">{user.name}</Link>
                <button onClick={() => logout()} className="text-gray-500 hover:text-red-600">{t('nav_logout')}</button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login" className="text-gray-700 hover:text-blue-600">{t('nav_login')}</Link>
                <Link href="/register" className="bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700">
                  {t('nav_register')}
                </Link>
              </div>
            )}

            <button className="lg:hidden text-xl" onClick={() => setMenuOpen((v) => !v)}>☰</button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden pb-4 flex flex-col gap-2 text-sm">
            <Link href="/" onClick={() => setMenuOpen(false)}>{t('nav_home')}</Link>
            <Link href="/news" onClick={() => setMenuOpen(false)}>{t('news_all_news')}</Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} onClick={() => setMenuOpen(false)}>
                {c[`name_${locale}` as const]}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>{user.name}</Link>
                <button className="text-left text-red-600" onClick={() => logout()}>{t('nav_logout')}</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>{t('nav_login')}</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>{t('nav_register')}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
