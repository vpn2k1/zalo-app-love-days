import type { Anniversary } from "@/types/anniversary";

export type AlbumSortOrder = "newest" | "oldest" | "week" | "month" | "year";
export type AlbumFilterMode = "all" | "day" | "range" | "year";

export type AlbumFilters = {
  date: string;
  endDate: string;
  mode: AlbumFilterMode;
  startDate: string;
  year: string;
};

export type AlbumPageFormValues = {
  anniversaries: Anniversary[];
  draftFilters: AlbumFilters;
  filters: AlbumFilters;
  sortOrder: AlbumSortOrder;
};

export type AlbumPageState = {
  canLoadMore: boolean;
  filteredCount: number;
  items: Anniversary[];
  loadMore: () => void;
  totalCount: number;
};
