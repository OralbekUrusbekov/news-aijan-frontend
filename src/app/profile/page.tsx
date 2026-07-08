'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { User } from '@/lib/types';

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', phone: '', bio: '' });
  const [passwordForm, setPasswordForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) setForm({ name: user.name, phone: user.phone || '', bio: user.bio || '' });
  }, [user, loading, router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.put<User>('/auth/profile/', form, { auth: true });
      await refreshUser();
      setMessage(t('profile_updated'));
    } catch {
      setMessage(t('common_error'));
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage('');
    try {
      await api.put('/auth/password/', passwordForm, { auth: true });
      setPasswordMessage(t('profile_password_updated'));
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      setPasswordMessage(err instanceof ApiError ? t('common_error') : t('common_error'));
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading || !user) return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">{t('common_loading')}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold">{t('profile_title')}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <form onSubmit={saveProfile} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">{t('profile_personal_info')}</h2>
        {message && <p className="text-sm text-blue-600">{message}</p>}
        <div>
          <label className="block text-sm font-medium mb-1">{t('profile_full_name')}</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('auth_phone')}</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('profile_bio')}</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button disabled={saving} className="bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {t('profile_save_changes')}
        </button>
      </form>

      <form onSubmit={savePassword} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">{t('profile_change_password')}</h2>
        {passwordMessage && <p className="text-sm text-blue-600">{passwordMessage}</p>}
        <div>
          <label className="block text-sm font-medium mb-1">{t('profile_current_password')}</label>
          <input type="password" required value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('profile_new_password')}</label>
          <input type="password" required value={passwordForm.password} onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t('auth_confirm_password')}</label>
          <input type="password" required value={passwordForm.password_confirmation} onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button disabled={savingPassword} className="bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {t('profile_update_password')}
        </button>
      </form>
    </div>
  );
}
