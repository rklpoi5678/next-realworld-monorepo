import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/libs/api-client';
import { MutationConfig } from '@/libs/react-query';
import { Discussion } from '@/types/api';

import { getDiscussionQueryOptions } from './get-discussion';

export const updateDiscussionInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  public: z.boolean(),
});

export type UpdateDiscussionInput = z.infer<typeof updateDiscussionInputSchema>;

export const updateDiscussion = ({
  data,
  discussionId,
}: {
  data: UpdateDiscussionInput;
  discussionId: string;
}): Promise<{ data: Discussion }> => {
  return api.patch(`/discussions/${discussionId}`, data);
};

type UseUpdateDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof updateDiscussion>;
};

export const useUpdateDiscussion = ({ mutationConfig }: UseUpdateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: updateDiscussion,
    onSuccess: (response, ...args) => {
      const queryKey = getDiscussionQueryOptions(response.data.id).queryKey;

      // options1: 즉시 캐시 업데이트 (서버 응답 데이터로 로컬 캐시 갱신 - 가장 빠름)
      queryClient.setQueryData(queryKey, response);
      // option2: 관련 쿼리 무효화 (목록 페이지 등 연관된 데이터를 최신화)
      queryClient.invalidateQueries({
        queryKey: ['discussions'], // 전체 목록 갱신
      });

      onSuccess?.(response, ...args);
    },
  });
};
