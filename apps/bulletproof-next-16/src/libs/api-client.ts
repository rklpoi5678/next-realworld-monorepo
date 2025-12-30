import { cookies } from 'next/headers';

import { config } from '@/config/env';

import { useNotifications } from '@/components/ui/notifications/notifications-store';

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  cookie?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

/** 쿼리 파라미터 빌더 (URLSearchParams 활용)*/
function buildUrlWithParams(url: string, params?: RequestOptions['params']): string {
  if (!params) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== 'undefined' && val !== null) {
      searchParams.append(key, String(val));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/** 서버 사이드 쿠키 획득 */
export async function getServerCookie(): Promise<string> {
  if (typeof window !== 'undefined') return '';

  try {
    const cookieStore = await cookies();
    return cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
  } catch (error) {
    console.error('Failed to access cookies:', error);
    return '';
  }
}

/** 메인 Fetch API wrapper */
async function fetchAPI<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, cookie, params, cache = 'no-store', next } = options;
  let cookieHeader = cookie;
  if (typeof window === 'undefined' && !cookie) {
    cookieHeader = await getServerCookie();
  }

  const fullUrl = buildUrlWithParams(`${config.API_URL}`, params);

  const response = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    cache,
    next,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {}

    if (typeof window !== 'undefined') {
      const { addNotification } = useNotifications.getState();
      addNotification({
        type: 'error',
        title: 'request error',
        message,
      });
    }

    throw new Error(message);
  }

  // 204 No Content
  if (response.status === 204) return {} as T;
  return response.json();
}

/** API Object (TypeSafe) */
export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchAPI<T>(url, { ...options, method: 'GET' });
  },
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchAPI<T>(url, { ...options, method: 'POST', body });
  },
  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchAPI<T>(url, { ...options, method: 'PUT', body });
  },
  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return fetchAPI<T>(url, { ...options, method: 'PATCH', body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchAPI<T>(url, { ...options, method: 'DELETE' });
  },
};
