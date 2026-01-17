'use client';

import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/libs/auth';
import { policies } from '@/libs/authorization';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();

  // 로딩 상태 처리
  if (user.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  // 인증되지 않은 사용자 처리
  if (!user.data) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Please log in to access this content.
      </div>
    );
  }

  // 권한 부족 처리
  if (!policies['user:view']) {
    return (
      <div className="m-4 flex flex-col items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-destructive">
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-sm">Only administrators have permission to view this page.</p>
      </div>
    );
  }

  // 권한 확인 완료시 자식 컴포넌트 렌더링
  return <>{children}</>;
};
