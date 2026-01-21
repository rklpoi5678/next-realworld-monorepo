import Image from "next/image"
import Link from "next/link"

import FacebookIcon from '@/assets/icons/ic_facebook.svg'
import InstagramIcon from '@/assets/icons/ic_instagram.svg'
import TwitterIcon from '@/assets/icons/ic_twitter.svg'
import YoutubeIcon from '@/assets/icons/ic_youtube.svg'

export function FooterIcons() {
  return (
    <>
      <Link className="text-base font-normal font-pretendard text-center no-underline text-[#E5E7EB]" href="https://www.youtube.com/results?search_query=코드잇_판다마켓" target="_blank"><Image src={YoutubeIcon} width={20} height={20} alt="youtube" unoptimized /></Link>
      <Link className="text-base font-normal font-pretendard text-center no-underline text-[#E5E7EB]" href="https://www.facebook.com/" target="_blank"><Image src={FacebookIcon} width={20} height={20} alt="facebook" unoptimized /></Link>
      <Link className="text-base font-normal font-pretendard text-center no-underline text-[#E5E7EB]" href="https://www.instagram.com/" target="_blank"><Image src={InstagramIcon} width={20} height={20} alt="instagram" unoptimized /></Link>
      <Link className="text-base font-normal font-pretendard text-center no-underline text-[#E5E7EB]" href="https://www.twitter.com/" target="_blank"><Image src={TwitterIcon} width={20} height={20} alt="twitter" unoptimized /></Link>
    </>
  )
}