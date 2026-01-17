import Image from "next/image";
import Link from "next/link";

import DefaultImg from '@/assets/logo.svg'
import { formatDate } from "@/libs/utils/format";

export function ArticleSection({ articles }) {

  const imageSource = articles.images?.[0] || DefaultImg;
  return (
    <div className="flex flex-col gap-3">
      {articles.map((article) => (
        <Link
          href={`articles/${article.id}`}
          key={article.id}
          className="border border-solid border-[#eee]  text-gray-900 py-2.5 px-0 cursor-pointer no-underline"
        >
          <div className="flex flex-row-reverse justify-between">
            <Image
              className="flex shrink-0 my-3.5 mr-5 mb-5 ml-3"
              width={48}
              height={44}
              src={imageSource}
              alt="썸네일"
            />
            <p className="font-pretendard text-xl font-semibold leading-8 mb-1">{article.title}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div className="relative w-6 h-6 rounded-[50%]">
                <Image
                  className="absolute"
                  fill
                  src={article.author.userProfile?.photoUrl || DefaultImg}
                  alt="author-avatar"
                />
              </div>
              <p className="font-pretendard text-sm leading-6 text-gray-600">{article.author.name}</p>
              <p className="font-pretendard text-sm leading-6 text-gray-400">
                {formatDate(article.createdAt)}
              </p>
            </div>
            <div className="font-pretendard text-base leading-6.5 text-gray-500 mr-5">조회수 {article.view}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}