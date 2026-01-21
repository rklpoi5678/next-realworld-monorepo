import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

import { getUserQueryOptions } from '@/libs/auth';

import { AppProvider } from './provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bulletproof Next',
  description: 'Showcasing Best Practices For Building Next.js Applications',
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /** 서버 전용 QueryClient 생성 */
  const queryClient = new QueryClient({
    defaultOptions: {
      // SSR에서 클라이언트에서 즉시 stale 처리되지 않도록 시간 조절
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });

  /**
   * 프리패칭 (인증 정보 등의 전역데이터)
   * 유저 정보를 서버에서 미리 가져와서 클라이언트 전달(Hydration)
   */
  try {
    await queryClient.prefetchQuery(getUserQueryOptions());
  } catch (error) {
    console.error('Prefetch Error:', error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className={'antialiased'}>
        <AppProvider>
          <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
        </AppProvider>
      </body>
    </html>
  );
}

// 동적 데이터 기반 앱명시
export const dynamic = 'force-dynamic';
