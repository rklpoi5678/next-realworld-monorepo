import Image from "next/image";
import Link from "next/link";

import PandaTopImg from "@/assets/landing/Img_home_top.png"

export function HeroSection() {
  return (
    <section className="flex justify-center items-end left-0 right-0 h-135 shrink-0 bg-[#CFE5FF]">
      <div className="inline-flex flex-col justify-center items-center gap-3 mx-30 my-30">
        <h1 className="text-[2.5rem] font-bold leading-[140%]">
          일상의 모든 물건을<br />
          거래해 보세요
        </h1>
        <Link
          className="bg-primary-100 py-4 px-32 rounded-full font-pretendard text-gray-50 font-semibold leading-8"
          href="/products"
          id="load-react"
        >
          구경하러 가기
        </Link>
      </div>

      {/*https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture */}
      <picture>
        <source media="(min-width: 650px)" srcSet={PandaTopImg} />
        <Image
          className="flex w-186.5 h-85"
          src={PandaTopImg}
          alt="판다이미지"
        />
      </picture>
    </section>
  );
}