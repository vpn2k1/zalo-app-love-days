import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { Anniversary } from "@/types/anniversary";
import { parseLocalDate } from "@/utils/date";
import type {
  AlbumPhoto,
  AlbumPageFormValues,
  AlbumPageState,
  AlbumSortOrder,
} from "../types/AlbumPageType";

const PAGE_SIZE = 10;

export function useAlbumPage(): AlbumPageState {
  const { control } = useFormContext<AlbumPageFormValues>();
  const [anniversaries, filters, sortOrder] = useWatch({
    control,
    exact: true,
    name: ["anniversaries", "filters", "sortOrder"],
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters, sortOrder]);

  const albumPhotos = useMemo(
    () => anniversaries.reduce<AlbumPhoto[]>((items, anniversary) => {
      return items.concat(getAlbumPhotos(anniversary));
    }, []),
    [anniversaries],
  );
  const filteredItems = useMemo(
    () => getFilteredItems(albumPhotos, filters, sortOrder),
    [albumPhotos, filters, sortOrder],
  );
  const items = filteredItems.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredItems.length;

  const loadMore = () => {
    setVisibleCount((current) => current + PAGE_SIZE);
  };

  return {
    canLoadMore,
    filteredCount: filteredItems.length,
    items,
    loadMore,
    totalCount: albumPhotos.length,
  };
}

function getFilteredItems(
  items: AlbumPhoto[],
  filters: AlbumPageFormValues["filters"],
  sortOrder: AlbumSortOrder,
) {
  return [...items]
    .filter((item) => matchesFilters(item, filters))
    .sort((left, right) => compareByDate(left, right, sortOrder));
}

function matchesFilters(
  item: AlbumPhoto,
  filters: AlbumPageFormValues["filters"],
) {
  if (filters.mode === "all") return true;
  if (filters.mode === "day") return matchesDay(item, filters.date);
  if (filters.mode === "range") return matchesRange(item, filters);
  if (filters.mode === "year") return matchesYear(item, filters.year);

  return true;
}

function matchesDay(item: AlbumPhoto, date: string) {
  if (!date) return true;

  return item.date === date;
}

function matchesRange(
  item: AlbumPhoto,
  filters: AlbumPageFormValues["filters"],
) {
  const time = parseLocalDate(item.date).getTime();
  if (filters.startDate && time < parseLocalDate(filters.startDate).getTime()) {
    return false;
  }
  if (filters.endDate && time > parseLocalDate(filters.endDate).getTime()) {
    return false;
  }

  return true;
}

function matchesYear(item: AlbumPhoto, year: string) {
  if (!year) return true;

  return parseLocalDate(item.date).getFullYear() === Number(year);
}

function compareByDate(left: AlbumPhoto, right: AlbumPhoto, sortOrder: AlbumSortOrder) {
  const diff = getSortTime(right.date, sortOrder) - getSortTime(left.date, sortOrder);
  if (sortOrder === "oldest") return -diff;
  if (diff !== 0) return diff;

  return parseLocalDate(right.date).getTime() - parseLocalDate(left.date).getTime();
}

function getAlbumPhotos(anniversary: Anniversary): AlbumPhoto[] {
  return getImageUrls(anniversary).map((imageUrl, index) => ({
    anniversary,
    date: anniversary.date,
    description: anniversary.note,
    id: `${anniversary.id}-${index}`,
    imageUrl,
    title: anniversary.title,
  }));
}

function getImageUrls(anniversary: Anniversary) {
  if (anniversary.image_urls && anniversary.image_urls.length > 0) {
    return anniversary.image_urls.filter(Boolean);
  }
  if (!anniversary.image_url) return [];

  return [anniversary.image_url];
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
