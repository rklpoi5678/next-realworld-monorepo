import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { db, persistDb } from '../db';
import { networkDelay, requireAuth, sanitizeUser } from '../utils';

/** 요청 본문 타입 정의 */
type CreateCommentBody = {
  body: string;
  discussionId: string;
};

export const commentsHandlers = [
  /** 댓글 목록 조회 (페이지네이션 + 작성자 정보) */
  http.get(`${env.API_URL}/comments`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      const url = new URL(request.url);
      const discussionId = url.searchParams.get('discussionId') || '';
      const page = Number(url.searchParams.get('page') || 1);
      const perPage = 10;

      // 해당 토론 존재 여부 및 공개 여부 체크
      const discussion = db.discussion.findFirst({
        where: { id: { equals: discussionId } },
      });

      // 비공개 토론인 경우 인증 체크
      if (!discussion?.public) {
        const { error } = requireAuth(cookies);
        if (error) {
          return HttpResponse.json({ message: error }, { status: 401 });
        }
      }

      // 전체 댓글 수 계산 (메타데이터 용)
      const total = db.comment.count({
        where: { discussionId: { equals: discussionId } },
      });

      const totalPages = Math.ceil(total / perPage);

      //  댓글 목록 조회 및 작성자 정보와 조인
      const comments = db.comment
        .findMany({
          where: { discussionId: { equals: discussionId } },
          take: perPage,
          skip: perPage * (page - 1),
        })
        .map(({ authorId, ...comment }) => {
          const author = db.user.findFirst({
            where: { id: { equals: authorId } },
          });
          return {
            ...comment,
            author: author
              ? sanitizeUser(author)
              : { id: 'unknown', firstName: 'Unknown', lastName: '', role: 'USER' },
          };
        });

      return HttpResponse.json({
        data: comments,
        meta: { page, total, totalPages },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),

  /** 댓글 생성 */
  http.post(`${env.API_URL}/comments`, async ({ request, cookies }) => {
    await networkDelay();

    try {
      // 인증 확인
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      const data = (await request.json()) as CreateCommentBody;

      // 댓글 생성
      const result = db.comment.create({
        authorId: user.id,
        ...data,
      });

      // DB 상태 파일에 영속화
      await persistDb('comment');

      return HttpResponse.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),

  /** 댓글 삭제 (권한 확인 포함) */
  http.delete(`${env.API_URL}/comments/:commentId`, async ({ params, cookies }) => {
    await networkDelay();

    try {
      // 인증확인
      const { user, error } = requireAuth(cookies);
      if (error || !user) {
        return HttpResponse.json({ message: error || 'Unauthorized' }, { status: 401 });
      }

      const commentId = params.commentId as string;

      /**
       * 삭제 시 권한 필터링
       * 관리자는 모든 댓글 삭제 가능, 일반 유저는 본인 댓글만 삭제 가능
       */
      const comment = db.comment.findFirst({
        where: { id: { equals: commentId } },
      });

      if (!comment) {
        return HttpResponse.json({ message: 'Comment not found' }, { status: 404 });
      }

      // 일반 유저인데 본인댓글이 아닌 경우
      if (user.role === 'USER' && comment.authorId !== user.id) {
        return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
      }

      const result = db.comment.delete({
        where: { id: { equals: commentId } },
      });

      await persistDb('comment');
      return HttpResponse.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 500 });
    }
  }),
];
