"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { articleFormSchema } from '@/libs/schemas/article.schema';
import { useDialog } from '@/providers/modal-context';
import { articleService } from '@/services/article-service';

export function ArticleRegistration() {
  const { openDialog } = useDialog()

  const router = useRouter();

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
      await articleService.createArticle(data);
      openDialog("아티클 작성을 완료했습니다.")
      router.push('/articles')
    } catch (error) {
      console.error(error);
      openDialog("등록중 오류 발생")
    }
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
          <h2 className='font-pretendard text-2xl font-bold leading-9'>게시물 쓰기</h2>
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
    </>
  );
}

