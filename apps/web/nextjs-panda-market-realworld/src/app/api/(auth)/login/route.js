import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import prisma from '@/libs/prisma';
import { apiResponse } from '@/libs/utils/api-helper';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET을 찾을수없습니다.');
}

export async function POST(request) {
  const cookieStore = await cookies();
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // prettier-ignore
      return apiResponse(false, '이메일 또는 비밀번호를 확인해주세요.', null, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // prettier-ignore
      return apiResponse(false, '이메일 또는 비밀번호를 확인해주세요.', null, 401);
    }

    // accessToken 생성
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: '30m',
      },
    );

    const accessExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

    // refreshToken 생성
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt: refreshExpiresAt,
        userId: user.id,
      },
    });

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      expires: accessExpiresAt,
    });

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      expires: refreshExpiresAt,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: { id: user.id, email: user.email, nickname: user.name },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    //prettier-ignore
    return apiResponse(false, '로그인 중 오류가 발생했습니다.', null, 500, error.message)
  }
}
