import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import { requireAuth, requireAdmin, sanitizeUser, networkDelay } from '../utils';

/** 1. 요청 본문 타입 정의 */
type DiscussionBody = {
  title: string;
  body: string;
  public: boolean;
};

export const discussionsHandlers = [
  /**  토론 목록 조회 (팀 기반 필터링) */
  http.get(`${env.API_URL}/discussions`, async ({ cookies, request }) => {
    await networkDelay();

    try {
      // 인증 확인 및 유저 정보 추출
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page') || 1);
      const perPage = 10;

      // 같은 팀의 토론만 카운트
      const total = db.discussion.count({
        where: { teamId: { equals: user.teamId } },
      });

      const totalPages = Math.ceil(total / perPage);

      // 토론 목록 조회 및 작성자 정보 조인
      const result = db.discussion
        .findMany({
          where: { teamId: { equals: user.teamId } },
          take: perPage,
          skip: perPage * (page - 1),
        })
        .map(({ authorId, ...discussion }) => {
          const author = db.user.findFirst({
            where: { id: { equals: authorId } },
          });
          return {
            ...discussion,
            author: author ? sanitizeUser(author) : { firstName: 'Unknown' },
          };
        });

      return HttpResponse.json({
        data: result,
        meta: { page, total, totalPages },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),

  /** 토론 상세 조회 (공개 여부 및 팀 권한 체크) */
  http.get(`${env.API_URL}/discussions/:discussionId`, async ({ params, cookies }) => {
    await networkDelay();

    const discussionId = params.discussionId as string;

    // 1차 조회
    const discussion = db.discussion.findFirst({
      where: { id: { equals: discussionId } },
    });

    if (!discussion) {
      return HttpResponse.json({ message: 'Discussion not found' }, { status: 404 });
    }

    // 공개된 글인 경우 바로 반환
    if (discussion.public) {
      const author = db.user.findFirst({
        where: { id: { equals: discussion.authorId } },
      });
      return HttpResponse.json({
        data: { ...discussion, author: author ? sanitizeUser(author) : { firstName: 'Unknown' } },
      });
    }

    // 비공개 글인 경우 팀 소속 확인
    try {
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      // 내 팀의 글인지 다시 확인
      if (discussion.teamId !== user.teamId) {
        return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
      }

      const author = db.user.findFirst({
        where: { id: { equals: discussion.authorId } },
      });

      return HttpResponse.json({
        data: { ...discussion, author: author ? sanitizeUser(author) : { firstName: 'Unknown' } },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),

  /**  토론 생성 (ADMIN 권한 필요) */
  http.post(`${env.API_URL}/discussions`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      // 유틸리티 함수로 관리자 권한 확인
      requireAdmin(user);

      const data = (await request.json()) as DiscussionBody;
      const result = db.discussion.create({
        teamId: user.teamId,
        authorId: user.id,
        ...data,
      });

      await persistDb('discussion');
      return HttpResponse.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      // 권한 에러 처리 (requireAdmin에서 발생한 에러 대응)
      const status = message === 'Unauthorized' ? 403 : 500;
      return HttpResponse.json({ message }, { status });
    }
  }),

  /** 토론 수정 (ADMIN 및 소속 팀 확인) */
  http.patch(`${env.API_URL}/discussions/:discussionId`, async ({ request, params, cookies }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      requireAdmin(user);

      const data = (await request.json()) as DiscussionBody;
      const discussionId = params.discussionId as string;

      const result = db.discussion.update({
        where: {
          id: { equals: discussionId },
          teamId: { equals: user.teamId }, // 내 팀의 글만 수정 가능
        },
        data,
      });

      await persistDb('discussion');
      return HttpResponse.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),

  /** 토론 삭제 (ADMIN 권한 필요) */
  http.delete(`${env.API_URL}/discussions/:discussionId`, async ({ cookies, params }) => {
    await networkDelay();

    try {
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      requireAdmin(user);
      const discussionId = params.discussionId as string;

      const result = db.discussion.delete({
        where: {
          id: { equals: discussionId },
          teamId: { equals: user.teamId }, // 내 팀의 글만 삭제 가능
        },
      });

      await persistDb('discussion');
      return HttpResponse.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),
];
