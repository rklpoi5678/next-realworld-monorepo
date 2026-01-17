"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import PandaLogo from '@/assets/logo.svg'
import { cn } from '@/libs/cn';
import { useAuth } from '@/providers/auth-provider'
import { paths } from '#/config/paths'

import { Avatar } from '../avatar/avatar'

const navLink = [
  { name: '자유게시판', href: '/articles' },
  { name: '중고마켓', href: '/items' }
]

export function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="container mx-auto w-full max-w-600 h-17.5">
      <div className="flex justify-between items-center h-full py-0 my-0 mx-auto border-b border-solid border-gray-300 gap-0 xl:gap-3">
        <div className="inline-flex items-center px-4 md:px-6 xl:px-50">
          <div className='flex items-center gap-2 ml-6 md:ml-0'>
            <Link
              className="relative w-10 h-10"
              href={paths.home.getHref()}>
              <Image
                className="mr-1.5 object-fit"
                fill
                src={PandaLogo}
                alt="panda-market"
                unoptimized
                priority
              />
            </Link>
            <p className='font-rokaf text-[1.2626rem] md:text-[1.6021rem] font-bold text-primary-100 text-nowrap'>판다마켓</p>
          </div>
          <nav className="flex gap-2 md:gap-3.75 pl-2 md:pl-6">
            {navLink.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-gray-600 font-pretendard text-lg font-bold leading-6.5 no-underline text-nowrap',
                  pathname.startsWith(link.href) && 'text-primary-100'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        {user ? (
          <div className='flex items-center gap-1.5 px-4 md:px-6 xl:px-50'>
            <Avatar size='medium' alt="유저 이미지" />
            <p className='text-gray-600 text-lg'>{user.data.name}</p>
          </div>
        ) : (
          <Link className="bg-primary-100 text-white px-3 py-1.75 rounded-lg text-nowrap mr-4 md:mr-0" href="/login">로그인</Link>
        )}
      </div >
    </nav >
  );
}