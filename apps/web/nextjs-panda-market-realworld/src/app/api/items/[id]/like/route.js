import { revalidateTag } from 'next/cache';

import prisma from '@/libs/prisma';
import { apiResponse } from '@/libs/utils/api-helper';
import { getUserIdFromToken } from '@/libs/utils/auth-helper';

export const GET = async (request, { params }) => {
  let userId;
  try {
    userId = await getUserIdFromToken();
  } catch (error) {
    return apiResponse(false, 'Unauthorized', null, 401);
  }

  const { id: itemId } = await params;

  try {
    const existingLike = await prisma.itemLike.findUnique({
      where: {
        itemId_userId: { itemId, userId },
      },
      select: { id: true },
    });

    const isLiked = !!existingLike; // 레코드가 있으면 트루상태임

    return apiResponse(true, ' 좋아요 상태 조회 성공', { isLiked }, 200);
  } catch (error) {
    console.error(error);
    return apiResponse(false, '좋아요 상태 변경 실패', null, error);
  }
};

export const POST = async (request, { params }) => {
  let userId;
  try {
    userId = await getUserIdFromToken();
  } catch (error) {
    return apiResponse(false, error.message, null, 401);
  }

  const { id: itemId } = await params;

  try {
    const existingLike = await prisma.itemLike.findUnique({
      where: {
        itemId_userId: {
          itemId: itemId,
          userId: userId,
        },
      },
    });

    if (existingLike) {
      // 있는상태(좋아요)시 -> 삭제
      // 아닐시 -> 생성
      // user아이디는 무조건 타입이 string인지 필요하지만...
      await prisma.itemLike.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.itemLike.create({ data: { itemId, userId } });
    }

    // 서버 캐시 무효화
    revalidateTag(`item-${itemId}`, 'max');

    return apiResponse(true, '성공', null, 200);
  } catch (error) {
    console.error(error);
    return apiResponse(false, '토클 하트 실패', null, 500);
  }
};
