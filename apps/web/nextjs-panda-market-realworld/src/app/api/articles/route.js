import { NextResponse } from 'next/server';
import { z } from 'zod';

import prisma from '@/libs/prisma';
import { articleFormSchema } from '@/libs/schemas/article.schema';
import { apiResponse } from '@/libs/utils/api-helper';
import { getUserIdFromToken } from '@/libs/utils/auth-helper';

/**
 * @see https://nextjs.org/docs/app/api-reference/functions/next-response
 * @see https://velog.io/@sue77/Next.js%EC%97%90%EC%84%9C-NextResponse%EC%99%80-Response%EC%9D%98-%EC%B0%A8%EC%9D%B4
 */

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);

    const pageStr = searchParams.get('page') ?? '1';
    const limitStr = searchParams.get('limit') ?? '10';
    const keyword = searchParams.get('keyword') ?? '';
    const orderBy = searchParams.get('orderBy') ?? 'recent';

    const page = parseInt(pageStr);
    const limit = parseInt(limitStr);
    const total = await prisma.article.count();
    const totalPage = Math.ceil(total / limit);

    const SORT_MAP = {
      recent: { createdAt: 'desc' },
      favorite: { createdAt: 'asc' },
    };
    const sortOptions = SORT_MAP[orderBy] ?? { createdAt: 'desc' };

    const articles = await prisma.article.findMany({
      where: {
        OR: [{ title: { contains: keyword, mode: 'insensitive' } }],
      },
      include: {
        author: {
          include: {
            userProfile: true,
          },
        },
      },
      orderBy: sortOptions,
      skip: limit * (page - 1),
      take: limit,
    });

    return NextResponse.json({
      success: true,
      message: 'success get articles',
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPage,
      },
    });
  } catch (error) {
    console.error('API Error:', error);

    return apiResponse(false, 'Internal Server Error', null, 500);
  }
};

export const POST = async (request) => {
  let userId;
  try {
    userId = await getUserIdFromToken();
  } catch (error) {
    return apiResponse(false, error.message, null, 401);
  }

  const body = await request.json();
  const validateData = articleFormSchema.parse(body);
  const { title, content } = validateData;

  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        authorId: userId,
        view: 0,
      },
    });

    if (!newArticle) {
      return apiResponse(false, '아티클 생성에 실패(Failed POST)', null, 500);
    }

    return apiResponse(true, 'Success Create Article', newArticle, 201);
  } catch (error) {
    console.error('API Post Error', error);
    if (error instanceof z.ZodError) {
      return apiResponse(false, '유효성 검사 실패', null, 400);
    }

    return apiResponse(false, 'Internal Server Error', null, 500);
  }
};
