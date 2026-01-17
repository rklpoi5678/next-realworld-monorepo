import type { Metadata } from 'next';

import { AuthClientLayout } from './_components/auth-client-layout';

export const metadata: Metadata = {
  title: 'Auth | Bulletproof Next',
  description: 'Welcome to Bulletproof Next',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthClientLayout>{children}</AuthClientLayout>;
}
