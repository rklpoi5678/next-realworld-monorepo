'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';
import { useUser } from '@/libs/auth';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLoginPage = pathname === paths.auth.login.getHref();
  const title = isLoginPage ? 'Log in to your account' : 'Register your account';

  const redirectTo = searchParams.get('redirectTo');

  // 로그인된 상태라면 대시보드/ 리다이렉트 경로로 이동시킨다.
  useEffect(() => {
    if (user.data) {
      let destination = paths.app.root.getHref();
      if (redirectTo) {
        const decoded = decodeURIComponent(redirectTo);
        // 상대 경로만 허용 외부 URL 리다이렉트 방지
        if (decoded.startsWith('/') && !decoded.startsWith('//')) {
          destination = decoded;
        }
      }
      router.replace(destination);
    }
  }, [user.data, router, redirectTo]);

  if (user.data) return null;

  return (
    <div className="flex min-h-svh flex-col justify-center bg-muted/30 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href={paths.home.getHref()} className="transition-opacity hover:opacity-80">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={96}
              height={96}
              priority
              className="h-24 w-auto"
            />
          </Link>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border-border bg-card px-4 py-8 shadow-sm sm:rounded-lg sm:border sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
