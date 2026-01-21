import { revalidateTag } from 'next/cache';

import prisma from '@/libs/prisma';
import { backendItemFormSchema } from '@/libs/schemas/item.schema';
import { apiResponse } from '@/libs/utils/api-helper';
import { getUserIdFromToken } from '@/libs/utils/auth-helper';

export const GET = async (request, { params }) => {
  const { id } = await params;
  if (!id) {
    return apiResponse(false, 'Not Found Article', null, 404);
  }
  /** @see https://nextjs.org/docs/app/api-reference/functions/unstable_cache */
  try {
    const item = await prisma.item.findUnique({
      where: {
        id,
      },
      include: {
        user: {
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
                userProfile: {
                  select: {
                    photoUrl: true,
                  },
                },
              },
            },
          },
        },
        tags: true,
        _count: {
          select: { itemLikes: true },
        },
      },
    });
    if (!item) {
      return apiResponse(false, `ID ${id} not found`, null, 404);
    }
    return apiResponse(true, '상품 조회를 성공하였습니다.', item, 200);
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

  const { id } = await params;

  if (!id) {
    return apiResponse(false, '상품 아이디를 찾을수없습니다.', null, 404);
  }

  const body = await request.json();
  const validateData = backendItemFormSchema.parse(body);
  const { name, description, price, tags } = validateData;

  try {
    const updateItem = await prisma.item.update({
      where: { id: id, authorId: userId },
      data: {
        name,
        description,
        price,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    revalidateTag(`item-${id}`, 'max');

    return apiResponse(
      true,
      '상품 업데이트가 완료되었습니다.',
      updateItem,
      200,
    );
  } catch (error) {
    console.error(error);

    return apiResponse(
      false,
      '서버 오류로 상품 업데이트에 실패했습니다',
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

  const { id } = await params;

  if (!id) {
    return apiResponse(false, '상품 아이디를 찾을수없습니다.', null, 404);
  }

  try {
    await prisma.item.delete({
      where: { id: id, authorId: userId },
    });

    revalidateTag(`item-${id}`, 'max');

    return apiResponse(true, '성공적으로 상품을 삭제하였습니다.', null, 200);
  } catch (error) {
    console.error(error);
    return apiResponse(false, 'Internal Server Error', null, 500);
  }
};
