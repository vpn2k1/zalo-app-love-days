import type { Anniversary } from "@/types/anniversary";

export type AnniversaryFilter = "all" | "yearly" | "none";

export type AnniversariesPageFormValues = {
  anniversaries: Anniversary[];
  filter: AnniversaryFilter;
  query: string;
};

export type AnniversariesPageState = {
  canLoadMore: boolean;
  filteredCount: number;
  items: Anniversary[];
  loadMore: () => void;
  totalCount: number;
};
