"use client"
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import React from 'react'

import CommentEmptyImg from '@/assets/article/Img_reply_empty.svg'
import DefaultImg from '@/assets/logo.svg'
import { formatDate } from "@/libs/utils/format";
import { itemService } from '@/services/item-service'

import { DropdownContent } from '../dropdown-content'

export function ItemCommentSection({ itemId }) {
  const { data: itemData } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => itemService.getItemById(itemId)
  })

  const comments = itemData?.data.comment;

  return (
    <section className="flex flex-col gap-6 no-underline list-none">
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <li key={comment.id} className="flex flex-col border-2.5 border-t-0 border-r-0 border-l-0 border border-solid border-gray-300 py-3 px-0 gap-6 bg-gray-50">
            <div className="flex justify-between">
              <DropdownContent comment={comment} />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <Image
                src={
                  comment.author?.userProfile?.photoUrl || DefaultImg
                }
                alt="avatar"
                width={32}
                height={32}
                className="shrink-0 w-8 h-8 rounded-full object-cover"
              />
              <div>
                <span className="font-pretendard text-xs leading-4.5 text-gray-600">
                  {comment.author?.name}
                </span>
                <p className="text-gray-400 text-xs leading-4.5">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
          </li>
        ))
      ) : (
        <>
          <Image
            className="self-center mb-4"
            width={140}
            height={140}
            src={CommentEmptyImg}
            alt="comment-empty-img"
          />
          <p className="text-gray-400 text-center font-pretendard leading-6.5">
            아직 댓글이 없어요,
            <br />
            지금 댓글을 달아보세요!
          </p>
        </>
      )}
    </section>
  )
}
