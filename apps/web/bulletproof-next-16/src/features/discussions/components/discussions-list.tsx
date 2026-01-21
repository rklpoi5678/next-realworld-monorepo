'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { Link } from '@/components/ui/link';
import { Spinner } from '@/components/ui/spinner';
import { Table } from '@/components/ui/table';
import { paths } from '@/config/paths';
import { formatDate } from '@/libs/utils/format';

import { DeleteDiscussion } from './delete-discussion';
import { getDiscussionQueryOptions } from '../api/get-discussion';
import { useDiscussions } from '../api/get-discussions';

export type DiscussionsListProps = {
  onDiscussionPrefetch?: (id: string) => void;
};

export const DiscussionList = ({ onDiscussionPrefetch }: DiscussionsListProps) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // URLSearchParams에서 페이지 번호 추출
  const page = Number(searchParams?.get('page') || '1');

  // Discussions 데이터조회
  const discussionsQuery = useDiscussions({
    page,
  });

  if (discussionsQuery.isPending && !discussionsQuery.isPlaceholderData) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const discussions = discussionsQuery.data?.data;
  const meta = discussionsQuery.data?.meta;

  if (!discussions) return null;

  return (
    <div className="relative">
      {/* 페이지 이동(백그라운드 패칭)일 때 인디케이더 대용 스피너 컴포넌트 */}
      {discussionsQuery.isFetching && discussionsQuery.isPlaceholderData && (
        <div className="absolute right-0 top-0 pr-4 pt-2">
          <Spinner size="sm" />
        </div>
      )}

      <Table
        data={discussions}
        columns={[
          {
            title: 'Title',
            field: 'title',
            Cell({ entry: { title, id } }) {
              return (
                <Link
                  href={paths.app.discussion.getHref(id)}
                  className="font-medium text-slate-900 hover:underline"
                  onMouseEnter={() => {
                    // 호버시 상세 데이터 미리 가져오기
                    queryClient.prefetchQuery(getDiscussionQueryOptions(id));
                    onDiscussionPrefetch?.(id);
                  }}
                >
                  {title}
                </Link>
              );
            },
          },
          {
            title: 'Created At',
            field: 'createdAt',
            Cell({ entry: { createdAt } }) {
              return (
                <span className="whitespace-nowrap text-slate-500">{formatDate(createdAt)}</span>
              );
            },
          },
          {
            title: '',
            field: 'id',
            Cell({ entry: { id } }) {
              return (
                <div className="flex justify-end gap-2">
                  <Link href={paths.app.discussion.getHref(id)}>View</Link>
                  <DeleteDiscussion id={id} />
                </div>
              );
            },
          },
        ]}
        pagination={
          meta && {
            totalPages: meta.totalPages,
            currentPage: meta.page,
            rootUrl: '',
          }
        }
      />
    </div>
  );
};
