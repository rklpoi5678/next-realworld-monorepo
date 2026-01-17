import Image from "next/image";

import Heart from "@/assets/icons/ic_heart.svg"
import DefaultItemImage from "@/assets/items/Img_default_items.svg"

export function Card({ name, price, images, type, likes }) {
  return (
    <div className="flex flex-col gap-4 cursor-pointer hover:bg-gray-200 hover:transition duration-200 ease-in">
      <Image
        className={type === 'favorite' ? "bg-gray-100 w-[282px] h-[282px] rounded-2xl" : "bg-gray-100 w-[221px] h-[221px] rounded-2xl"}
        src={images?.[0] || DefaultItemImage}
        alt="image" />
      <div className="flex flex-col gap-1.5">
        <p className="font-pretendard text-base text-gray-800 font-medium">{name}</p>
        <p className="font-pretendard text-lg text-gray-800 font-bold">{price}</p>
        <div className="text-gray-600 font-pretendardk text-xs font-medium">
          <Image
            src={Heart}
            width={16} height={16}
            alt="좋아요"
          />
          {likes}
        </div>
      </div>
    </div>
  );
}