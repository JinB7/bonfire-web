import { PageLayout } from "@/components/page-layout";

export default function Home() {
  return (
    <PageLayout>
      <h1 className="py-8 text-title-md text-fg">
        지금 내 상태에 맞는 게임 목록
      </h1>

      <div className="flex flex-wrap items-start gap-8 pb-16">
        <aside
          aria-labelledby="filter-title"
          className="flex min-w-0 grow basis-58 flex-col gap-4"
        >
          <div className="flex min-h-control-lg items-center justify-between gap-2 border-b">
            <h2 id="filter-title" className="text-heading-lg text-fg">
              상황 필터
            </h2>
            {/* 선택 해제: Button ghost sm (고른 칩이 있을 때만) */}
          </div>
          <p className="text-caption text-fg-tertiary">
            여러 개 고를 수 있어요. 같은 축은 하나라도, 다른 축끼리는 모두 맞는
            목록을 보여줘요.
          </p>
          {/* FilterChipGroup × 3 (시간 · 에너지 · 감정) + FilterChip */}
        </aside>

        <section
          aria-label="게임 목록"
          className="flex min-w-0 grow-999 basis-140 flex-col gap-4"
        >
          {/* Tabs(최신 · 인기) → 목록 개수 → ListCard 그리드 또는 EmptyState */}
        </section>
      </div>
    </PageLayout>
  );
}
