import { UseMutationOptions, DefaultOptions } from '@tanstack/react-query';

/** 전역 쿼리 설정 */
export const queryConfig = {
  queries: {
    // 윈도우 포커스 시 자동으로 데이터를 다시 가져오지 않도록 설정
    refetchOnWindowFocus: false,
    // 실패 시 자동 재시도를 끄고, 에러 핸들링 직접 제어
    retry: false,
    // 데이터 1분 동안은 'fresh'한 상태로 유지되도록
    staleTime: 1000 * 60,
    // 에러 발생 시 가장 가까운 ErrorBoundary로 전파할지 여부
    throwOnError: false,
  },
} satisfies DefaultOptions;

/**
 * Api 함수의 반환 타입을 자동으로 추론해주는 유틸리티 타입
 * Promise의 결과값을 Awaited를 통해 추출한다.
 */
export type ApiFnReturnType<FnType extends (...args: never[]) => Promise<unknown>> = Awaited<
  ReturnType<FnType>
>;

/** useMutation의 옵션을 정의할때 사용 */
export type MutationConfig<MutationFnType extends (...args: never[]) => Promise<unknown>> =
  // TData:성공시 반환하는 데이터
  // Error:에러 타입
  // TVariables: 뮤테이션 함수에 전달되는 인자 타입
  UseMutationOptions<
    ApiFnReturnType<MutationFnType>, // TData
    Error, // TError
    Parameters<MutationFnType>[0] // TVariables
  >;
