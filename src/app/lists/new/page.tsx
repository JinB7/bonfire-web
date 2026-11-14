"use client";

import { useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { GameSearch } from "@/features/game-list/components/game-search";

export default function NewListPage() {
  const [query, setQuery] = useState("");

  return (
    <PageLayout>
      <div className="flex flex-col gap-2 pt-8 pb-2">
        <h1 className="text-title-md text-fg">목록 만들기</h1>
        <p className="text-body-sm text-fg-tertiary">
          게임을 담고, 어떤 상황에 추천하는지 고른 다음, 제목과 한 줄 소개를
          붙여주세요.
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-12 pb-16">
        {/* form "목록 등록" 자리. 강조된 결과 없이 Enter를 누르면 GameSearch가 제출을 막지 않아 onSubmit에서 preventDefault가 필요하다 */}
        <div className="flex min-w-0 grow-999 basis-140 flex-col">
          <section
            aria-labelledby="games-title"
            className="flex flex-col gap-6 pt-8 pb-12"
          >
            <h2 id="games-title" className="text-heading-lg text-fg">
              게임 담기
            </h2>
            {/* 검색 API가 없어 results를 넘기지 않는다(결과 판 숨김). 고른 게임 담기, 5개 찼을 때 disabled·placeholder·helper, error는 담은 게임 상태가 생기면 연결 */}
            <GameSearch
              query={query}
              onQueryChange={setQuery}
              onSelect={() => setQuery("")}
              helper="3개 이상, 최대 5개까지 담을 수 있어요."
            />
            {/* 담은 게임 N/5 + 조작 안내 → EditGameRow 목록 또는 EmptyState → 설명·대표 이미지 안내 */}
          </section>

          <section
            aria-labelledby="tags-title"
            className="flex flex-col gap-4 border-t py-12"
          >
            <div className="flex flex-col gap-1">
              {/* h2 옆 고른 개수 N/3 (items-baseline gap-3) */}
              <h2 id="tags-title" className="text-heading-lg text-fg">
                이 게임들, 어떤 상황에 추천하나요?
              </h2>
              <p className="text-caption text-fg-tertiary">
                1~3개 골라주세요. 3개를 고르면 나머지는 잠겨요.
              </p>
            </div>
            {/* FilterChipGroup × 3 (시간 · 에너지 · 감정) + FilterChip */}
          </section>

          <section
            aria-labelledby="info-title"
            className="flex flex-col gap-6 border-t pt-12"
          >
            <h2 id="info-title" className="text-heading-lg text-fg">
              제목과 소개
            </h2>
            {/* Field 제목(필수) + TextInput, Field 한 줄 소개(필수) + Textarea */}
          </section>
        </div>

        <aside
          aria-labelledby="preview-title"
          className="flex min-w-0 grow basis-80 flex-col gap-4 pt-8 lg:sticky lg:top-20"
        >
          <h2 id="preview-title" className="text-label-md text-fg">
            미리보기
          </h2>
          {/* h2 아래 gap-1 안내(대표 이미지 이름) → ListCard → 등록 조건 체크리스트 → Button primary "등록"(전체 폭) */}
        </aside>
      </div>
    </PageLayout>
  );
}
