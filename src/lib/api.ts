const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api';

const ACCESS_KEY = 'news_access_token';
const REFRESH_KEY = 'news_refresh_token';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh?: string) {
  window.localStorage.setItem(ACCESS_KEY, access);
  if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

function getLocale(): string {
  if (typeof window === 'undefined') return 'kk';
  return window.localStorage.getItem('news_locale') || 'kk';
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, data: unknown) {
    super(typeof data === 'object' && data && 'detail' in (data as never) ? String((data as { detail?: string }).detail) : 'API error');
    this.status = status;
    this.data = data;
  }
}

interface ApiOptions extends RequestInit {
  auth?: boolean;
  params?: Record<string, string | number | undefined>;
}

async function request<T>(path: string, options: ApiOptions = {}, retry = true): Promise<T> {
  const { auth = false, params, headers, ...rest } = options;

  const url = new URL(`${API_URL}${path}`);
  url.searchParams.set('lang', getLocale());
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    });
  }

  const finalHeaders: Record<string, string> = {
    ...(rest.body ? { 'Content-Type': 'application/json' } : {}),
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), { ...rest, headers: finalHeaders });

  if (response.status === 401 && auth && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(path, options, false);
  }

  if (!response.ok) {
    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      /* no body */
    }
    throw new ApiError(response.status, data);
  }

  if (response.status === 204 || response.status === 205) return undefined as T;
  return response.json();
}

async function tryRefresh(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.access, data.refresh);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  get: <T,>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T,>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T,>(path: string, body?: unknown, options?: ApiOptions) =>
    request<T>(path, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T,>(path: string, options?: ApiOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};
