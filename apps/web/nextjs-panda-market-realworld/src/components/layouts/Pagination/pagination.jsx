"use client"
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ChevronLeft from '@/assets/layout/ic_chevron_left.svg'
import ChevronRight from '@/assets/layout/ic_chevron_right.svg'
import { cn } from '@/libs/cn';
/**
 * @see https://www.notion.so/Pagination-jsx-26f856d064408013b3eef306e810566e?source=copy_link
 */
export function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const MAX_VISIBLE = 5;
  const half = Math.floor(MAX_VISIBLE / 2);

  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, startPage + MAX_VISIBLE - 1);

  // 페이지 끝에 가까울 때 startPage 조정합니다.
  // endPage가 totalPages를 넘으면 조정
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - MAX_VISIBLE + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    // 현재 searchParams를 복사
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString());
    // URL을 변경하여 페이지 리렌더 (RSC용 리패칭)
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center mt-11 mb-32.5 gap-1">
      <button
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-500 cursor-pointer rounded-4xl transition-all hover:border-primary-100 active:bg-primary-100"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Image
          src={ChevronLeft}
          alt="페이지전환 왼쪽 화살표"
          width={3.5}
          height={7}
          strokeWidth={1.8}
        />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={cn(
            'flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-500 cursor-pointer rounded-4xl transition-all hover:border-primary-100 active:bg-primary-100',
            page === currentPage && "bg-primary-100 text-white")}
        >
          {page}
        </button>
      ))}

      <button
        className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-500 cursor-pointer rounded-4xl transition-all hover:border-primary-100 active:bg-primary-100"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Image
          src={ChevronRight}
          alt='페이지 전환 오른쪽 화살표'
          width={3.5}
          height={7}
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}