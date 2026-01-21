"use client"

import useSWR from "swr"

import { API_ENDPOINTS } from "#/constant/api"

export const useUser = () => {
  const {data, error, isLoading, mutate} = useSWR(
    // endpoint로 서버에 요청을 보내 사용자 정보 가온다.
    API_ENDPOINTS.CURRENT_USER,
    // useSWR 옵션을 통해 불필요한 네트워크 요청을 줄이고 네트워크 환경 변화에 유연하게 할려고 설정
    {
      revalidateOnFocus:     false,     // 포커스 시 재검증 비활
      revalidateOnReconnect: true,      // 네트워크 재연결 시 재검증 
      revalidateIfStale:     false,     // 오래된 네트워크 자동 재검증 비활성화
      dedupingInterval:      60000,     // 1분 동안 중복 요청  방지 
      errorRetryCount:       3,         // 에러 시 3번까지 재시도
      errorRetryInterval:    5000,      // 에러 시 재시도 간격 5초
      shouldRetryOnError:    false,     // 401, 403 등의 에러는 재시도 하지않음
      focusThrottleInterval:  5000,      // 포커스 이벤트 쓰로틀링 (5초)
    }
  );

  // 받아온 데이터 객체에서 실제 사용자 정보만 추출한다. ({user:{...}} 형태라고 가정)
  const user = data?.user;

  return {
    userResponse: data,    // API로 부터 받은 원본 데이터 전체
    user,                  // 추출된 사용자 객치
    error,                 // 요청 중 발생한 에러 정보
    isLoggedIn: !!user,    // 사용자가 로그인 상태인지 여부를 불리언 값으로 반환반환
    isLoading,             // 데이터 로딩 중인지 여부
    mutate,                // 캐시된 데이터를 갱신수동으로 갱신(업데이트)할 수 있는 함수
  };
}