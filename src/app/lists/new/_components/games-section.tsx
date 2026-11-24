"use client";

import { useState } from "react";
import { EditGameRow } from "@/features/game-list/components/edit-game-row";
import { GameSearch } from "@/features/game-list/components/game-search";
import { useAutocompleteGames } from "@/features/game-list/hooks/use-autocomplete-games";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

// 담은 게임 상태가 생기기 전까지 화면을 그리기 위한 더미 데이터 (S-03 캔버스 초기 상태)
const dummyAddedGames = [
  {
    id: "stardew",
    name: "Stardew Valley",
    description:
      "농장을 일구며 마을 사람들과 어울리는 생활 시뮬레이션. 작물을 키우고 동물을 돌보며 계절을 보내요.",
    featured: true,
    comment: "하루가 20분 정도라 딱 하루치만 하고 끄기 좋아요.",
  },
  {
    id: "hades",
    name: "Hades",
    description:
      "지하 세계를 탈출하는 로그라이크 액션. 쓰러질 때마다 조금씩 강해져서 다시 도전해요.",
    featured: false,
    comment: "죽어도 이야기가 이어져서, 한 판만 해도 손해 본 느낌이 없어요.",
  },
  {
    id: "celeste",
    name: "Celeste",
    description:
      "산 정상을 향해 오르는 정밀 플랫포머. 짧은 화면 하나하나가 손으로 다듬은 도전이에요.",
    featured: false,
    comment: "",
  },
];

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
      <div className="flex flex-col gap-3">
        {/* h3 안 N/5 카운터(5개면 text-fg)와 오른쪽 조작 안내 문구. 붙이면 h3와 한 줄로 묶는다 (flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1) */}
        <h3 className="text-label-md text-fg">담은 게임</h3>
        {/* 담은 게임이 없으면 목록 대신 EmptyState(점선 테두리), 순서 바꾸는 중에는 끄는 행 자리에 EditGameRowPlaceholder */}
        <ol className="flex flex-col gap-2">
          {dummyAddedGames.map((game) => (
            <li key={game.id}>
              {/* 코멘트 입력, 대표 지정, 빼기는 담은 게임 상태가 생기면 연결 */}
              <EditGameRow
                name={game.name}
                description={game.description}
                featured={game.featured}
                comment={game.comment}
                commentLimit={100}
                onCommentChange={() => {}}
                onToggleFeatured={() => {}}
                onRemove={() => {}}
              />
            </li>
          ))}
        </ol>
        <p className="text-caption text-fg-tertiary">
          이름 아래 설명은 담는 순간 스팀에서 받아와 그대로 보여줘요(고칠 수
          없어요). 별을 고르지 않으면 맨 위 게임의 이미지가 메인 카드에 쓰여요.
        </p>
      </div>
    </section>
  );
}
