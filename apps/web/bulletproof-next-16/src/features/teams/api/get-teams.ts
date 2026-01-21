import { queryOptions, useQuery, type UseQueryResult } from '@tanstack/react-query';

import { api } from '@/libs/api-client';
import { QueryConfig } from '@/libs/react-query';
import { Team } from '@/types/api';

export const getTeams = (): Promise<{ data: Team[] }> => {
  return api.get('/teams');
};

type UseTeamsOptions = {
  queryConfig?: QueryConfig<typeof getTeamsQueryOptions>;
};

export const getTeamsQueryOptions = () => {
  return queryOptions({
    queryKey: ['teams'],
    queryFn: getTeams,
  });
};

/** React Compiler가 훅의 의존성을 더 잘 파악하도록 구조화*/
export const useTeams = ({ queryConfig = {} }: UseTeamsOptions = {}): UseQueryResult<{
  data: Team[];
}> => {
  return useQuery({
    ...getTeamsQueryOptions(),
    ...queryConfig,
  });
};
