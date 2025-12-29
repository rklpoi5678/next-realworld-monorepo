import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import { requireAuth, requireAdmin, sanitizeUser, networkDelay } from '../utils';

/** 프로필 수정 요청 본문 타입 */
type ProfileBody = {
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
};

export const usersHandlers = [
  /** 같은 팀 멤버 목록 조회 */
  http.get(`${env.API_URL}/users`, async ({ cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      // 현재 로그인한 유저와 같은 팀인 유저들만 조회
      const result = db.user
        .findMany({
          where: {
            teamId: { equals: user.teamId },
          },
        })
        .map(sanitizeUser); // 비밀번호 등 민감 정보 제거

      return HttpResponse.json({ data: result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),

  /** 내 프로필 정보 수정 */
  http.patch(`${env.API_URL}/users/profile`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      const data = (await request.json()) as ProfileBody;

      // 로그인된 자신의 정보만 업데이트
      const result = db.user.update({
        where: {
          id: { equals: user.id },
        },
        data,
      });

      await persistDb('user');
      return HttpResponse.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),

  /** 유저 삭제 (관리자 전용 및 같은 팀원만 삭제 가능) */
  http.delete(`${env.API_URL}/users/:userId`, async ({ cookies, params }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      const userId = params.userId as string;

      // 관리자 권한 확인 (ADMIN이 아니면 throw Error)
      requireAdmin(user);

      // 삭제 실행 (자기 자신을 삭제하거나 다른 팀원을 삭제하는 로직 방어)
      const result = db.user.delete({
        where: {
          id: { equals: userId },
          teamId: { equals: user.teamId }, // 같은 팀 내의 유저만 삭제 가능하도록 제한
        },
      });

      await persistDb('user');
      return HttpResponse.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      // 관리자 권한 부족 시 403 Forbidden 응답
      const status = message === 'Unauthorized' ? 403 : 500;
      return HttpResponse.json({ message }, { status });
    }
  }),
];
