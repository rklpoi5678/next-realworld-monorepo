import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';

import { api } from '@/libs/api-client';
import { QueryConfig } from '@/libs/react-query';
import { Comment, Meta } from '@/types/api';

export const getComments = ({
  discussionId,
  page = 1,
}: {
  discussionId: string;
  page?: number;
}): Promise<{ data: Comment[]; meta: Meta }> => {
  return api.get('/comments', {
    params: {
      discussionId,
      page,
    },
  });
};

export const getInfiniteCommentsQueryOptions = (discussionId: string) => {
  return infiniteQueryOptions({
    queryKey: ['comments', discussionId],
    queryFn: ({ pageParam }) => {
      return getComments({ discussionId, page: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // meta 정보가 없거나 마지막 페이지라면 undefined  반환
      if (!lastPage.meta || lastPage.meta.page >= lastPage.meta.totalPages) {
        return undefined;
      }
      return lastPage.meta.page + 1;
    },
  });
};

type UseInfiniteQueryOptions = {
  discussionId: string;
  queryConfig?: QueryConfig<typeof getInfiniteCommentsQueryOptions>;
};

export const useInfiniteComments = ({ discussionId, queryConfig }: UseInfiniteQueryOptions) => {
  return useInfiniteQuery({
    ...getInfiniteCommentsQueryOptions(discussionId),
    ...queryConfig,
  });
};
