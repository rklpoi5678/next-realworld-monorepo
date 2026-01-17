import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { MutationConfig, QueryConfig } from '@/libs/react-query';
import { AuthResponse, User } from '@/types/api';

import { api } from './api-client';

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features

export const getUser = async (): Promise<User> => {
  return api.get('/auth/me');
};

export const logout = (): Promise<void> => {
  return api.post('/auth/logout');
};

const loginWithEmailAndPassword = (data: LoginInput): Promise<AuthResponse> => {
  return api.post('/auth/login', data);
};

const registerWithEmailAndPassword = (data: RegisterInput): Promise<AuthResponse> => {
  return api.post('/auth/register', data);
};

const userQueryKey = ['user'] as const;

export const getUserQueryOptions = () => {
  return queryOptions({
    queryKey: userQueryKey,
    queryFn: getUser,
  });
};

// React Query Hooks
export const useUser = (options?: QueryConfig<typeof getUserQueryOptions>) => {
  return useQuery({
    ...getUserQueryOptions(),
    ...options,
  });
};

type UseLoginOptions = {
  mutationConfig?: MutationConfig<typeof loginWithEmailAndPassword>;
};

export const useLogin = ({ mutationConfig }: UseLoginOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: loginWithEmailAndPassword,
    onSuccess: (data, ...args) => {
      // 캐시 업데이트: 로그인이 성공하면 유저 정보를 즉시 주입
      queryClient.setQueryData(userQueryKey, data.user);
      mutationConfig?.onSuccess?.(data, ...args);
    },
  });
};

type UseRegisterOptions = {
  mutationConfig?: MutationConfig<typeof registerWithEmailAndPassword>;
};

export const useRegister = ({ mutationConfig }: UseRegisterOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: registerWithEmailAndPassword,
    onSuccess: (data, ...args) => {
      queryClient.setQueryData(userQueryKey, data.user);
      mutationConfig?.onSuccess?.(data, ...args);
    },
  });
};

type UseLogoutOptions = {
  mutationConfig?: MutationConfig<typeof logout>;
};

export const useLogout = ({ mutationConfig }: UseLogoutOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: logout,
    onSuccess: (...args) => {
      // 로그아웃 시 관련 쿼리 모두 제거
      queryClient.removeQueries({ queryKey: userQueryKey });
      mutationConfig?.onSuccess?.(...args);
    },
  });
};

// Schemas & Types
export const loginInputSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('유효한 이메일 형식이 아닙니다.'),
  password: z.string().min(5, '비밀번호는 최소 5자 이상이어야 합니다.'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z
  .object({
    email: z.string().min(1, '이메일을 입력해주세요.'),
    firstName: z.string().min(1, '이름을 입력해주세요.'),
    lastName: z.string().min(1, '성을 입력해주세요.'),
    password: z.string().min(5, '비밀번호는 최소 5자 이상이어야 합니다.'),
  })
  .and(
    z.union([
      z.object({
        teamId: z.string().min(1, '팀 ID가 필요합니다.'),
        teamName: z.null().default(null),
      }),
      z.object({
        teamName: z.string().min(1, '팀 이름을 입력해주세요.'),
        teamId: z.null().default(null),
      }),
    ]),
  );

export type RegisterInput = z.infer<typeof registerInputSchema>;
