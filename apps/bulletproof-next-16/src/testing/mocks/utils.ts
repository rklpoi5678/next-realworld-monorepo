import { delay } from 'msw';

import { db } from './db';

/** Base64 Encoding/Decoding (표준 API) */
export const encode = (obj: object): string => {
  return btoa(JSON.stringify(obj));
};
export const decode = <T>(str: string): T => {
  return JSON.parse(atob(str)) as T;
};

/** 단순 해시 함수 (일관성 유지) */
export const hash = (str: string): string => {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return String(hash >>> 0);
};

/** 네트워크 지연 (MSW v2 권장 방식) */
export const networkDelay = () => {
  const delayTime = process.env.NODE_ENV === 'test' ? 10 : Math.floor(Math.random() * 700) + 300;
  return delay(delayTime);
};

/** 타입 안전한 객체 생략 (Omit) */
const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

/** 유저 정보 산출 (민감 정보 제거) */
export const sanitizeUser = <T extends { password?: string; iat?: number }>(user: T) =>
  omit(user, ['password', 'iat']);

/** 인증 로직 */
export function authenticate({ email, password }: { email: string; password: string }) {
  const user = db.user.findFirst({
    where: { email: { equals: email } },
  });

  if (user && user.password === hash(password)) {
    const sanitizedUser = sanitizeUser(user);
    const encodeToken = encode(sanitizedUser);
    return { user: sanitizedUser, jwt: encodeToken };
  }

  throw new Error('Invalid username or password');
}

export const AUTH_COOKIE = `bulletproof_react_app_token`;

/** 인증 필수 여부 확인 (MSW v2 cookies에 대응) */
export function requireAuth(cookies: Record<string, string | string[] | undefined>) {
  try {
    const token = cookies[AUTH_COOKIE];
    const encodedToken = Array.isArray(token) ? token[0] : token;

    if (!encodedToken) {
      return { error: 'Unauthorized', user: null };
    }

    const decodedToken = decode<{ id: string }>(encodedToken);

    const user = db.user.findFirst({
      where: { id: { equals: decodedToken.id } },
    });

    if (!user) {
      return { error: 'Unauthorized', user: null };
    }

    return { user: sanitizeUser(user), error: null };
  } catch (error: unknown) {
    return { error: 'Unauthorized', user: null };
  }
}

/** 관리자 권한 확인 */
export function requireAdmin(user: {role?:string} | null | undefined) {
    if (user?.role !== 'ADMIN'){
        throw new Error('Unauthorized')
    }
}
