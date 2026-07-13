import { useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { Anniversary } from "@/types/anniversary";
import type {
  AnniversaryFilter,
  AnniversariesPageFormValues,
  AnniversariesPageState,
} from "../types/AnniversariesPageType";

const PAGE_SIZE = 8;

export function useAnniversariesPage(): AnniversariesPageState {
  const { control } = useFormContext<AnniversariesPageFormValues>();
  const [anniversaries, filter, query] = useWatch({
    control,
    exact: true,
    name: ["anniversaries", "filter", "query"],
  });
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

  const loadMore = () => {
    setVisibleCount((current) => current + PAGE_SIZE);
  };

  return {
    canLoadMore,
    filteredCount: filteredItems.length,
    items,
    loadMore,
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
