"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

import EllipsisVertical from '@/assets/icons/ic_ellipsis_vertical.svg'
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/dialog"
import { articleService } from "@/services/article-service"

const contents = [
  { option: '수정하기', name: 'update' },
  { option: '삭제하기', name: 'delete' }
]

export function ArticleTitleSection({ article }) {
  const [showPanel, setShowPanel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const router = useRouter();

  const handlePanel = () => {
    setShowPanel(!showPanel)
  }

  const handleDelete = async () => {
    setShowModal(false)

    try {
      await articleService.deleteArticle(article.id);

      router.push('/articles')
    } catch (error) {
      console.error("Failed Delete:", error);
      setModalMessage("삭제 중 오류 발생")
      setShowModal(true)
    }
  }

  const handleOnChange = (name) => {
    setShowPanel(false);

    if (name === 'update') {
      router.push(`${article.id}/update/`)
    }
    if (name === 'delete') {
      setModalMessage("정말로 삭제하시겠습니까")
      setShowModal(true);
    }
  }

  return (
    <>
      <div className="flex justify-between max-w-7xl">
        <h2
          className="w-full font-pretendard text-xl font-bold leading-8 text-gray-900 mb-4"
        >
          {article.title}
        </h2>
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

      {showModal && (
        <Modal
          close={() => setShowModal(false)}
          msg={modalMessage}
        >
          <Button className='flex w-full' onClick={handleDelete} >예</Button>
        </Modal>
      )}
    </>
  )
}