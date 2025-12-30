'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/error/main';
import { Notifications } from '@/components/ui/notifications/notifications';
import { config } from '@/config/env';
import { queryConfig } from '@/libs/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  // QueryClient Singleton 클라이언트 사이드에서 한번만 실행되게 보장
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    // 에러 바운티로 전체 앱의 런타임 에러 포착
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {config.NODE_ENV === 'development' && 'test' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        {/* 전역 알림 */}
        <Notifications />
        {/* 앱 콘텐츠 */}
        {children}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
