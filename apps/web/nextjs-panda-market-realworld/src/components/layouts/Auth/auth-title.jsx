import Image from "next/image";
import Link from "next/link";

import PandaLogo from "@/assets/logo.svg"

export function AuthTitle() {
  return (
    <section className="flex justify-center gap-5 mt-51.25">
      <div className="relative mb-10 w-[6.4706rem] h-[6.4925rem]">
        <Link href="/">
          <Image
            className="absolute"
            src={PandaLogo}
            alt="판다마켓 로고"
            fill
          />
        </Link>
      </div>
      <p className="flex font-rokaf text-[4.0215rem] font-bold text-primary-100">판다마켓</p>
    </section>
  );
}