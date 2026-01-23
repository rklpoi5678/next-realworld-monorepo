import { revalidateTag } from 'next/cache';

import prisma from '@/libs/prisma';
import { itemCommentSchema } from '@/libs/schemas/comment.schema';
import { apiResponse } from '@/libs/utils/api-helper';
import { getUserIdFromToken } from '@/libs/utils/auth-helper';

export const POST = async (request, { params }) => {
  let userId;
  try {
    userId = await getUserIdFromToken();
  } catch (error) {
    return apiResponse(false, error.message, null, 401);
  }

  const { id: itemId } = await params;

  const body = await request.json();
  const validateData = itemCommentSchema.parse(body);
  const { context } = validateData;

  try {
    const newComment = await prisma.itemComment.create({
      data: {
        authorId: userId,
        itemId: itemId,
        context,
      },
    });

    revalidateTag(`item-${itemId}`, 'max');

    if (!newComment) {
      return apiResponse(false, '댓글 생성에 실패하였습니다.', null, 400);
    }

    return apiResponse(true, '댓글 생성에 성공하였습니다.', newComment, 201);
  } catch (error) {
    console.error(error);
    return apiResponse(false, 'Internal Server Error', null, 500);
  }
};
