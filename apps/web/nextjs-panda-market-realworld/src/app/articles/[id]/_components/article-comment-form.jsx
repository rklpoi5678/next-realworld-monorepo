
export function ArticleCommentForm({ article, action }) {
  const tempAuthorId = 72;

  return (
    <section className="w-full mb-8">
      <h3 className="font-pretendard font-semibold mb-2 leading-6.5">
        댓글달기
      </h3>
      <form action={action} >
        <input type="hidden" name="authorId" value={tempAuthorId} />
        <input type="hidden" name="articleId" value={article.id} />
        <textarea
          name="context"
          className="min-h-20 w-full p-2.5 border-0 rounded-md resize-none mb-2 bg-gray-100"
          placeholder="댓글을 입력해주세요..."
        />
        <div className="flex justify-end">
          <button className="flex justify-center items-center py-3 px-5.75 grow-0 bg-gray-400 border-none rounded-md text-white whitespace-nowrap cursor-pointer hover:bg-primary-100">
            등록
          </button>
        </div>
      </form>
    </section>
  )
}
