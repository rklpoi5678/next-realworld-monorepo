import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

import { Discussion } from '@/app/app/discussions/[discussionId]/_components/discussion';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import {
  getDiscussion,
  getDiscussionQueryOptions,
} from '@/features/discussions/api/get-discussion';

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
        },
      },
    }),
);

/** Next.js 16 Metadata 생성 */
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ discussionId: string }>;
}) => {
  const { discussionId } = await params;
  const discussion = await getDiscussion({ discussionId });

  return {
    title: discussion.data?.title ?? 'Discussion',
    description: discussion.data?.body?.slice(0, 160) ?? 'View discussion details',
  };
};

/** 데이터 프리패칭 */
const preloadData = async (discussionId: string) => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getDiscussionQueryOptions(discussionId)),
    queryClient.prefetchInfiniteQuery(getInfiniteCommentsQueryOptions(discussionId)),
  ]);

  return dehydrate(queryClient);
};

/** 메인  페이지 컴포넌트*/
export default async function PublicDiscussionPage({
  params,
}: {
  params: Promise<{ discussionId: string }>;
}) {
  const { discussionId } = await params;

  const dehydratedState = await preloadData(discussionId);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="container  mx-auto  p-4">
        <Discussion discussionId={discussionId} />
      </main>
    </HydrationBoundary>
  );
}
