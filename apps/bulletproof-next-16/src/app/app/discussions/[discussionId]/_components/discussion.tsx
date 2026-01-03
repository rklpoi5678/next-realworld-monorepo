'use client';

import { ErrorBoundary } from 'react-error-boundary';

import { ContentLayout } from '@/components/layout/content-layout';
import { Button } from '@/components/ui/button';
import { useDiscussion } from '@/features/discussions/api/get-discussion';

export const Discussion = ({ discussionId }: { discussionId: string }) => {
  const { data: discussion, isPending } = useDiscussion({ discussionId });

  if (!discussion?.data && !isPending) {
    return (
      <ContentLayout title="Discussion Not Found">
        <div className="text-center py-12">
          <p>The discussion you are looking for does not exist.</p>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={discussion?.data?.title}>
      {/* 상세 내용 뷰 */}
      <div className="mt-8">
        {/* 댓글 섹션 에러 경계 */}
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
              <p className="font-semibold">Failed to load comments.</p>
              <p className="text-sm mb-4">{error.message}</p>
              <Button size="sm" onClick={() => resetErrorBoundary()}>
                Try again
              </Button>
            </div>
          )}
        ></ErrorBoundary>
      </div>
    </ContentLayout>
  );
};
