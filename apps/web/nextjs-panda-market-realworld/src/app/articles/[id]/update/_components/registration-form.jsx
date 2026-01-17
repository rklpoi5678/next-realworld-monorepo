"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation';
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { z } from 'zod'

import { Button } from '@/components/ui/button';
import { Modal } from "@/components/ui/dialog";
import { updateArticle } from '@/services/article-service';

const articleFormSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력해주세요.')
    .max(30, '제목은 30자 이내로 입력해주세요.'),
  content: z.string()
    .min(10, '내용은 10자 이상 입력해주세요.')
    .max(100, '내용은 100자 이내로 입력해주세요.'),
})

export function ArticleRegistration() {
  const [showModal, setShowModal] = useState(false);

  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(articleFormSchema),
    mode: 'onChange', // 실시간 유효성 검사
  })

  const onSubmit = async (data) => {

    try {
      await updateArticle(id, data);

      router.push(`/articles/${id}}`)

    } catch (error) {
      console.error("등록중 오류 발생:", error);
      setShowModal(true);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className='px-6 w-full'
      >
        <div className="flex w-full justify-between mb-9">
          <h2 className='font-pretendard text-2xl font-bold leading-9'>
            게시물 수정하기
          </h2>
          <Button
            type="submit"
            disabled={!isValid}
          >
            등록
          </Button>
        </div>
        <div className="flex flex-col gap-4 w-full mb-8">
          <label
            className='text-gray-800 font-pretendard text-lg font-bold leading-6.5'
            htmlFor="article_name"
          >
            제목
          </label>
          <input
            className='w-full h-14 py-4 px-6 rounded-xl bg-gray-100'
            type="text"
            id="article_name"
            placeholder="제목을 입력해주세요"
            aria-label="제목을 입력해주세요"
            {...register('title')}
          />
          {errors.title && (
            <span className='text-error-red'>{errors.title.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full mb-8">
          <label
            className='text-gray-800 font-pretendard text-lg font-bold leading-6.5'
            htmlFor="article_describe"
          >
            내용
          </label>
          <textarea
            className='max-w-full w-full h-70.5 py-4 px-6 resize-none border-0 rounded-xl bg-gray-100'
            id="article_describe"
            placeholder="내용을 입력해주세요"
            aria-label="내용을 입력해주세요"
            {...register('content')}
          ></textarea>
          {errors.content && (
            <span className='text-error-red'>{errors.content.message}</span>
          )}
        </div>
      </form>

      {showModal && (
        <Modal
          close={handleCloseModal}
          msg={
            "등록중 예기치 못한 오류가 발생했습니다.\n 잠시후 다시시도해 주십시오 \n 문의(meta-os@zohomail.com)"
          }
        />
      )}
    </>
  );
}

