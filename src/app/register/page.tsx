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

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-1">{t('auth_register_title')}</h1>
        <p className="text-gray-500 text-sm mb-6">{t('auth_register_subtitle')}</p>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth_name')}</label>
            <input required value={form.name} onChange={update('name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth_email')}</label>
            <input type="email" required value={form.email} onChange={update('email')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth_phone')}</label>
            <input value={form.phone} onChange={update('phone')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth_password')}</label>
            <input type="password" required value={form.password} onChange={update('password')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('auth_confirm_password')}</label>
            <input type="password" required value={form.password_confirmation} onChange={update('password_confirmation')} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {t('auth_register_button')}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          {t('auth_have_account')}{' '}
          <Link href="/login" className="text-blue-600 hover:underline">{t('auth_login_link')}</Link>
        </p>
      </div>
    </div>
  );
}
