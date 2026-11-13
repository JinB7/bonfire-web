import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/styles/utils";

export interface HeaderProps {
  /** 서비스명 미정이면 텍스트. 기본 "서비스명" */
  wordmark?: ReactNode;
  /** 워드마크 링크. 주면 링크로 그린다 */
  href?: string;
  /** 오른쪽 행동: Button(primary, sm) "목록 만들기" → Button(ghost) "로그인" 또는 Avatar 32 */
  children?: ReactNode;
  className?: string;
}

export function Header({
  wordmark = "서비스명",
  href,
  children,
  className,
}: HeaderProps) {
  const wordmarkClassName = "text-heading-md text-fg";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 border-b bg-canvas px-4 text-fg md:px-6 lg:px-8",
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4">
        {href ? (
          <Link
            href={href}
            className={cn(
              wordmarkClassName,
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
            )}
          >
            {wordmark}
          </Link>
        ) : (
          <span className={wordmarkClassName}>{wordmark}</span>
        )}
        <div className="flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
