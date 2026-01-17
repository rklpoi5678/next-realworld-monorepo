import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/libs/api-client';
import { useUser } from '@/libs/auth';
import { MutationConfig } from '@/libs/react-query';

export const updateProfileInputSchema = z.object({
  email: z.string().trim().min(1, 'Required').email('Invalid email'),
  firstName: z.string().trim().min(1, 'Required'),
  lastName: z.string().trim().min(1, 'Required'),
  bio: z.string().default(''),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

export const updateProfile = ({ data }: { data: UpdateProfileInput }) => {
  return api.patch(`/users/profile`, data);
};

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({ mutationConfig }: UseUpdateProfileOptions = {}) => {
  const queryClient = useQueryClient();
  const { refetch: refetchUser } = useUser();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: updateProfile,
    onSuccess: async (...args) => {
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['user'] }), refetchUser()]);

      onSuccess?.(...args);
    },
  });
};
