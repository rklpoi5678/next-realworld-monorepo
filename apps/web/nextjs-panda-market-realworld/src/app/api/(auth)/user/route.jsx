import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import prisma from '@/libs/prisma';
import { apiResponse } from '@/libs/utils/api-helper';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get('accessToken');

  if (!accessTokenCookie) {
    return apiResponse(false, '인증이 필요합니다.', null, 401)
  }

  const accessToken = accessTokenCookie.value;
  let decodedToken;

  try {
    decodedToken = jwt.verify(accessToken, JWT_SECRET);
  } catch (error) {
    return apiResponse(false, '유효하지 않거나 만료된 토큰입니다.', null, 401)
  }

  try {
    const userId = decodedToken.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return apiResponse(false, '유저 정보를 찾을수 없습니다.', null, 404)
    }

    // 사용자 정보 반환
    return apiResponse(true, '인증 성공', user, 200)
  } catch (error) {
    console.error('사용자 정보 조회 중 오류 발생:', error);
    return apiResponse(false, 'Internal Error', null, 500)
  }
}