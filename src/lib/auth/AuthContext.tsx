'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { api, ApiError, clearTokens, getAccessToken, setTokens } from '@/lib/api';
import { User } from '@/lib/types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!getAccessToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.get<User>('/auth/profile/', { auth: true });
      setUser(data);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await api.post<{ access: string; refresh: string; user: User }>('/auth/login/', { email, password });
      setTokens(data.access, data.refresh);
      setUser(data.user);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw err;
    }
  };

  const register = async (payload: RegisterPayload) => {
    const data = await api.post<{ access: string; refresh: string; user: User }>('/auth/register/', payload);
    setTokens(data.access, data.refresh);
    setUser(data.user);
  };

  const logout = async () => {
    const refresh = typeof window !== 'undefined' ? window.localStorage.getItem('news_refresh_token') : null;
    try {
      await api.post('/auth/logout/', { refresh }, { auth: true });
    } catch {
      /* ignore */
    }
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
