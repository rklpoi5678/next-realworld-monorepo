"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod'

import VisibilityOff from '@/assets/icons/ic_visibility_off.svg'
import VisibilityOn from '@/assets/icons/ic_visibility_on.svg'
import { Modal } from '@/components/ui/dialog';
import { cn } from '@/libs/cn';
import { signupFormSchema } from '@/libs/schemas/auth.schema';
import { useAuth } from '@/providers/auth-provider';

const defaultErrorMessage = '회원가입 중 알 수 없는 오류가 발생했습니다.'

export default function SignUpForm() {
  const { signUp } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange"
  })
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordCheckerVisible, setPasswordCheckerVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(defaultErrorMessage)

  const router = useRouter();

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordCheckerVisible = () => {
    setPasswordCheckerVisible(!passwordCheckerVisible);
  };

  const onSubmit = async (data) => {
    try {
      await signUp(data.email, data.nickname, data.password, data.passwordConfirmation)
      router.replace("/items");
    } catch (error) {
      const errorMessage = error?.message || defaultErrorMessage
      setModalMessage(errorMessage)
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage(defaultErrorMessage);
  };

  return (
    <>
      <form
        className='flex flex-col justify-center'
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div>
          <label className='font-pretendard text-[1.125rem] font-bold leading-6.5 mb-4' htmlFor="email">이메일</label>
          <input
            className={cn("inline-block w-full border-0 rounded-xl py-4 px-6 mb-6 bg-gray-100 focus:outline-none",
              errors.email && "border border-error-red mb-0"
            )}
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            aria-label="이메일을 입력해주세요"
            {...register("email")}
          />
        </div>
        {errors.email &&
          <span className="text-error-red font-pretendard text-sm font-semibold mb-6 ml-4 mt-2">{errors.email.message}</span>
        }
        <div className='flex flex-col'>
          <label className='font-pretendard text-[1.125rem] font-bold leading-6.5 mb-4' htmlFor="nickname">닉네임</label>
          <input
            className={cn("inline-block w-full border-0 rounded-xl py-4 px-6 mb-6 bg-gray-100 focus:outline-none",
              errors.nickname && "border border-error-red mb-0"
            )}
            id="nickname"
            type="text"
            placeholder="닉네임을 입력해주세요"
            aria-label="닉네임을 입력해주세요"
            {...register("nickname")}
          />
        </div>
        {errors.nickname &&
          <span className="text-error-red font-pretendard text-sm font-semibold mb-6 ml-4 mt-2">{errors.nickname.message}</span>
        }

        <div className='relative flex flex-col'>
          <label className="font-pretendard text-[1.125rem] font-bold leading-6.5 mb-4" htmlFor="password">비밀번호</label>
          <input
            className={cn("inline-block w-full border-0 rounded-xl py-4 px-6 bg-gray-100 focus:outline-none",
              errors.password && "border border-error-red"
            )}
            id="password"
            type={passwordVisible ? "text" : "password"}
            alt={passwordVisible ? "텍스트가 보입니다." : "텍스트가 보이지않습니다."}
            placeholder="비밀번호를 입력해주세요"
            aria-label="비밀번호를 입력해주세요"
            {...register("password")}
          />
          <Image className="absolute cursor-pointer top-1/2 translate-y-3.25 left-[93%]"
            src={passwordVisible ? VisibilityOn : VisibilityOff}
            alt={passwordVisible ? "비밀번호 표시 아이콘" : "비밀번호 감춰진 표시 아이콘"}
            onClick={handlePasswordVisible}
            width={24}
            height={24}
            unoptimized
          />
          {errors.password &&
            <span className="text-error-red font-pretendard text-sm font-semibold mb-6 ml-4 mt-2">{errors.password.message}</span>
          }
        </div>

        <div className='relative flex flex-col'>
          <label className='font-pretendard text-[1.125rem] font-bold leading-6.5 mt-4 mb-4' htmlFor="passwordConfirmation">비밀번호 확인</label>
          <input
            className={cn("inline-block w-full border-0 rounded-xl py-4 px-6 bg-gray-100 focus:outline-none",
              errors.passwordConfirmation && "border border-error-red"
            )}
            id="passwordConfirmation"
            type={passwordCheckerVisible ? "text" : "password"}
            alt={passwordVisible ? "텍스트가 보입니다." : "텍스트가 보이지않습니다."}
            placeholder="비밀번호를 입력해주세요"
            aria-label="비밀번호를 입력해주세요"
            {...register("passwordConfirmation")}
          />
          <Image
            className="absolute cursor-pointer top-1/2 translate-y-3.25 left-[93%]"
            src={passwordCheckerVisible ? VisibilityOn : VisibilityOff}
            alt={passwordVisible ? "비밀번호 표시 아이콘" : "비밀번호 감춰진 표시 아이콘"}
            onClick={handlePasswordCheckerVisible}
            width={24}
            height={24}
            unoptimized
          />
          {errors.passwordConfirmation &&
            <span className="text-error-red font-pretendard text-sm font-semibold mb-6 ml-4 mt-2">{errors.passwordConfirmation.message}</span>
          }
        </div>

        {/* <!--조건에 맞지 않으면 비활성화--> */}
        <button
          className="text-center w-full py-4 px-6 my-6 mb-6 mx-0 font-pretendard text-xl font-semibold leading-8 bg-gray-400 text-gray-100 border-0 rounded-[9999px] hover:bg-primary-100"
          type="submit"
          disabled={!isValid}
        >
          회원가입
        </button>
      </form >
      {showModal &&
        <Modal close={handleCloseModal} msg={modalMessage} />
      }
    </>
  )
}