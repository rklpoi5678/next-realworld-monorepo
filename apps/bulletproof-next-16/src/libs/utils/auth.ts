import { cookies } from 'next/headers';

export const AUTH_TOKEN_COOKIE_NAME = 'bulletproof_next_app_token';

/** 참고로 next 16, react 19에서는 cookies가 비동기로 변경되었습니다.*/
export const getAuthTokenCookie = async () => {
  if (typeof window !== 'undefined') return undefined;

  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
};

/** 로그인 여부를 확인하는 함수 */
export const checkLoggedIn = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  // has 사용으로 선언적(의미론적으로 더 정확하게)
  return cookieStore.has(AUTH_TOKEN_COOKIE_NAME);
};
