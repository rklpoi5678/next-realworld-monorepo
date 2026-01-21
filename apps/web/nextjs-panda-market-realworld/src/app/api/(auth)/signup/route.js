import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import prisma from '@/libs/prisma';
import { apiResponse } from '@/libs/utils/api-helper';

const SALT_ROUNDS = 10;

export async function POST(request) {
  try {
    const { email, nickname, password } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // 중복
    if (existingUser) {
      return apiResponse(false, '해당 유저가 존재합니다.', null, 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        name: nickname,
        password: hashedPassword,
      },
    });

    return apiResponse(true, '회원가입을 성공하였습니다.', user, 201);
  } catch (error) {
    // prettier-ignore
    return apiResponse(false, '회원가입 중 오류가 발생하였습니다.', null, 500, error.message)
  }
}
