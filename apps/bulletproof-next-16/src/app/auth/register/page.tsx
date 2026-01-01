'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { RegisterForm } from '@/features/auth/components/register-form';
import { useTeams } from '@/features/teams/api/get-teams';

function RegisterPageContent() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [chooseTeam, setChooseTeam] = useState(false);

  const { data: teamQueryData } = useTeams({
    queryConfig: {
      enabled: chooseTeam,
    },
  });

  const handleSuccess = () => {
    const targetPath = redirectTo ? decodeURIComponent(redirectTo) : paths.app.dashboard.getHref();
    router.replace(targetPath);
  };

  return (
    <RegisterForm
      onSuccess={handleSuccess}
      chooseTeam={chooseTeam}
      setChooseTeam={() => setChooseTeam((prev) => !prev)}
      teams={teamQueryData?.data}
    />
  );
}

/** useSearchParams 사용  시 Suspense */
export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex size-full items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
