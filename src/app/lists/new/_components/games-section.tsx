"use client";

import { useState } from "react";
import { AddedGameRow } from "@/app/lists/new/_components/added-game-row";
import {
  GameSearch,
  type GameSearchResult,
} from "@/features/game-list/components/game-search";
import { useAutocompleteGames } from "@/features/game-list/hooks/use-autocomplete-games";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface AddedGame {
  appId: number;
  name: string;
  comment: string;
}

export function GamesSection() {
  const [query, setQuery] = useState("");
  const trimmedQuery = query.trim();
  // 비우면 기다리지 않고 빈 검색어로 바꿔, 곧바로 다시 입력해도 비우기 전 검색어가 이어지지 않게 한다
  const keyword = useDebouncedValue(trimmedQuery, trimmedQuery ? 300 : 0);
  const { data } = useAutocompleteGames(keyword);
  const [addedGames, setAddedGames] = useState<AddedGame[]>([]);
  // 대표는 최대 하나라 게임마다 두지 않고 대표 게임의 appId 하나로 둔다
  const [featuredAppId, setFeaturedAppId] = useState<number | null>(null);
  const isFull = addedGames.length >= 5;

  // 결과는 입력창의 순간값이 아니라 반영된 검색어에 대한 것이다. 검색어가 비었으면(입력창을 비우면 곧바로 반영) 결과가 없다
  const results = keyword
    ? data?.map((game) => ({
        id: String(game.appId),
        name: game.nameKo ?? game.name,
        added: addedGames.some((added) => added.appId === game.appId),
      }))
    : undefined;

  const addGame = (game: GameSearchResult) => {
    setAddedGames((games) => [
      ...games,
      { appId: Number(game.id), name: game.name, comment: "" },
    ]);
    setQuery("");
  };

  const changeComment = (appId: number, comment: string) =>
    setAddedGames((games) =>
      games.map((game) => (game.appId === appId ? { ...game, comment } : game)),
    );

  const toggleFeatured = (appId: number) =>
    setFeaturedAppId((current) => (current === appId ? null : appId));

  const removeGame = (appId: number) => {
    setAddedGames((games) => games.filter((game) => game.appId !== appId));
    // 대표를 빼면 대표가 없는 상태로 둔다. 남겨 두면 같은 게임을 다시 담았을 때 대표로 돌아온다
    setFeaturedAppId((current) => (current === appId ? null : current));
  };

  return (
    <section
      aria-labelledby="games-title"
      className="flex flex-col gap-6 pt-8 pb-12"
    >
      <h2 id="games-title" className="text-heading-lg text-fg">
        게임 담기
      </h2>
      {/* 5개 찼을 때 placeholder, error는 아직 연결하지 않았다 */}
      <GameSearch
        query={query}
        onQueryChange={setQuery}
        results={results}
        onSelect={addGame}
        helper={
          isFull
            ? "5개를 모두 담았어요."
            : "3개 이상, 최대 5개까지 담을 수 있어요."
        }
        disabled={isFull}
      />
      <div className="flex flex-col gap-3">
        <h3 className="text-label-md text-fg">
          담은 게임{" "}
          <span className={isFull ? "text-fg" : "text-fg-tertiary"}>
            {addedGames.length}/5
          </span>
        </h3>
        {/* 담은 게임이 없으면 목록 대신 EmptyState(점선 테두리), 순서 바꾸는 중에는 끄는 행 자리에 EditGameRowPlaceholder */}
        <ol className="flex flex-col gap-2">
          {addedGames.map((game) => (
            <li key={game.appId}>
              <AddedGameRow
                appId={game.appId}
                name={game.name}
                featured={game.appId === featuredAppId}
                comment={game.comment}
                onCommentChange={(comment) =>
                  changeComment(game.appId, comment)
                }
                onToggleFeatured={() => toggleFeatured(game.appId)}
                onRemove={() => removeGame(game.appId)}
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
