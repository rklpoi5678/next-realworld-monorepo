import Link from "next/link"

import { AuthTitle } from "@/components/layouts/Auth/auth-title"
import { SocialLogin } from "@/components/layouts/Auth/social-login"
import { signupMetadata } from "#/config/metadata"
import { paths } from "#/config/paths"

import SignUpForm from "./signup-form"

export default function SignupView() {
  return (
    <>
      <AuthTitle />

      <SignUpForm />

      <SocialLogin />

      <div className="flex justify-center items-center gap-1 mb-52.25">
        <p className="flex font-pretendard text-sm/normal font-medium gap-4 mt-6 text-gray-800">
          이미 회원이신가요?
        </p>
        <Link className='flex font-pretendard text-sm/normal font-medium gap-4 mt-6 text-primary-100' href={paths.auth.login.getHref()}>
          로그인
        </Link>
      </div>
    </>
  )
}


export const metadata = { ...signupMetadata }