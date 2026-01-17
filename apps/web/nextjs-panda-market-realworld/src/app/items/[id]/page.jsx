import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { itemService } from "@/services/item-service";

import { BackToItems } from "./_components/back-to-articles";
import { ItemCommentForm } from "./_components/comment/item-comment-form";
import { ItemCommentSection } from "./_components/comment/item-comment-section";
import { ItemHeaderSection } from "./_components/header/item-header-section";

export default async function ItemsDetailPage({ params }) {
  const queryClient = new QueryClient()
  const { id } = await params

  await queryClient.prefetchQuery({
    queryKey: ["item", id],
    queryFn: () => itemService.getItemById(id)
  })

  return (
    <main className="container mx-auto flex flex-col min-h-screen w-full max-w-7xl my-8 p-6">
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/*상품 제목 + 좋아요 */}
        <ItemHeaderSection itemId={id} />

        {/* 댓글 입력 */}
        <ItemCommentForm itemId={id} />

        {/* 댓글 리스트 */}
        <ItemCommentSection itemId={id} />
      </HydrationBoundary>

      <BackToItems />
    </main >
  );
} 