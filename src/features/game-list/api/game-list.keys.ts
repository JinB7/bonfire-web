export const gameListKeys = {
  all: ["gameLists"] as const,
  autocompleteGames: (keyword: string) =>
    [...gameListKeys.all, "autocompleteGames", keyword] as const,
  gameDetail: (appId: number) =>
    [...gameListKeys.all, "gameDetail", appId] as const,
};
