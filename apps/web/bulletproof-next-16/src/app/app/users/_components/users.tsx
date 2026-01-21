import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

import { UsersList } from '@/features/users/components/users-list';
import { getUserQueryOptions } from '@/libs/auth';

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    }),
);

export const Users = async () => {
  const queryClient = getQueryClient();

  // prefetch: 미리데이터를 가져와 캐시에 저장
  await queryClient.prefetchQuery(getUserQueryOptions());

  // dehydrate: 캐시된 상태를 직렬화 가능한 형태로 변환합니다.
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UsersList />
    </HydrationBoundary>
  );
};
