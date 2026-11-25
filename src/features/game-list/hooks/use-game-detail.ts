"use client";

import { useQuery } from "@tanstack/react-query";
import { getGameDetail } from "@/features/game-list/api/game-list.api";
import { gameListKeys } from "@/features/game-list/api/game-list.keys";

export const useGameDetail = (appId: number) => {
  return useQuery({
    queryKey: gameListKeys.gameDetail(appId),
    queryFn: () => getGameDetail(appId),
    // 다시 요청하는 동안 설명 자리에 스켈레톤이 계속 남는다. 실패하면 바로 빈칸으로 둔다
    retry: false,
  });
};
