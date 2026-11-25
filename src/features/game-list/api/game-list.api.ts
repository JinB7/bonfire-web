import { apiRequest } from "@/lib/api/client";
import type {
  GameDetail,
  GameSummary,
} from "@/features/game-list/types/game-list";

export const getAutocompleteGames = (keyword: string) =>
  apiRequest<GameSummary[]>({
    url: "/games/autocomplete",
    params: { keyword },
  });

export const getGameDetail = (appId: number) =>
  apiRequest<GameDetail>({ url: `/games/${appId}/detail` });
