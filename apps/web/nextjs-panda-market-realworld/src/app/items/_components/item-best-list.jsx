import Image from "next/image";
import Link from "next/link";

import BinHeartIcon from '@/assets/icons/ic_heart.svg'
import DefaultImg from '@/assets/logo.svg'
import { cn } from "@/libs/cn";
import { truncateText } from "@/libs/utils/format";


export function ItemBestList({ items }) {
  const imageSource = items.images?.[0] || DefaultImg;
  return (
    <section className="mb-12">
      <div className="flex flex-col">
        {items.map((item, index) => (
          <Link
            href={`items/${item.id}`}
            key={item.id}
            // 1개 일때 모두숨기고 하나씩 보여주기 
            className={cn("relative flex flex-col justify-center items-center flex-1 w-96 h-48.5 py-0 px-6 rounded-lg overflow-hidden text-gray-900 cursor-pointer duration-200 no-underline hover: translate-y-[-4px]",
              index >= 1 && "hidden",
              index === 2 && "md:flex",
              index === 3 && "xl:flex"
            )}
          >
            <div className="flex flex-col w-full justify-between gap-2 mt-4">
              <div className="relative flex w-[343px] h-[343px] px-3.5 py-3 ">
                <Image
                  src={imageSource}
                  alt="썸네일"
                  fill
                />
              </div>
              <p className="font-pretendard text-xl font-semibold text-gray-800 mb-1.5 ">
                {truncateText(item.name, 30)}
              </p>
              <div className="flex w-full justify-between p-2.5 items-center">
                <div className="font-pretendard text-sm font-normal  leading-6 text-gray-400">{item.price}원</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="relative w-3 h-3">
                  <Image
                    className="absolute"
                    src={BinHeartIcon}
                    alt="하트 아이콘"
                    fill
                  />
                </div>
                <span>{item._count.itemLikes}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}