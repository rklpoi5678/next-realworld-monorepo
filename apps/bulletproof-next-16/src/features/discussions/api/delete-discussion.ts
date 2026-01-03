import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/api-client';
import { MutationConfig } from '@/libs/react-query';

import { getDiscussionsQueryOptions } from './get-discussions';

export const deleteDiscussion = ({ discussionId }: { discussionId: string }) => {
  return api.delete(`/discussions/${discussionId}`);
};

type UseDeleteDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof deleteDiscussion>;
};

/* Custom Hook */
export const useDeleteDiscussion = ({ mutationConfig }: UseDeleteDiscussionOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteDiscussion,
    onSuccess: (...args) => {
      // 토론 목록 쿼리를 무효화하여 삭제된 항목이 목록에서 즉시 사라지게 합니다.
      // getDiscussionsQueryOptions().queryKey는 ['discussions']를 포함하므로
      // 모든 페이지의 목록 캐시가 갱신
      queryClient.invalidateQueries({
        queryKey: getDiscussionsQueryOptions().queryKey,
      });

      // 추가로 정의된 onSuccess 콜백 실행 (예: 알림 표시, 페이지 이동 등)
      onSuccess?.(...args);
    },
  });
};
