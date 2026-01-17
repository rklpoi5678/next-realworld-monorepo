import type { Metadata } from 'next';

import { DashboardLayout } from './_components/dashboard-layout';

export const metadata: Metadata = {
  title: 'Dashboard | Bulletproof Next',
  description: 'Manage your discussions and users',
};

/** 
 * Server Component
 * 이 컴포넌트는 서버에서 실행 SEO와 초기 레이아웃 구조 담당
 * 클라이언트 로직은 DashboardLayout 내부에서 처리
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
