
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

import FullHeartIcon from '@/assets/icons/ic_full_heart.svg'
import BinHeartIcon from '@/assets/icons/ic_heart.svg'
import { itemService } from "@/services/item-service";

const DEFAULT_IS_LIKED = false;

export function ItemLikeButton({ itemId, initialLikeCount }) {
  const queryClient = useQueryClient();
  const results = useQueries({
    queries: [
      // 공개 데이터 좋아요 갯수
      { queryKey: ["item", itemId], queryFn: () => itemService.getItemById(itemId) },
      // 개인데이터 좋아요 상태
      { queryKey: ["like-status", itemId], queryFn: () => itemService.getLikeStatus(itemId), retry: false }
    ]
  });

  const itemQuery = results[0];
  const statusQuery = results[1];

  const currentLikeCount = Number(itemQuery.data?.data?.likeCount ?? initialLikeCount ?? 0);
  const currentIsLiked = statusQuery.data?.data?.isLiked ?? DEFAULT_IS_LIKED;

  const likeMutation = useMutation({
    mutationFn: () => itemService.toggleLike(itemId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['item', itemId] })
      await queryClient.cancelQueries({ queryKey: ['like-status', itemId] });

      const previousItems = queryClient.getQueryData(['item', itemId]);
      const previousStatus = queryClient.getQueryData(['like-status', itemId]);

      const isCurrentlyLiked = previousStatus?.data?.isLiked ?? currentIsLiked
      const countBeforeMutate = Number(previousItems?.data?.likeCount ?? currentLikeCount);
      const newCount = isCurrentlyLiked ? countBeforeMutate - 1 : countBeforeMutate + 1;

      queryClient.setQueryData(["item", itemId], (old) => {
        if (!old || !old.data) return old
        return {
          ...old,
          data: {
            ...old.data,
            likeCount: newCount
          }
        };
      });

      queryClient.setQueryData(["like-status", itemId], (old) => {
        const newStatusData = { isLiked: !isCurrentlyLiked }

        if (old) return { ...old, data: newStatusData }
        return { data: newStatusData }
      })

      return { previousItems, previousStatus };
    },
    // rollback
    onError: (error, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(["item", itemId], context.previousItems);
      }
      if (context?.previousStatus) {
        queryClient.setQueryData(["item-status", itemId], context.previousStatus);
      }

      console.error("좋아요 실패:", error)
    },
    // 성공/ 실패 상관없이 동기화를 위해 무효화/리프레시
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["item", itemId] })
      queryClient.invalidateQueries({ queryKey: ["like-status", itemId] })
    }
  });

  const choiceIcon = currentIsLiked ? FullHeartIcon : BinHeartIcon;

  return (
    <button
      className="flex items-center gap-1 border border-solid border-gray-200 rounded-4xl bg-white cursor-pointer px-3 py-1"
      onClick={() => likeMutation.mutate()}
      disabled={likeMutation.isPending}
    >

      <div className="relative text-base w-6 h-6 md:w-8 md:h-8 shrink-0">
        <Image src={choiceIcon} alt="하트 아이콘" fill />
      </div>
      <span className="font-pretendard font-medium leading-6.5 text-gray-500">
        {currentLikeCount}
      </span>
    </button>
  )
}
