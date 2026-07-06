import type { Anniversary } from "@/types/anniversary";
import type { AppUser } from "@/types/user";

export type AnniversariesPageProps = {
  user: AppUser;
};

export type AnniversaryFilter = "all" | "yearly" | "none";

export type AnniversariesPageState = {
  canLoadMore: boolean;
  filter: AnniversaryFilter;
  filteredCount: number;
  items: Anniversary[];
  loadMore: () => void;
  query: string;
  setFilter: (filter: AnniversaryFilter) => void;
  setQuery: (query: string) => void;
  totalCount: number;
};
