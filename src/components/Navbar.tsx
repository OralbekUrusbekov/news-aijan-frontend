'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { LOCALES, LOCALE_LABELS } from '@/lib/i18n/dictionaries';
import { api } from '@/lib/api';
import { Category } from '@/lib/types';
import { formatTopDate } from '@/lib/i18n/date';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    api.get<{ results: Category[] }>('/categories/').then((data) => setCategories(data.results)).catch(() => {});
  }, [locale]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/news?search=${encodeURIComponent(search)}`);
    setSearchOpen(false);
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden sm:block bg-slate-950 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
          <span className="capitalize">{mounted ? formatTopDate(locale) : ' '}</span>
          <div className="flex items-center gap-5">
            <div className="flex gap-1">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-2 py-0.5 rounded transition ${locale === l ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {LOCALE_LABELS[l]}
                </button>
              ))}
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <a href="http://127.0.0.1:8001/admin/" target="_blank" rel="noreferrer" className="hover:text-white">
                    {t('nav_admin')}
                  </a>
                )}
                <Link href="/profile" className="hover:text-white">{user.name}</Link>
                <button onClick={() => logout()} className="hover:text-red-400">{t('nav_logout')}</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hover:text-white">{t('nav_login')}</Link>
                <Link href="/register" className="hover:text-white">{t('nav_register')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className={`border-b border-slate-100 transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-display font-extrabold text-lg">
              А
            </span>
            <div className="leading-tight">
              <div className="font-display text-2xl font-extrabold tracking-tight text-slate-900">{t('site_name')}</div>
              <div className="hidden sm:block text-[11px] uppercase tracking-widest text-slate-400 font-medium">{t('site_tagline')}</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 font-display text-[15px] font-semibold text-slate-700">
            <Link href="/" className="hover:text-blue-600 transition">{t('nav_home')}</Link>
            <Link href="/news" className="hover:text-blue-600 transition">{t('news_all_news')}</Link>
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/history"
              className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
              aria-label={t('common_history')}
              title={t('common_history')}
            >
              🕐
            </Link>

            <div className="relative hidden sm:block">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onBlur={() => !search && setSearchOpen(false)}
                    placeholder={t('nav_search_placeholder')}
                    className="w-64 border border-slate-300 rounded-full pl-4 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                  <button type="submit" className="-ml-8 text-slate-400 hover:text-blue-600">🔍</button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                  aria-label={t('common_search')}
                >
                  🔍
                </button>
              )}
            </div>

            {!user && (
              <Link href="/register" className="hidden sm:inline-flex bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition shadow-sm shadow-blue-600/20">
                {t('nav_register')}
              </Link>
            )}

            <button
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="hidden lg:block border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                {c[`name_${locale}` as const]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden border-b border-slate-100 bg-white px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('nav_search_placeholder')}
              className="flex-1 border border-slate-300 rounded-l-full px-4 py-2 text-sm"
            />
            <button className="bg-blue-600 text-white rounded-r-full px-4 text-sm">🔍</button>
          </form>

          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700">
            <Link href="/" onClick={() => setMenuOpen(false)}>{t('nav_home')}</Link>
            <Link href="/news" onClick={() => setMenuOpen(false)}>{t('news_all_news')}</Link>
            <Link href="/history" onClick={() => setMenuOpen(false)}>{t('common_history')}</Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                {c[`name_${locale}` as const]}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-1 rounded text-xs font-medium ${locale === l ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {LOCALE_LABELS[l]}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 text-sm font-medium">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <a href="http://127.0.0.1:8001/admin/" target="_blank" rel="noreferrer" className="text-slate-600">{t('nav_admin')}</a>
                )}
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-slate-600">{user.name}</Link>
                <button onClick={() => logout()} className="text-left text-red-600">{t('nav_logout')}</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-slate-600">{t('nav_login')}</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-blue-600">{t('nav_register')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
