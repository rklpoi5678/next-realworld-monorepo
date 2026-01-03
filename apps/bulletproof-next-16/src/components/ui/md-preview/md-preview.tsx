'use client';
import DOMPurify from 'isomorphic-dompurify';
import { parse } from 'marked';

export type MdPreviewProps = {
  value: string;
};

export const MdPreview = ({ value = '' }: MdPreviewProps) => {
  // value가 변경 될때만 마크다운을 HTML로 변환하고 보안 검사를 수행
  let sanitizedHtml = '';

  try {
    const rawHtml = parse(value) as string;
    sanitizedHtml = DOMPurify.sanitize(rawHtml);
  } catch (error) {
    console.error('Markdown  parsing error:', error);
    sanitizedHtml = '';
  }

  return (
    <div
      // 참고로 prose는 @tailwindcss/typography플러그인이 제공하는 클래스하
      // 부모요소에 prose만 적어두면 내부 태그들에 자동으로 스타일이 적용된다.
      // 다만 이방법도 안된다면 &_a같은 연산자를 사용하여 전통적인 CSS스타일을 입혀줄수있을것이다.
      className="prose prose-slate  max-w-none w-full p-2  prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:underline"
      dangerouslySetInnerHTML={{
        __html: sanitizedHtml,
      }}
    />
  );
};
