import { cookies } from 'next/headers';

import prisma from '@/libs/prisma';
import { apiResponse } from '@/libs/utils/api-helper';

export async function POST() {
  const cookieStore = cookies();
  try {
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    cookieStore.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    });

    cookieStore.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
    });

    return apiResponse(true, '로그아웃 성공', null, 200);
  } catch (error) {
    return apiResponse(
      false,
      '로그아웃 진행중 에러발생',
      null,
      error.message,
      500,
    );
  }
}
