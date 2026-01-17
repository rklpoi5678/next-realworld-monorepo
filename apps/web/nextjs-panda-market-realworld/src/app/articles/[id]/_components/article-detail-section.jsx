import Image from "next/image"

import HeartIcon from '@/assets/icons/ic_heart.svg'
import { truncateDate } from "@/libs/utils/format"

import { ArticleTitleSection } from "./article-title-section"

export function ArticleDetailSection({ article }) {
  return (
    <section className="w-full items-center border-b border-solid border-gray-200 pb-4 mb-6">
      <ArticleTitleSection article={article} />
      <div className="flex items-center">
        <div className="flex content-baseline flex-wrap">
          <Image
            src={article.author?.userProfile?.photoUrl}
            alt="authorAvatar"
            className="rounded-[50%]"
            width={40}
            height={40}
          />
          <p className="content-center font-pretendard text-sm font-medium leading-6 ml-4">{article.author?.name}</p>
          <span className="content-center font-pretendard text-sm leading-6 ml-2">{truncateDate(article.author?.updatedAt, 10)}</span>
        </div>
        <div className="flex h-6 border border-dotted border-gray-200 mx-4 md:mx-8"></div>
        <button className="flex max-h-7 md:max-h-10 relative items-center gap-1 border border-solid border-gray-200 rounded-4xl bg-white cursor-pointer px-3 py-1">
          <div className="relative text-base w-6 h-6 md:w-8 md:h-8 shrink-0">
            <Image
              className="object-cover"
              fill
              src={HeartIcon}
              alt="heart-icon"
            />
          </div>
          <span className="font-pretendard font-medium leading-6.5 text-gray-500">
            123
          </span>
        </button>
      </div>
    </section >
  )
}
