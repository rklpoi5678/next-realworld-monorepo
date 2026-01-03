import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import {
  getDiscussion,
  getDiscussionQueryOptions,
} from '@/features/discussions/api/get-discussion';

import { Discussion } from './_components/discussion';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ discussionId: string }>;
}) => {
  const { discussionId } = await params;

  try {
    const { data } = await getDiscussion({ discussionId });
    return {
      title: data.title,
      description: data.body?.substring(0, 160), // 본문 일부를 설명으로
    };
  } catch {
    return { title: 'Discussion Not Found' };
  }
};

export default async function DiscussionPage({
  params,
}: {
  params: Promise<{ discussionId: string }>;
}) {
  const { discussionId } = await params;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5분간 신선도 유지
      },
    },
  });

  await Promise.all([
    queryClient.prefetchQuery(getDiscussionQueryOptions(discussionId)),
    queryClient.prefetchInfiniteQuery(getInfiniteCommentsQueryOptions(discussionId)),
  ]);

  const discussion = queryClient.getQueryData(getDiscussionQueryOptions(discussionId).queryKey);

  if (!discussion?.data) {
    notFound();
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Discussion discussionId={discussionId} />
    </HydrationBoundary>
  );
}
