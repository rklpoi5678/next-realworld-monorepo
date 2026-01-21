import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import { apiResponse } from './api-helper';

const JWT_SECRET = process.env.JWT_SECRET;

export const getUserIdFromToken = async () => {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get('accessToken');

  if (!accessTokenCookie) {
    return apiResponse(false, '인증이 필요합니다.', null, 401);
  }

  try {
    const decodedToken = jwt.verify(accessTokenCookie.value, JWT_SECRET);
    return decodedToken.userId;
  } catch (error) {
    return apiResponse(false, '유효하지 않거나 만료된 토큰', null, 401);
  }
};
