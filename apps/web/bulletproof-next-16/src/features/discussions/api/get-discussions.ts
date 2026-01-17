import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/libs/api-client';
import { QueryConfig } from '@/libs/react-query';
import { Discussion, Meta } from '@/types/api';

/** API  Func */
export const getDiscussions = ({ page = 1 }: { page?: number } = {}): Promise<{
  data: Discussion[];
  meta: Meta;
}> => {
  return api.get('/discussions', {
    params: { page },
  });
};

/** Query Options */
export const getDiscussionsQueryOptions = ({ page = 1 }: { page?: number } = {}) => {
  return queryOptions({
    queryKey: ['discussions', { page }],
    queryFn: () => getDiscussions({ page }),
  });
};

type UseDiscussionsOptions = {
  page?: number;
  queryConfig?: QueryConfig<typeof getDiscussionsQueryOptions>;
};

// useDiscussions인자 자체에 = {} 기본값을 주어 옵션없이 호출시에도 에러가 나지 않도록 안정성을 높힌다.
export const useDiscussions = ({ page = 1, queryConfig }: UseDiscussionsOptions = {}) => {
  return useQuery({
    ...getDiscussionsQueryOptions({ page }),
    ...queryConfig,
    // 페이지네이션 시 다음 페이지 로드 전까지 이전 데이터를 보여주어 UX개선
    placeholderData: keepPreviousData,
  });
};
