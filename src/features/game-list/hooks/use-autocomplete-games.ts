"use client";

import { useQuery } from "@tanstack/react-query";
import { getAutocompleteGames } from "@/features/game-list/api/game-list.api";
import { gameListKeys } from "@/features/game-list/api/game-list.keys";

export const useAutocompleteGames = (keyword: string) => {
  return useQuery({
    queryKey: gameListKeys.autocompleteGames(keyword),
    queryFn: () => (keyword ? getAutocompleteGames(keyword) : []),
    placeholderData: (previous) => (previous?.length ? previous : undefined),
  });
};
