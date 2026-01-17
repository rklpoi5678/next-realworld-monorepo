import Link from 'next/link';

import { AuthTitle } from '@/components/layouts/Auth/auth-title';
import { SocialLogin } from '@/components/layouts/Auth/social-login';
import { paths } from '#/config/paths';

import { LoginForm } from './login-form';

export default function LoginView() {
  return (
    <>
      <AuthTitle />

      <LoginForm />

      <SocialLogin />

      <div className='flex justify-center items-center gap-1 mb-52.25'>
        <p className="flex font-pretendard text-sm/normal font-medium gap-4 mt-6 text-gray-800">
          판다마켓이 처음이신가요?
        </p>
        <Link className="flex font-pretendard text-sm/normal font-medium gap-4 mt-6 text-primary-100" href={paths.auth.signup.getHref()}>
          회원가입
        </Link>
      </div>
    </>
  );
}