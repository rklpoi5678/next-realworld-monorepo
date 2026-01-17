"use client"
import Image from "next/image"
import { useState } from "react"
import { useFormStatus } from "react-dom"

import EllipsisVertical from '@/assets/icons/ic_ellipsis_vertical.svg'
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/dialog"

const contents = [
  { option: '수정하기', name: 'update' },
  { option: '삭제하기', name: 'delete' }
]

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? '수정 중...' : '수정 완료'}
    </Button>
  );
}
export function DropdownContent({ comment }) {
  const [showPanel, setShowPanel] = useState(false);
  const [update, setUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [context, setContext] = useState('');

  const handlePanel = () => {
    setShowPanel(!showPanel);
  }

  const handleDelete = async () => {
    setShowModal(false)

    try {
      const data = await deleteComment(comment.id)
    } catch (error) {
      console.error(error)
      setModalMessage("삭제 중 오류 발생");
      setShowModal(true)
    }
  }

  const handleOnChange = (name) => {
    setShowPanel(false)
    setContext('')

    if (name === 'update') {
      setUpdate(!update)
    }
    if (name === 'delete') {
      setShowModal(!showModal)
    }
  }

  // 서버 액션을 호출하는 래퍼 함수
  const handleClientAction = async (formData) => {
    const result = await action(formData);

    if (result.success) {
      console.log(result.message);
      setUpdate(false);
    } else {
      console.error(result.message);
    }
  };

  return (
    <>
      <div className="font-pretendard text-sm text-gray-900 leading-6 w-full">
        {update ? (
          <form action={handleClientAction} className="flex flex-col w-full">
            <input
              type="hidden"
              name="commentId"
              value={comment.id}
            />
            <input
              name="context"
              className="bg-gray-100 w-full"
              value={context}
              placeholder={comment.context}
              onChange={(e) => setContext(e.target.value)}
            />
            <section className="flex w-full justify-end gap-6">
              <button onClick={handleOnChange}>
                취소
              </button>
              <SubmitButton />
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
                    <li key={c.name} className="font-pretendard cursor-point mt-0.5 flex h-10.5 w-31.25 shrink-0 items-center justify-center text-gray-800 text-lg leading-6.5">
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

      {showModal && (
        <Modal
          close={() => setShowModal(false)}
          msg={modalMessage}
        >
          정말로 삭제 하시겠습니까?
          <Button className='flex w-full' onClick={handleDelete} >예</Button>
        </Modal>
      )}
    </>
  )
}