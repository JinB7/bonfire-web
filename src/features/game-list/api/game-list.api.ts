import { apiRequest } from "@/lib/api/client";
import type { GameSummary } from "@/features/game-list/types/game-list";

export const getAutocompleteGames = (keyword: string) =>
  apiRequest<GameSummary[]>({
    url: "/games/autocomplete",
    params: { keyword },
  });
