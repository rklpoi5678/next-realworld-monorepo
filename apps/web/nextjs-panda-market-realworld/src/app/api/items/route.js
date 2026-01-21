import prisma from '@/libs/prisma';
import { backendItemFormSchema } from '@/libs/schemas/item.schema';
import { apiResponse } from '@/libs/utils/api-helper';
import { getUserIdFromToken } from '@/libs/utils/auth-helper';

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);

    const pageStr = searchParams.get('page') ?? '1';
    const limitStr = searchParams.get('limit') ?? '10';
    const keyword = searchParams.get('keyword') ?? '';
    const orderBy = searchParams.get('keyword') ?? 'recent';

    const page = parseInt(pageStr);
    const limit = parseInt(limitStr);
    const total = await prisma.item.count();
    const totalPage = Math.ceil(total / limit);

    const SORT_MAP = {
      recent: { createdAt: 'desc' },
      favorite: { createdAt: 'asc' },
    };

    const sortOptions = SORT_MAP[orderBy] ?? { createdAt: 'desc' };

    const items = await prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            userProfile: true,
          },
        },
        _count: {
          select: {
            itemLikes: true,
          },
        },
      },
      orderBy: sortOptions,
      skip: limit * (page - 1),
      take: limit,
    });

    return apiResponse(
      true,
      '성공적으로 아이템을 가져왔습니다.',
      {
        items,
        pagination: { page, limit, total, totalPage },
      },
      200,
    );
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
  const validateData = backendItemFormSchema.parse(body);
  const { name, description, price, tags } = validateData;

  try {
    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        price,
        authorId: userId,
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

    if (!newItem) {
      return apiResponse(
        false,
        '상품 생상품 실패하였습니다.(Failed POST)',
        null,
        500,
      );
    }

    return apiResponse(true, '상품 생성에 성공하였습니다.', newItem, 201);
  } catch (error) {
    console.error(error);
    return apiResponse(false, 'Internal Server Error', null, 500);
  }
};
