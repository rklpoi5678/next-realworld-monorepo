import Link from "next/link";

import { Pagination } from "@/components/layouts/Pagination";
import { Dropdown } from "@/components/ui/dropdown";
import { Search } from "@/components/ui/search";
import { articleService } from "@/services/article-service";
import { paths } from "#/config/paths";

import { ArticleBestSection } from "./_components/article-best-section";
import { ArticleSection } from "./_components/article-section";

export default async function ArticlePage(props) {
  const searchParams = await props.searchParams
  const keyword = searchParams.keyword || '';
  const orderBy = searchParams.orderBy || 'recent';
  const page = parseInt(searchParams.page || '1', 10);

  const [articlesData, bestArticlesData] = await Promise.all([
    articleService.getArticles(keyword, orderBy, page),
    articleService.getBestArticles()
  ]);

  const bestArticles = bestArticlesData.data
  const articles = articlesData.data

  const pagination = articlesData.pagination;

  return (
    <main className="container max-w-7xl min-h-screen flex-1 x-[21.4375rem] md:x-7xl my-0 mx-auto p-5">
      {/* 베스트 게시글 영역 */}
      <ArticleBestSection articles={bestArticles} />

      {/* 게시글 영역 */}
      <section className="max-w-full m-0">
        <div className="flex justify-between items-center mb-3">
          <p className="font-pretendard text-xl font-bold mb-6 text-gray-900">
            게시글
          </p>
          <Link
            className="flex justify-center items-center gap-2.5 h-10.5 px-3 py-5.5 rounded-lg bg-primary-100 text-gray-100 font-pretendard text-base font-semibold leading-6.5 no-underline cursor-pointer hover:bg-primary-200 active:bg-primary-300"
            href={paths.app.registration.getHref()}
          >
            글쓰기
          </Link>
        </div>
      </section>
      <div className="flex max-w-480 justify-between mb-6 gap-4">
        <Search placeholder="검색할 상품을 입력해주세요" />
        <Dropdown />
      </div>
      {/* 게시글 목록 렌더링 */}
      {articles.length > 0 ? (
        <ArticleSection articles={articles} />
      ) : (
        <p className="text-center text-gray-500 py-10">등록된 게시글이 없습니다.</p>
      )}

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPage}
      />
    </main>

  );
}
