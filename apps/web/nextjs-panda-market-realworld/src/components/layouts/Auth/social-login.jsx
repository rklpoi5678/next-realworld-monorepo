import Image from 'next/image';
import Link from 'next/link';

import GoogleIcon from "@/assets/icons/ic_google.svg"
import KaKaoIcon from "@/assets/icons/ic_kakao.svg"

export function SocialLogin() {
  return (
    <div className="flex font-pretendard text-base/relaxed font-medium w-160 py-4 px-6 m-0 justify-between items-center bg-[#E6F2FF] gap-4.5">
      <p className='text-gray-800'>간편 로그인하기</p>
      <ul className="flex gap-4">
        <li className='relative w-10.5 h-10.5'>
          <Link
            href="https://www.google.com">
            <Image
              className='bg-white rounded-full p-2.5'
              src={GoogleIcon}
              alt='google'
              fill
            />
          </Link>
        </li>
        <li className='relative w-10.5 h-10.5'>
          <Link href="https://www.kakaocorp.com/page/">
            <Image
              className='bg-[#F5E14B] rounded-full p-2.5'
              src={KaKaoIcon}
              alt='kakao'
              fill
            />
          </Link>
        </li>
      </ul>
    </div>
  )
}