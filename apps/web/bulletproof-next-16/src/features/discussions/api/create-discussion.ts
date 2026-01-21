import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/libs/api-client';
import { MutationConfig } from '@/libs/react-query';
import { Discussion } from '@/types/api';

import { getDiscussionsQueryOptions } from './get-discussions';

export const createDiscussionInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Body is required'),
  public: z.boolean().default(false),
});

export type createDiscussionInput = z.infer<typeof createDiscussionInputSchema>;

export const createDiscussion = ({
  data,
}: {
  data: createDiscussionInput;
}): Promise<Discussion> => {
  return api.post('/discussions', data);
};

type UseCreateDiscussionOptions = {
  mutationConfig?: MutationConfig<typeof createDiscussion>;
};

export const useCreateDiscussion = ({ mutationConfig }: UseCreateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createDiscussion,
    onSuccess: (...args) => {
      // invalidate: Discussions list를 최신 상태로 갱신
      queryClient.invalidateQueries({
        queryKey: ['discussions'],
      });
      // User가 전달한 추가 onSuccess Callback 실행
      onSuccess?.(...args);
    },
  });
};
