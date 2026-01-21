import Link from 'next/link'

import { FooterIcons } from './footer-icons';

export function Footer() {
  return (
    <section className='bg-gray-900'>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 shrink-0 justify-between py-4 xl:px-50 lg:px-6">
        <div className="flex flex-row items-center justify-around w-full">
          <p className="hidden md:block text-gray-400 text-center font-pretendard font-normal">@codeit - 2024</p>
          <div className="flex gap-7.5 md:gap-16 text-base font-normal font-pretendard text-center no-underline text-[#E5E7EB]">
            <Link className="text-base font-normal font-pretendard text-center no-underline text-[#E5E7EB]" href="./privacy">Privacy Policy</Link>
            <Link className="text-base font-normal font-pretendard text-center no-underline text-[#E5E7EB]" href="./faq">FAQ</Link>
          </div>
          <div className="flex gap-3 md:gap-7.5 items-center">
            <FooterIcons />
          </div>
        </div >
        <div className='px-24'>
          <p className="block md:hidden text-gray-400 text-left font-pretendard font-normal">@codeit - 2024</p>
        </div>
      </div >
    </section>
  );
}