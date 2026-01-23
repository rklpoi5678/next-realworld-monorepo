import { MoveLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-4 text-center">
      <div className="space-y-6">
        {/* 시각적 요소를 추가하여 사용자 경험을 개선합니다. */}
        <h1 className="text-9xl font-black text-muted-foreground/20">404</h1>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Not Found
          </h2>
          <p className="mx-auto max-w-[400px] text-muted-foreground">
            Sorry, the page you are looking for does not exist.
          </p>
        </div>

        <div className="flex justify-center">
          <Link href={paths.home.getHref()} replace>
            <MoveLeft className="mr-2 size-4" />
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
