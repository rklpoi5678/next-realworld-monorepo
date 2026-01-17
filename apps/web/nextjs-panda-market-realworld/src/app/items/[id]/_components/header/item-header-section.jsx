"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { redirect, useRouter } from "next/navigation"
import React, { useState } from "react"

import EllipsisVertical from '@/assets/icons/ic_ellipsis_vertical.svg'
import DefaultImg from "@/assets/items/Img_default.png"
import { DeleteDialog } from "@/components/ui/dialog/delete-dialog"
import { useDialog } from "@/providers/modal-context"
import { itemService } from "@/services/item-service"

import { ItemAuthor } from "./item-author"

const contents = [
  { option: '수정하기', name: 'update' },
  { option: '삭제하기', name: 'delete' }
]

export function ItemHeaderSection({ itemId }) {
  const queryClient = useQueryClient()
  const [showPanel, setShowPanel] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogDeleteMessage, setDialogDeleteMessage] = useState('');
  const { openDialog } = useDialog()
  const router = useRouter();

  const { data: itemData, error } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => itemService.getItemById(itemId)
  })

  const item = itemData?.data;

  const deleteMutation = useMutation({
    mutationFn: () => itemService.deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['item', itemId]
      })
      openDialog('성공적으로 상품을 삭제하였습니다.')
      router.push('/items')
    },
    onError: (error) => {
      console.error("Failed Delete:", error);
      setDialogDeleteMessage("삭제 중 오류 발생", error.message)
      setShowDialog(true)
    }
  });

  const handlePanel = () => {
    setShowPanel(!showPanel)
  }

  const handleDelete = () => {
    setShowPanel(false)
    deleteMutation.mutate()
  }

  const handleOnChange = (name) => {
    setShowPanel(false);

    if (name === 'update') {
      router.push(`${itemId}/update/`)
    }
    if (name === 'delete') {
      setDialogDeleteMessage("정말로 상품을 삭제하시겠어요?")
      setShowDialog(true);
    }
  }

  if (!item) return redirect('/not-found');
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error.message}</div>

  return (
    <section className="container w-full items-center pb-4 mb-6 border-b border-gray-200">
      <div className="container max-w-480 flex flex-col md:flex-row md:gap-2.5">
        <div className="flex items-center relative w-85 h-85 shrink-0 md:mr-6 xl:w-121.5 xl:h-121.5 ">
          <Image
            className="absolute rounded-2xl"
            src={DefaultImg}
            alt="상품 이미지"
            fill
          />
        </div>

        <div className="flex flex-col w-full justify-between">
          <div className="flex justify-between items-center">
            <h1
              className="w-full font-pretendard text-base font-semibold leading-6.5 mt-4 text-gray-800 md:text-xl"
            >
              {item.name}
            </h1>
            <div
              className="relative w-2 h-2 cursor-pointer"
              onClick={handlePanel}
            >
              <Image
                className="flex shrink md:mr-3.5"
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
          <h2 className="text-[2rem] font-semibold font-pretendard leading-8 text-gray-800 border-b border-gray-200 pb-4">
            {item.price}
          </h2>
          <h3 className="font-pretendard text-base text-gray-600 font-semibold leading-6.5 mt-4 mb-2">상품 소개</h3>
          <section className="font-pretendard text-lg text-gray-800 mb-8 leading-6.5">
            {item.description}
          </section>
          <section>
            <h3 className="mb-4 font-pretendard text-base font-semibold text-gray-600 leading-6.5">상품 태그</h3>
            <ul className="flex gap-4">
              {item.tags?.map((tag) => (
                <li
                  key={tag.id}
                  className="bg-gray-100 h-9 py-1.5 px-4 rounded-3xl"
                >
                  <p className="text-gray-800 font-pretendard leading-6.5">{tag.name}</p>
                </li>
              ))}
            </ul>
          </section>
          <ItemAuthor item={item} />
        </div>
      </div >

      {showDialog && (
        <DeleteDialog
          close={() => setShowDialog(false)}
          msg={dialogDeleteMessage}
          deleteClick={handleDelete}
        >
        </DeleteDialog>
      )}
    </section >
  )
}
