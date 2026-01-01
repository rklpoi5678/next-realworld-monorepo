'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { paths } from '@/config/paths';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo');

  const isInternalUrl = (url: string) => {
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.origin === window.location.origin;
    } catch {
      return url.startsWith('/');
    }
  };

  return (
    <LoginForm
      onSuccess={() =>
        router.replace(
          redirectTo && isInternalUrl(decodeURIComponent(redirectTo))
            ? decodeURIComponent(redirectTo)
            : paths.app.dashboard.getHref(),
        )
      }
    />
  );
}
