/** TypeSafe Router Pattern */

/** 쿼리 파라미터를 생성 하기위한 헬퍼 함수 */
const createUrl = (path: string, params: Record<string, string | null | undefined>) => {
  // 두번째 인자는 baseUrl, pathname추출용
  const url = new URL(path, 'http://localhost');
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.append(key, String(val));
    }
  });
  return url.pathname + url.search;
};

export const paths = {
  home: {
    getHref: () => '/',
  },

  auth: {
    register: {
      getHref: (redirectTo?: string | null | undefined) =>
        createUrl('/auth/register', { redirectTo }),
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) => createUrl('/auth/login', { redirectTo }),
    },
  },

  app: {
    root: {
      getHref: () => '/app',
    },
    dashboard: {
      getHref: () => '/app',
    },
    discussions: {
      getHref: () => '/app/discussions',
    },
    discussion: {
      getHref: (id: string) => `/app/discussions/${id}`,
    },
    users: {
      getHref: () => '/app/users',
    },
    profile: {
      getHref: () => '/app/profile',
    },
  },
  public: {
    discussion: {
      getHref: (id: string) => `/public/discussions/${id}`,
    },
  },
} as const;
