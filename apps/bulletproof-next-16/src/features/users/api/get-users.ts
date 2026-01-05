import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { api } from '@/libs/api-client';
import { QueryConfig } from '@/libs/react-query';
import { User } from '@/types/api';

export const getUsers = (): Promise<{ data: User[] }> => {
  return api.get('/users');
};

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: ['users'],
    queryFn: getUsers,
    // 불필요한 백그라운드 재요청을방지
    staleTime: 1000 * 60 * 5,
  });
};

type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ queryConfig }: UseUsersOptions) => {
  // Suspense중심 아키텍처, 컴포넌트 내부에서 isLoading체크할 필요가 없어짐
  // 로딩 상태는 부모의 <Suspense>가 처리하므로 코드가 간결
  return useSuspenseQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
};
