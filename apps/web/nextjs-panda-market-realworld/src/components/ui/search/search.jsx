"use client"
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import SearchIcon from '@/assets/icons/ic_searchs.svg'

export function Search({ placeholder }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // TODOS: 디바운싱
  function handleSearch(term) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('keyword', term)
    } else {
      params.delete('keyword');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full items-center relative">
      <label
        className='absolute block ml-3 z-1 text-gray-400'
        htmlFor="search">
        <Image
          src={SearchIcon}
          alt="search-icon"
          unoptimized
        />
      </label>
      <input
        className='py-2.25 pr-5 pb-2.25 pl-10 w-full bg-gray-100 text-gray-500 font-pretendard leading-6.5 text-lg rounded-xl border-none focus:text-gray-950'
        id='search'
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('keyword')?.toString()}
      />
    </div>
  )
}