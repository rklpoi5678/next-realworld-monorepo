import Image from "next/image"
import Link from "next/link"

import Undo from '@/assets/icons/ic_undo.svg'
import { paths } from '#/config/paths'

export function BackToItems() {
  return (
    <Link
      className="flex self-center items-center justify-center w-62 h-12 py-3 px-16 mt-16 mb-48.5 rounded-[2.5rem] bg-primary-100 gap-2 no-underline active:bg-primary-100"
      href={paths.app.items.getHref()}
    >
      <p className="font-pretendard text-base font-semibold leading-6.5 text-white text-nowrap">
        목록으로 돌아가기
      </p>
      <Image
        src={Undo}
        alt="undo-img"
        width={24} height={24}
        unoptimized
      />
    </Link>
  )
}
