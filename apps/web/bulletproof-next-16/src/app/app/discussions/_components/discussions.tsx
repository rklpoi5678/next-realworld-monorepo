'use client';

import { useQueryClient } from '@tanstack/react-query';

import { ContentLayout } from '@/components/layout/content-layout';
import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { CreateDiscussion } from '@/features/discussions/components/create-discussion';
import { DiscussionList } from '@/features/discussions/components/discussions-list';

export const Discussions = () => {
  const queryClient = useQueryClient();

  return (
    <ContentLayout>
      <div className="flex justify-end">
        <CreateDiscussion />
      </div>
      <div className="mt-4">
        <DiscussionList
          onDiscussionPrefetch={(id) => {
            queryClient.prefetchInfiniteQuery(getInfiniteCommentsQueryOptions(id));
          }}
        />
      </div>
    </ContentLayout>
  );
};
