'use client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MainErrorFallback } from '@/components/error/main';
import { Spinner } from '@/components/ui/spinner';

import { AuthLayout as AuthLayoutComponent } from './auth-layout';

export function AuthClientLayout({ children }: { children: React.ReactNode }) {
  return (
    /** 서버 컴포넌트들이 데이터를 불러오는 동안 Spinner를 보여줍니다. */
    <Suspense
      fallback={
        <div className="flex size-full items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      {/* MainErrorFallback을 재사용해 일관된 에러 UI를 제공 */}
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <AuthLayoutComponent>
          <main className="flex-1">{children}</main>
        </AuthLayoutComponent>
      </ErrorBoundary>
    </Suspense>
  );
}
