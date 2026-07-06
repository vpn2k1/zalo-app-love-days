import type { Anniversary } from "@/types/anniversary";
import type { AppUser } from "@/types/user";

export type AlbumPageProps = {
  user: AppUser;
};

export type AlbumSortOrder = "newest" | "oldest" | "week" | "month" | "year";
export type AlbumFilterMode = "all" | "day" | "range" | "year";

export type AlbumFilters = {
  date: string;
  endDate: string;
  mode: AlbumFilterMode;
  startDate: string;
  year: string;
};

export type AlbumPageState = {
  canLoadMore: boolean;
  filters: AlbumFilters;
  filteredCount: number;
  isRefreshing: boolean;
  items: Anniversary[];
  loadMore: () => void;
  refresh: () => void;
  setFilters: (filters: AlbumFilters) => void;
  setSortOrder: (sortOrder: AlbumSortOrder) => void;
  sortOrder: AlbumSortOrder;
  totalCount: number;
};
