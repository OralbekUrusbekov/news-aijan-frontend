'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const { t } = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? t('auth_failed') : t('common_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center text-white font-display font-extrabold text-2xl mb-4">А</span>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">{t('auth_login_title')}</h1>
            <p className="text-slate-400 text-sm mt-1">{t('auth_login_subtitle')}</p>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('auth_email')}</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('auth_password')}</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
              />
            </div>
            <button disabled={loading} className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-600/20">
              {t('auth_login_button')}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            {t('auth_no_account')}{' '}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">{t('auth_register_link')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
