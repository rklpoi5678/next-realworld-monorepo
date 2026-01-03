import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import { getDiscussionsQueryOptions } from '@/features/discussions/api/get-discussions';

import { Discussions } from './_components/discussions';

export const metadata: Metadata = {
  title: 'Discussion',
  description: 'View and manage community discussions',
};

export default async function DiscussionPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page =
    typeof resolvedSearchParams.page === 'string' ? Number(resolvedSearchParams.page) : 1;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, //서버에서 패치한 데이터가 즉시 stale해지는 것을 방지
      },
    },
  });

  await queryClient.prefetchQuery(getDiscussionsQueryOptions({ page }));

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Discussions />
    </HydrationBoundary>
  );
}
