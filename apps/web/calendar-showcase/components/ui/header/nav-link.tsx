"use client"

/**
 * next.js 에서 재사용 가능한 네비게이션 링크 컴포넌트 (원자)
 * pathname에 따라 링크 스타일을 자동으로 변경(활성/비활성 상태 표시) 해주는 기능
 */
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation';

interface NavLinkProps extends LinkProps {
  children: React.ReactNode; // 링크 내부에 들어갈내용
  isMobile?: boolean;        // 모바일 뷰인지 여부를 판단하는 플래그(스타일 분기)
  classes?: string;          // 추가적인 CSS 클래스를 받기 위한 속성
  end?: boolean;             // true일시 정확히 일치하는 경로에서만 활성화된다. ( end=true => /about 경로아래 /about/team에서는 비활성화)
}

export function NavLink({
  // default value 
  children,
  isMobile = false,
  classes = "",
  end = false,
  ...props // 나머지 link속성 (href 등)
}: NavLinkProps) {
  const pathname = usePathname();
  // end로 일치하는 경로 false일시 href=/post 일때 post/1 페이지도 활성으로 간주
  const isActive = end
    ? pathname === props.href.toString()
    : pathname?.startsWith(props.href.toString() ?? "")

  // 활성 여부에 따라 모바일 상태에 따라 동적으로 CSS클래스를 생성하는 함수이다.
  // classes로 원래 클래스에 추가
  const linkClass = ({
    classes,
    isActive,
  }: {
    classes: string;
    isActive: boolean;
  }) =>
    isMobile
      // 모바일 스타일 
      ? `${classes} flex flex-col items-center text-sm ${isActive ? "text-brand-primary" : "text-gray-500"}`
      // 데스크톱 스타일 
      : `${classes} hover:text-brand-primary transition-colors ${isActive ? "text-brand-primary" : "text-gray-600 dark:text-gray-300"}`;

  // 최종 적용될 CSS 클래스를 계산한다.
  // null 일시 false로 설정
  const css = linkClass({ isActive: isActive ?? false, classes });

  // 계산된 CSS클래스와 나머지 속성들을 next.js 의 link컴포넌트에 적용하여 반환한다.
  return (
    <Link className={css} {...props}>
      {children}
    </Link>
  )
}