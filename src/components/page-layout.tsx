import type { ReactNode } from "react";
import { cn } from "@/lib/styles/utils";

export interface PageLayoutProps {
  children?: ReactNode;
  /** 안쪽 콘텐츠 영역(최대 폭 1200)에 붙는다 */
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <main className="px-4 md:px-6 lg:px-8">
      <div className={cn("mx-auto max-w-[1200px]", className)}>{children}</div>
    </main>
  );
}
