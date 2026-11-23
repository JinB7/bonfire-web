export const gameListKeys = {
  all: ["gameLists"] as const,
  autocompleteGames: (keyword: string) =>
    [...gameListKeys.all, "autocompleteGames", keyword] as const,
};
