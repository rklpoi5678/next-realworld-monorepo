import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/libs/api-client';
import { MutationConfig } from '@/libs/react-query';

import { getUsersQueryOptions } from './get-users';

export const deleteUser = ({ userId }: { userId: string }) => {
  return api.post(`users/${userId}`);
};

export const useDeleteUser = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof deleteUser>;
}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteUser,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUsersQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
  });
};
