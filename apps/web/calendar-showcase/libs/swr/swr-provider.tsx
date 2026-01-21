"use client"

import { SWRConfig } from 'swr'

// SWRProvider의 Props 타입
type SWRProviderProps = {
  children: React.ReactNode,
  // 서버에서 미리 가져온 초기 데이터담는 객체
  fallback: Record<string, unknown>
}

function SWRProvider({ children, fallback }: SWRProviderProps) {
  return (
    // 설정 객체를 value달속성전달
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const response = await fetch(url, {
            method: "GET",
            credentials: "include", // cookie/auth header => include
            cache: "no-store" //not use cache => WANT FRESH DATA
          });
          return response.json()
        },
        // ssr or ssg => initial-data in SWR cache
        fallback,
        // 브라우저 탭에 다시 포커스가 올때 자동으로 데이터 갱신 여부
        revalidateOnFocus: false, // 자동 갱신 비활
        // SWR cache 저장할 스토리지 지정
        provider: () => new Map(),
        // 메모리 내 MAP 객체를 사용하여 캐시 저장
        // 페이지 새로고침시 캐시 초기화
      }}
    >
      {/* 꽃 이 프로바이저 내 자식 들은 위 설정값 swr옵션을 공유 */}
      {children}
    </SWRConfig>
  )
}

export default SWRProvider