---
name: api-patterns
description: API 호출 함수나 React Query 훅(useQuery, useMutation)을 작성·수정·리뷰할 때 사용. axios 클라이언트(apiRequest) 사용법, API 함수·쿼리 키·훅의 파일 위치와 네이밍, 캐시 무효화 규칙을 정리한 기준 문서.
---

# React Query 훅 패턴

- HTTP 호출은 `src/lib/api/client.ts`의 `apiRequest`로만 한다
- 훅은 layout의 `QueryProvider`(`src/providers/`) 안에서만 동작한다
- 도메인별 파일 위치
  - API 함수: `src/features/<도메인>/api/<도메인>.api.ts`
  - 쿼리 키: `src/features/<도메인>/api/<도메인>.keys.ts`
  - 요청 바디 타입: `src/features/<도메인>/types/<도메인>.ts` — `<동사><Resource>Request`
  - 훅: `src/features/<도메인>/hooks/` — 조회는 `use<Resource>s`, 전송은 `use<동사><Resource>`

## API 함수

`apiRequest<T>`는 응답 `{ success, data, message }`에서 `data`만 꺼내 반환한다. `baseURL`이 `${NEXT_PUBLIC_API_URL}/api/v1`이라서 url에는 `/api/v1`을 빼고 쓴다. 쿼리스트링은 `params`로 넘긴다. Route Handler(mock 포함)도 `Response.json({ success: true, data })` 형식으로 응답해야 한다.

```typescript
// src/features/game-list/api/game-list.api.ts
import { apiRequest } from "@/lib/api/client";
import type {
  CreateGameListRequest,
  GameList,
  GameSummary,
} from "@/features/game-list/types/game-list";

export const getGames = () => apiRequest<GameSummary[]>({ url: "/games" });

export const getAutocompleteGames = (keyword?: string) =>
  apiRequest<GameSummary[]>({
    url: "/games/autocomplete",
    params: { keyword },
  });

export const createGameList = (body: CreateGameListRequest) =>
  apiRequest<GameList>({ url: "/game-lists", method: "POST", data: body });
```

## 쿼리 키

쿼리 키는 문자열 배열로 직접 쓰지 않고 도메인별 키 객체로 관리한다. 하위 키는 `all`에서 이어 만들어서, `all`로 무효화하면 도메인 쿼리 전체가 함께 무효화되게 한다. 파라미터가 있는 쿼리는 파라미터를 키에 넣어 값마다 따로 캐시되게 한다.

```typescript
// src/features/game-list/api/game-list.keys.ts
export const gameListKeys = {
  all: ["gameLists"] as const,
  list: () => [...gameListKeys.all, "list"] as const,
  games: () => [...gameListKeys.all, "games"] as const,
  autocompleteGames: (keyword?: string) =>
    [...gameListKeys.all, "autocompleteGames", keyword] as const,
};
```

## 쿼리 (데이터 조회)

```typescript
// src/features/game-list/hooks/use-games.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getGames } from "@/features/game-list/api/game-list.api";
import { gameListKeys } from "@/features/game-list/api/game-list.keys";

export const useGames = () => {
  return useQuery({
    queryKey: gameListKeys.games(),
    queryFn: getGames,
  });
};
```

```typescript
// src/features/game-list/hooks/use-autocomplete-games.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAutocompleteGames } from "@/features/game-list/api/game-list.api";
import { gameListKeys } from "@/features/game-list/api/game-list.keys";

export const useAutocompleteGames = (keyword?: string) => {
  return useQuery({
    queryKey: gameListKeys.autocompleteGames(keyword),
    queryFn: () => getAutocompleteGames(keyword),
  });
};
```

## 데이터 전송 (useMutation)

요청 바디는 `mutate`의 인자로 넘긴다. 전송 결과로 캐시된 쿼리의 데이터가 바뀔 때만 `onSuccess`에서 그 쿼리를 무효화한다. 바뀌는 쿼리가 없으면(로그 전송, 문의 제출 등) 무효화하지 않는다. 바뀌는 쿼리만 골라 무효화한다. 목록을 만들어도 게임 검색 결과는 그대로이므로 `all`이 아니라 `list()`만 무효화한다.

```typescript
// src/features/game-list/hooks/use-create-game-list.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGameList } from "@/features/game-list/api/game-list.api";
import { gameListKeys } from "@/features/game-list/api/game-list.keys";

export const useCreateGameList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGameList,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: gameListKeys.list() }),
  });
};
```

```tsx
// 컴포넌트에서 호출
const { mutate, isPending } = useCreateGameList();

<Button disabled={isPending} onClick={() => mutate(form)}>
  목록 등록
</Button>;
```
