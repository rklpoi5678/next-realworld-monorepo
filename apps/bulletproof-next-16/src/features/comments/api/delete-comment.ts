import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getInfiniteCommentsQueryOptions } from '@/features/comments/api/get-comments';
import { api } from '@/libs/api-client';
import { MutationConfig } from '@/libs/react-query';

export const deleteComment = ({ commentId }: { commentId: string }) => {
  return api.delete(`/comments/${commentId}`);
};

type UseDeleteCommentOptions = {
  discussionId: string;
  mutationConfig?: MutationConfig<typeof deleteComment>;
};

/** Custom Hook */
export const useDeleteComment = ({ discussionId, mutationConfig }: UseDeleteCommentOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteComment,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getInfiniteCommentsQueryOptions(discussionId).queryKey,
      });

      //사용자가 정의한 추가 후속 작업 실행
      onSuccess?.(...args);
    },
  });
};
