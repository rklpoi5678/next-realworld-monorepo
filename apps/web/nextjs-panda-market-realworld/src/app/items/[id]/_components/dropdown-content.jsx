"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState } from "react"

import EllipsisVertical from '@/assets/icons/ic_ellipsis_vertical.svg'
import { Button } from "@/components/ui/button"
import { DeleteDialog } from "@/components/ui/dialog/delete-dialog"
import { useDialog } from "@/providers/modal-context"
import { commentService } from "@/services/comment-service"

const contents = [
  { option: '수정하기', name: 'update' },
  { option: '삭제하기', name: 'delete' }
]

export function DropdownContent({ comment }) {
  const params = useParams()
  const queryClient = useQueryClient();
  const { id: itemId } = params
  const { openDialog } = useDialog();

  const [showPanel, setShowPanel] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDialogMessage, setDeleteDialogMessage] = useState('');
  const [context, setContext] = useState('');

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: () => commentService.deleteComments(itemId, comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['item', itemId]
      });
      openDialog('댓글 삭제를 성공 하였습니다.')
      setShowDeleteDialog(false)
    },
    onError: (error) => {
      console.error(error);
      openDialog("삭제 중 오류가 발생하였습니다.")
      setShowDeleteDialog(false);
    }
  })
  // 수정
  const updateMutation = useMutation({
    mutationFn: (context) => {
      const formData = {
        context
      }
      return commentService.updateComments(itemId, comment.id, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['item', itemId]
      });
      openDialog("댓글 업데이트를 성공했습니다.")
      setUpdate(false)
    },
    onError: (error) => {
      console.error(error);
      openDialog('업데이트 중 오류가 발생했습니다.', error.message)
    }
  });
  // 버튼 핸들러 & UI
  const handlePanel = () => {
    setShowPanel(!showPanel);
  }
  const handleOnChange = (name) => {
    setShowPanel(false)
    setContext('')

    if (name === 'update') {
      setUpdate(!update)
    }
    if (name === 'delete') {
      setDeleteDialogMessage('정말로 댓글을 삭제하시겠어요?')
      setShowDeleteDialog(!showDeleteDialog)
    }
  }

  const handleDelete = () => {
    deleteMutation.mutate();
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (!context.trim()) {
      openDialog("댓글 내용을 입력해주세요.");
      return;
    }
    updateMutation.mutate(context)
  }

  const handleCloseUpdate = () => {
    setUpdate(false);
    setContext(comment.context)
  }

  return (
    <>
      <div className="font-pretendard text-sm text-gray-900 leading-6 w-full">
        {update ? (
          <form
            className="flex flex-col w-full"
            onSubmit={onSubmit}>
            <input
              name="context"
              className="bg-gray-100 w-full"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <section className="flex w-full justify-end gap-6">
              <button onClick={handleCloseUpdate}>
                취소
              </button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "수정 중..." : "수정 완료"}
              </Button>
            </section>
          </form>
        ) : (
          <div className="flex justify-between max-w-7xl">
            <p>{comment.context}</p>
            <div
              className="relative cursor-pointer"
              onClick={handlePanel}
            >
              <Image
                className="flex shrink-0 pt-1.25 pr-0 pb-1.5 pl-0 mr-3.25 ml-3.25"
                src={EllipsisVertical}
                alt="vertical-dropdown-button"
                width={3}
                height={13}
                unoptimized
              />
              {showPanel && (
                <ul className="absolute z-2 mt-2 shrink-0 rounded-xl border border-solid border-gray-200 bg-white -left-20">
                  {contents.map((c) => (
                    <li key={c.name} className="font-pretendard cursor-pointer mt-0.5 flex h-10.5 w-31.25 shrink-0 items-center justify-center text-gray-800 text-lg leading-6.5">
                      <button
                        className="border-0 bg-white"
                        onClick={() => handleOnChange(c.name)}
                      >
                        {c.option}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div >
      {showDeleteDialog && (
        <DeleteDialog
          close={() => setShowDeleteDialog(false)}
          msg={deleteDialogMessage}
          deleteClick={handleDelete}
        >
        </DeleteDialog>
      )}
    </>
  )
}