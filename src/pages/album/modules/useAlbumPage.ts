import { useEffect, useMemo, useState } from "react";

import type { Anniversary } from "@/types/anniversary";
import { parseLocalDate } from "@/utils/date";
import type {
  AlbumFilters,
  AlbumPageState,
  AlbumSortOrder,
} from "../types/AlbumPageType";

const PAGE_SIZE = 10;
type Input = {
  anniversaries: Anniversary[];
};

export function useAlbumPage({
  anniversaries,
}: Input): AlbumPageState {
  const [filters, setFilters] = useState<AlbumFilters>({
    date: "",
    endDate: "",
    mode: "all",
    startDate: "",
    year: "",
  });
  const [sortOrder, setSortOrder] = useState<AlbumSortOrder>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters, sortOrder]);

  const albumItems = useMemo(
    () => anniversaries.filter(hasImage),
    [anniversaries],
  );
  const filteredItems = useMemo(
    () => getFilteredItems(albumItems, filters, sortOrder),
    [albumItems, filters, sortOrder],
  );
  const items = filteredItems.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredItems.length;

  const loadMore = () => {
    setVisibleCount((current) => current + PAGE_SIZE);
  };

  return {
    canLoadMore,
    filteredCount: filteredItems.length,
    filters,
    items,
    loadMore,
    setFilters,
    setSortOrder,
    sortOrder,
    totalCount: albumItems.length,
  };
}

function getFilteredItems(
  items: Anniversary[],
  filters: AlbumFilters,
  sortOrder: AlbumSortOrder,
) {
  return [...items]
    .filter((item) => matchesFilters(item, filters))
    .sort((left, right) => compareByDate(left, right, sortOrder));
}

function hasImage(item: Anniversary) {
  return Boolean(item.image_url);
}

function matchesFilters(item: Anniversary, filters: AlbumFilters) {
  if (filters.mode === "all") return true;
  if (filters.mode === "day") return matchesDay(item, filters.date);
  if (filters.mode === "range") return matchesRange(item, filters);
  if (filters.mode === "year") return matchesYear(item, filters.year);

  return true;
}

function matchesDay(item: Anniversary, date: string) {
  if (!date) return true;

  return item.date === date;
}

function matchesRange(item: Anniversary, filters: AlbumFilters) {
  const time = parseLocalDate(item.date).getTime();
  if (filters.startDate && time < parseLocalDate(filters.startDate).getTime()) {
    return false;
  }
  if (filters.endDate && time > parseLocalDate(filters.endDate).getTime()) {
    return false;
  }

  return true;
}

function matchesYear(item: Anniversary, year: string) {
  if (!year) return true;

  return parseLocalDate(item.date).getFullYear() === Number(year);
}

function compareByDate(
  left: Anniversary,
  right: Anniversary,
  sortOrder: AlbumSortOrder,
) {
  const diff = getSortTime(right.date, sortOrder) - getSortTime(left.date, sortOrder);
  if (sortOrder === "oldest") return -diff;
  if (diff !== 0) return diff;

  return parseLocalDate(right.date).getTime() - parseLocalDate(left.date).getTime();
}

function getSortTime(value: string, sortOrder: AlbumSortOrder) {
  const date = parseLocalDate(value);
  if (sortOrder === "week") return getWeekStartTime(date);
  if (sortOrder === "month") return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  if (sortOrder === "year") return new Date(date.getFullYear(), 0, 1).getTime();

  return date.getTime();
}

function getWeekStartTime(date: Date) {
  const day = date.getDay();
  let mondayOffset = 1 - day;
  if (day === 0) {
    mondayOffset = -6;
  }
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + mondayOffset,
  ).getTime();
}
