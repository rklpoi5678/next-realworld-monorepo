import Image from "next/image";
import Link from "next/link";

import Badge from '@/assets/icons/ic_medal.svg'
import DefaultImg from '@/assets/logo.svg'
import { cn } from "@/libs/cn";
import { formatDate, truncateText } from "@/libs/utils/format";


export function ArticleBestSection({ articles }) {
  const imageSource = articles.images?.[0] || DefaultImg;
  return (
    <section className="mb-12">
      <h2 className="font-pretendard text-xl font-bold mb-6 text-gray-900">베스트 게시글</h2>
      <div className="flex max-w-full my-0 mx-auto gap-6">
        {articles.map((article, index) => (
          <Link
            href={`articles/${article.id}`}
            key={article.id}
            // 1개 일때 모두숨기고 하나씩 보여주기 
            className={cn("relative flex flex-col justify-center items-center flex-1 w-96 h-48.5 py-0 px-6 rounded-lg overflow-hidden bg-gray-50 text-gray-900 cursor-pointer duration-200 no-underline hover: translate-y-[-4px]",
              index >= 1 && "hidden",
              index === 1 && "md:flex",
              index === 2 && "xl:flex"
            )}
          >
            <div className="absolute top-0 left-[6%] flex items-center justify-center gap-1 w-25.5 py-0.5 px-6 bg-primary-100 rounded-tr-none rounded-tl-none rounded-b-2xl rounded-l-2xl">
              <Image
                src={Badge}
                alt="Best-Badge"
                width={16}
                height={16}
              />
              <p className="font-pretendard font-semibold  leading-6.5 text-white">Best</p>
            </div>
            <div className="flex flex-row-reverse w-full justify-between gap-2 mt-4">
              <div className="flex w-18 h-18 px-3.5 py-3 bg-white border border-solid border-gray-200">
                <Image
                  src={imageSource}
                  alt="썸네일"
                  width={48}
                  height={44.571}
                />
              </div>
              <p className="font-pretendard text-xl font-semibold text-gray-800 mb-1.5 ">
                {truncateText(article.title, 50)}
              </p>
            </div>
            <div className="flex w-full justify-between p-2.5 items-center">
              <div className="flex text-xs text-gray-500">
                {truncateText(article.author.name, 10)} · 조회수 {article.view}
              </div>
              <div className="font-pretendard text-sm font-normal  leading-6 text-gray-400">{formatDate(article.createdAt)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}