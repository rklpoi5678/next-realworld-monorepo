import Image from "next/image";

import HomeFirstImg from "@/assets/landing/Img_home_01.png";
import HomeSecondImg from "@/assets/landing/Img_home_02.png";
import HomeThirdImg from "@/assets/landing/Img_home_03.png";


export function FeatureSection() {
  return (
    <main>
      <section className="py-34.5 px-86">
        <div className="flex justify-center items-center gap-16">
          <div className="flex items-center gap-16 pr-7.5 bg-[#FCFCFC]">
            <Image
              src={HomeFirstImg}
              width={580}
              height={444}
              alt="panda-first-img"
            />
            <div className="flex flex-col gap-3 text-left text-[1.125rem] leading-6.5 font-pretendard">
              <p className="text-[1.125rem] font-bold leading-6.5 text-primary-100">Hot item</p>
              <h2 className="text-2xl font-bold text-gray-700 leading-[140%] font-pretendard">인기 상품을<br className="feature-card-br" />확인해 보세요</h2>
              <p className="text-2xl font-medium leading-8 text-gray-700">
                가장 HOT한 중고거래 물품을<br />
                판다 마켓에서 확인해 보세요
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-86 px-34.5">
        <div className="flex flex-row-reverse justify-center items-center gap-16">
          <div className="flex items-center gap-16 pr-7.5 bg-[#FCFCFC]">
            <Image
              src={HomeSecondImg}
              alt="panda-second-img"
              width={580}
              height={444}
            />
            <div className="flex flex-col items-end text-right gap-3 text-[1.125rem] font-bold leading-6.5">
              <p className="text-[1.125rem] font-bold leading-6.5 text-primary-100 font-pretendard">search</p>
              <h2 className="text-[2.5rem] font-bold text-gray-700 leading-[140%] tracking-[.05em] font-pretendard">
                구매를 원하는<br />
                상품을 검색하세요
              </h2>
              <p className="text-2xl font-pretendard font-medium leading-8 text-gray-700">구매하고 싶은 물품은 검색해서<br />쉽게 찾아보세요</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-86 px-34.5">
        <div className="flex justify-center items-center gap-16">
          <div className="flex items-center gap-16 pr-7.5 bg-[#FCFCFC]">
            <Image
              src={HomeThirdImg}
              alt="panda-third-img"
              width={580}
              height={444}
            />
            <div className="flex flex-col gap-3 text-left text-[1.125rem] leading-6.5 font-pretendard">
              <p className="text-[1.125rem] font-bold leading-6.5 text-primary-100 font-pretendarda">Register</p>
              <h2 className="text-[2.5rem] font-bold text-gray-700 leading-[140%] tracking-[.05em] font-pretendardg">판매를 원하는<br className="feature-card-br" />
                상품을 등록하세요
              </h2>
              <p className="text-2xl font-pretendard font-medium leading-8 text-gray-700">어떤 물건이든 판매하고 싶은 상품을<br />쉽게 등록하세요</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}