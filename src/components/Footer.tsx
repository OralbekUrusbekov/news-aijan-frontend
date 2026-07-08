'use client';

import Link from 'next/link';
import { useLocale } from '@/lib/i18n/LocaleContext';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="text-xl font-bold text-white mb-2">{t('site_name')}</div>
          <p className="text-gray-400">{t('site_tagline')}</p>
        </div>
        <div>
          <div className="font-semibold text-white mb-2">{t('footer_quick_links')}</div>
          <div className="flex flex-col gap-1">
            <Link href="/" className="hover:text-white">{t('nav_home')}</Link>
            <Link href="/news" className="hover:text-white">{t('news_all_news')}</Link>
          </div>
        </div>
        <div>
          <div className="font-semibold text-white mb-2">{t('footer_contact')}</div>
          <p className="text-gray-400">{t('footer_address')}</p>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} {t('site_name')}. {t('footer_rights')}
      </div>
    </footer>
  );
}
