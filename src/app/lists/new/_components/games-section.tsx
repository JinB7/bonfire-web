"use client";

import { useState } from "react";
import { GameSearch } from "@/features/game-list/components/game-search";
import { useAutocompleteGames } from "@/features/game-list/hooks/use-autocomplete-games";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function GamesSection() {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  // 비우면 기다리지 않고 빈 검색어로 바꿔, 곧바로 다시 입력해도 비우기 전 검색어가 이어지지 않게 한다
  const keyword = useDebouncedValue(trimmedQuery, trimmedQuery ? 300 : 0);
  const { data } = useAutocompleteGames(keyword);

  // 결과는 입력창의 순간값이 아니라 반영된 검색어에 대한 것이다. 검색어가 비었으면(입력창을 비우면 곧바로 반영) 결과가 없다
  const results = keyword
    ? data?.map((game) => ({
        id: String(game.appId),
        name: game.nameKo ?? game.name,
      }))
    : undefined;

  return (
    <section
      aria-labelledby="games-title"
      className="flex flex-col gap-6 pt-8 pb-12"
    >
      <h2 id="games-title" className="text-heading-lg text-fg">
        게임 담기
      </h2>
      {/* 고른 게임 담기, 5개 찼을 때 disabled·placeholder·helper, error는 담은 게임 상태가 생기면 연결 */}
      <GameSearch
        query={query}
        onQueryChange={setQuery}
        results={results}
        onSelect={() => setQuery("")}
        helper="3개 이상, 최대 5개까지 담을 수 있어요."
      />
      {/* 담은 게임 N/5 + 조작 안내 → EditGameRow 목록 또는 EmptyState → 설명·대표 이미지 안내 */}
    </section>
  );
}
