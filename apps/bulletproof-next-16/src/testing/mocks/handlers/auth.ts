import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import { authenticate, hash, requireAuth, AUTH_COOKIE, networkDelay } from '../utils';

/** 타입정의 */
type RegisterBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId?: string;
  teamName?: string;
};

type LoginBody = {
  email: string;
  password: string;
};

export const authHandlers = [
  /**  회원가입 */
  http.post(`${env.API_URL}/auth/register`, async ({ request }) => {
    await networkDelay();
    try {
      const userObject = (await request.json()) as RegisterBody;
      const existingUser = db.user.findFirst({
        where: { email: { equals: userObject.email } },
      });

      if (existingUser) {
        return HttpResponse.json({ message: 'The user already exists' }, { status: 400 });
      }

      let teamId: string;
      let role: 'ADMIN' | 'USER';

      if (!userObject.teamId) {
        const team = db.team.create({
          name: userObject.teamName ?? `${userObject.firstName} Team`,
        });
        await persistDb('team');
        teamId = team.id;
        role = 'ADMIN';
      } else {
        const existingTeam = db.team.findFirst({
          where: { id: { equals: userObject.teamId } },
        });

        if (!existingTeam) {
          return HttpResponse.json(
            { message: 'The team you are trying to join does not exist!' },
            { status: 400 },
          );
        }
        teamId = userObject.teamId;
        role = 'USER';
      }

      db.user.create({
        ...userObject,
        role,
        password: hash(userObject.password),
        teamId,
      });

      await persistDb('user');

      const result = authenticate({
        email: userObject.email,
        password: userObject.password,
      });

      /** MSW v2 Response 객체의 headers를 통해 Set-Cookies를 설정하는 것이 표준이다. */
      return HttpResponse.json(result, {
        headers: {
          'Set-Cookie': `${AUTH_COOKIE}=${result.jwt}; Path=/; HttpOnly; SameSite=Lax`,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),

  /** 로그인 */
  http.post(`${env.API_URL}/auth/login`, async ({ request }) => {
    await networkDelay();
    try {
      const credentials = (await request.json()) as LoginBody;
      const result = authenticate(credentials);

      return HttpResponse.json(result, {
        headers: {
          'Set-Cookie': `${AUTH_COOKIE}=${result.jwt}; Path=/; HttpOnly; SameSite=Lax`,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),

  /** 로그아웃 */
  http.post(`${env.API_URL}/auth/logout`, async () => {
    await networkDelay();
    return HttpResponse.json(
      { message: 'Logged out' },
      {
        // 쿠키 즉시 완료시킵니다.
        headers: {
          'Set-Cookie': `${AUTH_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
        },
      },
    );
  }),

  /** 내 정보 조회 */
  http.get(`${env.API_URL}/auth/me`, async ({ cookies }) => {
    await networkDelay();
    try {
      // MSW v2는 핸들러 인자에 직접 cookies 객체에 접근 가능합니다.
      const { user, error } = requireAuth(cookies);

      // user가 없거나 error 객체가 존재하면 401 return
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      return HttpResponse.json({ data: user });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unauthorized';
      return HttpResponse.json({ message }, { status: 401 });
    }
  }),
];
