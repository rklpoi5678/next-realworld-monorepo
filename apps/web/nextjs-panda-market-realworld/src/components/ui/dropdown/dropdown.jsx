'use client';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import DropdownArrow from '@/assets/icons/ic_dropdown_arrow.svg'
import MobileDropdownArrow from '@/assets/icons/ic_sort.svg'
import { cn } from '@/libs/cn';

const contents = [
  { title: '최신순', value: 'recent' },
  { title: '좋아요순', value: 'favorite' },
]

export function Dropdown() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [showPanel, setShowPanel] = useState(false);
  const [filterTitle, setFilterTitle] = useState('최신순');

  const handleOnClick = () => {
    setShowPanel(!showPanel);
  };

  const handleOnChange = useCallback((value) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set('orderBy', value)
    } else {
      params.delete('orderBy')
    }
    params.set('page', '1')

    const newTitle = contents.find(c => c.value === value)?.title || '최신순';
    setFilterTitle(newTitle);

    replace(`${pathname}?${params.toString()}`);
    setShowPanel(false);
  },
    [searchParams, pathname, replace]
  );

  return (
    <div className="relative">
      <button
        className={cn(
          'flex cursor-pointer items-center justify-center gap-6 rounded-xl border border-solid border-gray-200 bg-white px-2.25 py-2.25 text-nowrap',
          showPanel && 'bg-gray-200 transition-colors duration-500 ease-in',
        )}
        onClick={handleOnClick}
      >
        <p className='hidden md:block'>
          {filterTitle}
        </p>
        <Image
          className='hidden md:block'
          src={DropdownArrow}
          alt="dropdown-arrow"
          width={24} height={24}
          unoptimized
        />
        <Image
          className='block md:hidden'
          src={MobileDropdownArrow}
          alt='dropdown-arrow'
          width={24} height={24}
          unoptimized
        />
      </button>

      {showPanel && (
        <ul className="absolute z-2 mt-2 shrink-0 rounded-xl border border-solid border-gray-200 bg-white">
          {contents.map((c) => (
            <li key={c.title} className="font-pretendard cursor-point mt-0.5 flex h-10.5 w-31.25 shrink-0 items-center justify-center text-gray-800 text-lg leading-6.5">
              <button
                className="border-0 bg-white"
                onClick={() => handleOnChange(c.value)}
              >
                {c.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
