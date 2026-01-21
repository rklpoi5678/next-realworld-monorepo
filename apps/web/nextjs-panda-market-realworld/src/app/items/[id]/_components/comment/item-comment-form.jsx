'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { itemCommentSchema } from "@/libs/schemas/comment.schema"
import { useDialog } from "@/providers/modal-context"
import { commentService } from "@/services/comment-service"

export function ItemCommentForm({ itemId }) {
  const queryClient = useQueryClient();
  const { openDialog } = useDialog()

  const {
    register,
    handleSubmit,
    // reset, //폼 리셋
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(itemCommentSchema),
    mode: 'onChange'
  })

  const mutation = useMutation({
    mutationFn: (formData) => {
      return commentService.createComments(itemId, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['item', itemId]
      });
      openDialog('댓글 등록을 성공했습니다.')
      // reset()
    },
    onError: (error) => {
      openDialog('댓글 등록중 오류가 발생했습니다.', error.message)
    }
  });


  const onSubmit = async (data) => {
    mutation.mutate(data)
  }

  return (
    <section className="container w-full mb-8 md:max-w-7xl">
      <h3 className="font-pretendard font-semibold mb-2 mt-6 leading-6.5">
        문의하기
      </h3>
      <form
        method="POST"
        onSubmit={handleSubmit(onSubmit)}>
        <textarea
          id="context"
          className="max-w-85.75 md:max-w-7xl w-full h-32.25 md:h-26 p-2.5 border-0 rounded-md resize-none mb-2 bg-gray-100 placeholder:text-gray-400 placeholder:text-sm placeholder:leading-6"
          placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
          {...register('context')}
        />
        {errors.context && (
          <span className='text-error-red'>{errors.context.message}</span>
        )}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? '등록 중...' : '등록'}
          </Button>
        </div>
      </form>
    </section>
  )
}