export interface GameSummary {
  appId: number;
  name: string;
  nameKo: string | null;
}

export interface GameDetail {
  appId: number;
  shortDescription: string | null;
  headerImageUrl: string | null;
}
