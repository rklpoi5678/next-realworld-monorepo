'use client';

import { LinkIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Link } from '@/components/ui/link';
import { MdPreview } from '@/components/ui/md-preview';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { formatDate } from '@/libs/utils/format';

import { UpdateDiscussion } from './update-discussion';
import { useDiscussion } from '../api/get-discussion';

export const DiscussionView = ({ discussionId }: { discussionId: string }) => {
  const pathname = usePathname();
  // 공용 뷰 여부 판별
  const isPublicView = pathname?.startsWith('/public/');
  const { data, isPending } = useDiscussion({
    discussionId,
  });

  if (isPending) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const discussion = data?.data;

  if (!discussion) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            {formatDate(discussion.createdAt)}
          </span>
          {discussion.author && (
            <span className="text-sm font-bold text-slate-900">
              by {discussion.author.firstName} {discussion.author.lastName}
            </span>
          )}
        </div>

        {/* 퍼블릭 버전 링크: 현재 페이지가 프라이빗 앱 내부에 있을 때만 표시 */}
        {!isPublicView && discussion.public && (
          <Link
            className="flex items-center gap-2"
            href={paths.public.discussion.getHref(discussionId)}
            target="_blank"
          >
            View Public Version <LinkIcon className="size-4" />
          </Link>
        )}
      </div>

      <div className="flex flex-col space-y-8">
        {!isPublicView && (
          <div className="flex justify-end">
            <UpdateDiscussion discussionId={discussionId} />
          </div>
        )}

        <article className="overflow-hidden bg-white shadow sm:rounded-lg border border-slate-200">
          <div className="px-4 py-6 sm:px-6">
            <div className="prose prose-slate max-w-none">
              <MdPreview value={discussion.body} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
