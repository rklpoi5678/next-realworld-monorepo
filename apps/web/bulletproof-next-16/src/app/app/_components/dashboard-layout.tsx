'use client';

import { Folder, Home, PanelLeft, User2, Users } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';
import { useLogout, useUser } from '@/libs/auth';
import { cn } from '@/libs/utils/cn';

type SideNavigationItem = {
  name: string;
  to: string;
  icon: React.ElementType;
};

function Logo() {
  return (
    <Link className="flex items-center text-white" href={paths.home.getHref()}>
      <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
      <span className="ml-2 text-sm font-semibold text-white">Bulletproof Next</span>
    </Link>
  );
}

function NavLink({ item, isActive }: { item: SideNavigationItem; isActive: boolean }) {
  return (
    <NextLink
      href={item.to}
      className={cn(
        'group flex items-center rounded-md p-2 text-base font-medium transition-colors',
        'text-gray-300 hover:bg-gray-700 hover:text-white',
        isActive && 'bg-gray-900 text-white',
      )}
    >
      <item.icon
        className={cn('mr-4 size-6 shrink-0 text-gray-400 group-hover:text-gray-300')}
        aria-hidden="true"
      />
      {item.name}
    </NextLink>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const logout = useLogout({
    mutationConfig: {
      onSuccess: () => router.push(paths.auth.login.getHref(pathname)),
    },
  });

  const navigation: SideNavigationItem[] = [
    { name: 'Dashboard', to: paths.app.root.getHref(), icon: Home },
    { name: 'Discussions', to: paths.app.discussions.getHref(), icon: Folder },
    ...(user.data?.role === 'ADMIN'
      ? [{ name: 'Users', to: paths.app.users.getHref(), icon: Users }]
      : []),
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* 데스크탑 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-black sm:flex">
        <nav className="flex flex-col gap-4 px-2 py-4">
          <div className="flex h-16 items-center px-4">
            <Logo />
          </div>
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} isActive={pathname === item.to} />
            ))}
          </div>
        </nav>
      </aside>

      <div className="flex flex-col sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:h-16 sm:justify-end sm:border-0 sm:bg-transparent sm:px-6">
          {/* 모바일 드로어 메뉴 */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="size-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent side="left" className="w-60 bg-black pt-10 text-white">
              <nav className="grid gap-2 px-2">
                <div className="mb-4 px-4">
                  <Logo />
                </div>
                {navigation.map((item) => (
                  <NavLink key={item.name} item={item} isActive={pathname === item.to} />
                ))}
              </nav>
            </DrawerContent>
          </Drawer>

          {/* 유저 메뉴 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User2 className="size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push(paths.app.profile.getHref())}>
                Your Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => logout.mutate(undefined)}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}

/** error fallback component */
function Fallback({ error }: { error: Error }) {
  return (
    <div className="p-4 text-destructive">
      <h2 className="font-bold">Something went wrong:</h2>
      <pre className="text-sm">{error.message}</pre>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Layout>
      {/* key를 사용하여 페이지전환 시 에러 상태 초기화 */}
      <ErrorBoundary key={pathname} FallbackComponent={Fallback}>
        {children}
      </ErrorBoundary>
    </Layout>
  );
}
