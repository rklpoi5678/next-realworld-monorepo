'use client';

import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { paths } from '@/config/paths';
import { useLogin, loginInputSchema } from '@/libs/auth';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({
    mutationConfig: {
      onSuccess,
    },
  });

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div className="space-y-6">
      <Form
        onSubmit={(values) => {
          login.mutate(values);
        }}
        schema={loginInputSchema}
        // 2. 폼 내부에서 필요한 경우 useForm 스킨을 직접 제어할 수 있도록 옵션 제공 가능
        options={{
          defaultValues: {
            email: '',
            password: '',
          },
        }}
      >
        {({ register, formState }) => (
          <div className="space-y-4">
            <Input
              type="email"
              label="Email"
              error={formState.errors['email']}
              registration={register('email')}
              placeholder="example@email.com"
            />
            <Input
              type="password"
              label="Password"
              error={formState.errors['password']}
              registration={register('password')}
              placeholder="••••••••"
            />

            <div className="pt-2">
              <Button
                // v5에서는 isLoading 대신 isPending을 사용합니다.
                isLoading={login.isPending}
                type="submit"
                className="w-full"
                size="lg"
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </Form>

      <div className="flex items-center justify-center border-t border-border pt-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Don't have an account?</span>
          <NextLink
            href={paths.auth.register.getHref(redirectTo ?? undefined)}
            className="font-semibold text-primary hover:underline hover:underline-offset-4"
          >
            Register
          </NextLink>
        </div>
      </div>
    </div>
  );
};
