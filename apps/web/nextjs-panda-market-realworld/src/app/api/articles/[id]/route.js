import prisma from '@/libs/prisma';
import { articleFormSchema } from '@/libs/schemas/article.schema';
import { apiResponse } from '@/libs/utils/api-helper';
import { getUserIdFromToken } from '@/libs/utils/auth-helper';

export const GET = async (request, { params }) => {
  const { id } = await params;
  if (!id) {
    return apiResponse(false, 'Not Found Article', null, 404);
  }
  /** @see https://nextjs.org/docs/app/api-reference/functions/unstable_cache */
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            userProfile: true,
          },
        },
        comment: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                userProfile: true,
              },
            },
          },
        },
      },
    });
    if (!article) {
      return apiResponse(false, `ID ${id} not found`, null, 404);
    }
    return apiResponse(true, '상품 조회를 성공하였습니다.', article, 200);
  } catch (error) {
    console.error('API Error', error);
    return apiResponse(
      false,
      'Internal Server Error',
      null,
      500,
      error.message,
    );
  }
};

export const PATCH = async (request, { params }) => {
  let userId;
  try {
    userId = await getUserIdFromToken();
  } catch (error) {
    return apiResponse(false, error.message, null, 401);
  }

  const { id: articleId } = await params;

  if (!articleId) {
    return apiResponse(false, '아티클을 찾을수없습니다.', null, 404);
  }

  const body = await request.json();
  const validateData = articleFormSchema.parse(body);
  const { title, content } = validateData;

  try {
    const updateArticle = await prisma.article.update({
      where: { id: articleId, authorId: userId },
      data: {
        title,
        content,
      },
    });

    return apiResponse(true, 'Success Update Article', updateArticle, 200);
  } catch (error) {
    console.error('게시글 업데이트 중 오류 발생:', error);

    return apiResponse(
      false,
      '서버 오류로 게시글 업데이트에 실패했습니다.',
      null,
      500,
    );
  }
};

export const DELETE = async (request, { params }) => {
  let userId;
  try {
    userId = await getUserIdFromToken();
  } catch (error) {
    return apiResponse(false, error.message, null, 401);
  }

  const { id: articleId } = await params;
  if (!articleId) {
    return apiResponse(false, 'Not Found Article Id', null, 404);
  }

  try {
    await prisma.article.delete({
      where: { id: articleId, authorId: userId },
    });

    return apiResponse(true, 'Article Deleted Successfully', null, 200);
  } catch (error) {
    console.error(error);
    return apiResponse(false, 'Internal Server Error', null, 500);
  }
};
