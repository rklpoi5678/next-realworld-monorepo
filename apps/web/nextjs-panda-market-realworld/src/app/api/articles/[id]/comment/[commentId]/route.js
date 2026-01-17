import { revalidateTag } from 'next/cache';

import prisma from '@/libs/prisma';
import { itemCommentSchema } from '@/libs/schemas/comment.schema';
import { apiResponse } from '@/libs/utils/api-helper';
import { getUserIdFromToken } from '@/libs/utils/auth-helper';

export const PATCH = async (request, { params }) => {
  let userId;
  try {
    userId = await getUserIdFromToken();
  } catch (error) {
    return apiResponse(false, error.message, null, 401);
  }

  const { id: articleId, commentId: commentId } = await params;

  const body = await request.json();
  const validateData = itemCommentSchema.parse(body);
  const { context } = validateData;

  try {
    await prisma.articleComment.update({
      where: { id: commentId, articleId: articleId },
      data: {
        context: context,
      },
    });

    revalidateTag(`article-${itemId}`, 'max');

    //prettier-ignore
    return apiResponse(true, '성공적으로 댓글을 업데이트하였습니다.', null, 200);
  } catch (error) {
    console.error(error);
    return apiResponse(false, 'Internal Server Error', null, 500);
  }
};

export const DELETE = async (request, { params }) => {
  let userId;
  try {
    userId = await getUserIdFromToken();
  } catch (error) {
    return apiResponse(false, error.message, null, 401);
  }

  const { id: articleId, commentId: commentId } = await params;

  if (!commentId) {
    return apiResponse(false, '유효하지 않은 댓글 아이디입니다.', null, 404);
  }

  try {
    await prisma.articleComment.delete({
      where: { id: commentId, authorId: userId, articleId: articleId },
    });

    revalidateTag(`article-${itemId}`, 'max');

    return apiResponse(true, '성공적으로 댓글을 삭제하였습니다.', null, 200);
  } catch (error) {
    console.error(error);
    return apiResponse(false, 'Internal Server Error', null, 500);
  }
};
