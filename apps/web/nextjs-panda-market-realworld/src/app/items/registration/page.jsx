"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { itemFormSchema } from '@/libs/schemas/item.schema';
import { useDialog } from '@/providers/modal-context';
import { itemService } from '@/services/item-service';

export default function ItemRegistration() {
  const { openDialog } = useDialog()
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(itemFormSchema),
    mode: 'onChange', // 실시간 유효성 검사
  })

  const createMutation = useMutation({
    mutationFn: (formData) => {
      return itemService.createItem(formData)
    },
    onSuccess: () => {
      router.push('/items')
      openDialog('상품 등록에 성공했습니다.')
    },
    onError: (error) => {
      console.error(error);
      openDialog("등록중 오류 발생", error.message)
    }
  })

  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

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
            상품 등록
          </h2>
          <Button
            type="submit"
            disabled={!isValid || createMutation.isPending}
          >
            {createMutation.isPending ? "등록 중..." : "등록"}
          </Button>
        </div>
        <div className="flex flex-col gap-4 w-full mb-8">
          <label
            className='text-gray-800 font-pretendard text-lg font-bold leading-6.5'
            htmlFor="item_name"
          >
            제목
          </label>
          <input
            className='w-full h-14 py-4 px-6 rounded-xl bg-gray-100'
            type="text"
            id="item_name"
            placeholder="제목을 입력해주세요"
            aria-label="제목을 입력해주세요"
            {...register('name')}
          />
          {errors.name && (
            <span className='text-error-red'>{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full mb-8">
          <label
            className='text-gray-800 font-pretendard text-lg font-bold leading-6.5'
            htmlFor="item_describe"
          >
            내용
          </label>
          <textarea
            className='max-w-full w-full h-70.5 py-4 px-6 resize-none border-0 rounded-xl bg-gray-100'
            id="item_describe"
            placeholder="내용을 입력해주세요"
            aria-label="내용을 입력해주세요"
            {...register('description')}
          ></textarea>
          {errors.description && (
            <span className='text-error-red'>{errors.description.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-4 w-full mb-8">
          <label
            className='text-gray-800 font-pretendard text-lg font-bold leading-6.5'
            htmlFor="item_price"
          >
            가격
          </label>
          <input
            className='w-full h-14 py-4 px-6 rounded-xl bg-gray-100'
            type="text"
            id="item_price"
            placeholder="제목을 입력해주세요"
            aria-label="제목을 입력해주세요"
            {...register('price')}
          />
          {errors.price && (
            <span className='text-error-red'>{errors.price.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-4 w-full mb-8">
          <label
            className='text-gray-800 font-pretendard text-lg font-bold leading-6.5'
            htmlFor="item_tags"
          >
            태그
          </label>
          <input
            className='w-full h-14 py-4 px-6 rounded-xl bg-gray-100'
            type="text"
            id="item_tags"
            placeholder="테스트 태그 예시: #아이패드미니, #애플, #가성비"
            aria-label="태그를 입력해주세요 (쉼표 구분)"
            {...register('tags')}
          />
          {errors.tags && (
            <span className='text-error-red'>{errors.tags.message}</span>
          )}
        </div>
      </form>
    </>
  );
}


