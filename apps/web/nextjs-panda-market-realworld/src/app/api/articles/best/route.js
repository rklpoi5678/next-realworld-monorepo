import prisma from '@/libs/prisma';
import { apiResponse } from '@/libs/utils/api-helper';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,

      include: {
        author: {
          include: {
            userProfile: true,
          },
        },
      },
    });

    return apiResponse(true, 'Success Getting Best Articles', articles, 200);
  } catch (error) {
    console.error('Best Articles API Error:', error);
    return apiResponse(false, 'Internal Server Error', null, 500);
  }
}
