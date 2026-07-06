import { useCallback, useEffect, useMemo, useState } from "react";
import type { Anniversary } from "@/types/anniversary";
import type {
  AnniversaryFilter,
  AnniversariesPageState,
} from "../types/AnniversariesPageType";

const PAGE_SIZE = 8;

type Input = {
  anniversaries: Anniversary[];
};

export function useAnniversariesPage({
  anniversaries,
}: Input): AnniversariesPageState {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AnniversaryFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter, query]);

  const filteredItems = useMemo(
    () => getFilteredItems(anniversaries, filter, query),
    [anniversaries, filter, query],
  );
  const items = filteredItems.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredItems.length;

  const loadMore = useCallback(() => {
    setVisibleCount((current) => current + PAGE_SIZE);
  }, []);

  return {
    canLoadMore,
    filter,
    filteredCount: filteredItems.length,
    items,
    loadMore,
    query,
    setFilter,
    setQuery,
    totalCount: anniversaries.length,
  };
}

function getFilteredItems(
  anniversaries: Anniversary[],
  filter: AnniversaryFilter,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();
  return [...anniversaries]
    .sort(compareAnniversaryDateDesc)
    .filter((item) => matchesFilter(item, filter))
    .filter((item) => matchesQuery(item, normalizedQuery));
}

function matchesFilter(item: Anniversary, filter: AnniversaryFilter) {
  if (filter === "all") return true;

  return item.repeat_type === filter;
}

function matchesQuery(item: Anniversary, query: string) {
  if (!query) return true;
  if (item.title.toLowerCase().includes(query)) return true;
  if (item.note && item.note.toLowerCase().includes(query)) return true;

  return false;
}

function compareAnniversaryDateDesc(left: Anniversary, right: Anniversary) {
  return getDateTime(right.date) - getDateTime(left.date);
}

function getDateTime(value: string) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return 0;

  return time;
}
