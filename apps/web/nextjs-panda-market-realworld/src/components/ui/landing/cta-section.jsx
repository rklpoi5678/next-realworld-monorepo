import Image from "next/image";

import HomeBottomImg from '@/assets/landing/Img_home_bottom.png'

export function CTASection() {
  return (
    <section className="bg-[#CFE5FF] text-2xl font-pretendard font-medium leading-8 text-gray-700">
      <div className="flex justify-center items-center gap-17.25">
        <h2 className="text-[2.5rem] font-bold text-gray-800 mb-15 font-pretendard leading-[140%]">
          믿을 수 있는<br />
          판다마켓 중고 거래
        </h2>
        <div className="mt-35.75">
          <picture>
            <source media="(min-width: 650px)" srcSet={HomeBottomImg} />
            <Image
              src={HomeBottomImg}
              alt="pandas!"
              width={746}
              height={397}
            />
          </picture>
        </div>
      </div>
    </section>
  );
}