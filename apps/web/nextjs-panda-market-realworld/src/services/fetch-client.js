const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const defaultFetch = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${url}`, mergedOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => {});
    const errorMessage = errorData?.message || `API Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
};

export const cookieFetch = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  let response = await fetch(`${API_URL}${url}`, mergedOptions);

  if (response.status === 401 && url !== '/api/refresh-token') {
    try {
      const refreshResponse = await fetch(`/api/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });

      if (refreshResponse.ok) {
        response = await fetch(`${url}`, mergedOptions);
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
    }
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => {});
    const errorMessage = errorData.message || `API Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return { status: response.status, ok: response.ok };
};
