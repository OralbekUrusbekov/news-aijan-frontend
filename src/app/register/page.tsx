'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { ApiError } from '@/lib/api';

export default function RegisterPage() {
  const { t } = useLocale();
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      router.push('/');
    } catch (err) {
      if (err instanceof ApiError && err.data && typeof err.data === 'object') {
        const first = Object.values(err.data as Record<string, string[]>)[0];
        setError(Array.isArray(first) ? first[0] : t('common_error'));
      } else {
        setError(t('common_error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition';
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5';

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-8">
            <span className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center text-white font-display font-extrabold text-2xl mb-4">А</span>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">{t('auth_register_title')}</h1>
            <p className="text-slate-400 text-sm mt-1">{t('auth_register_subtitle')}</p>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>{t('auth_name')}</label>
              <input required value={form.name} onChange={update('name')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t('auth_email')}</label>
              <input type="email" required value={form.email} onChange={update('email')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t('auth_phone')}</label>
              <input value={form.phone} onChange={update('phone')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t('auth_password')}</label>
              <input type="password" required value={form.password} onChange={update('password')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>{t('auth_confirm_password')}</label>
              <input type="password" required value={form.password_confirmation} onChange={update('password_confirmation')} className={inputClass} />
            </div>
            <button disabled={loading} className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-600/20">
              {t('auth_register_button')}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            {t('auth_have_account')}{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">{t('auth_login_link')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
