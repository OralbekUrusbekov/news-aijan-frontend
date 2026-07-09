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

  const inputClass = 'w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition';
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5';

  if (loading || !user) return <div className="max-w-3xl mx-auto px-4 py-24 text-center text-slate-400">{t('common_loading')}</div>;

  return (
    <div className="bg-slate-50 min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="flex items-center gap-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatar_url} alt={user.name} className="w-20 h-20 rounded-full ring-4 ring-blue-50" />
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900">{t('profile_title')}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
            <span className="inline-block mt-2 text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{user.role}</span>
          </div>
        </div>

        <form onSubmit={saveProfile} className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="font-display font-extrabold text-slate-900 text-lg">{t('profile_personal_info')}</h2>
          {message && <p className="text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">{message}</p>}
          <div>
            <label className={labelClass}>{t('profile_full_name')}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('auth_phone')}</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('profile_bio')}</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className={inputClass} />
          </div>
          <button disabled={saving} className="bg-blue-600 text-white rounded-xl px-6 py-2.5 text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-600/20">
            {t('profile_save_changes')}
          </button>
        </form>

        <form onSubmit={savePassword} className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="font-display font-extrabold text-slate-900 text-lg">{t('profile_change_password')}</h2>
          {passwordMessage && <p className="text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">{passwordMessage}</p>}
          <div>
            <label className={labelClass}>{t('profile_current_password')}</label>
            <input type="password" required value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('profile_new_password')}</label>
            <input type="password" required value={passwordForm.password} onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('auth_confirm_password')}</label>
            <input type="password" required value={passwordForm.password_confirmation} onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })} className={inputClass} />
          </div>
          <button disabled={savingPassword} className="bg-blue-600 text-white rounded-xl px-6 py-2.5 text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-600/20">
            {t('profile_update_password')}
          </button>
        </form>
      </div>
    </div>
  );
}
