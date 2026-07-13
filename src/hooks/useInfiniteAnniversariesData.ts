import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { infiniteAnniversariesQueryKey } from "@/config/queryKeys";
import { anniversaryService } from "@/services/anniversaryService";
import type { Anniversary, AnniversaryPage } from "@/types/anniversary";

export const ANNIVERSARIES_PAGE_LIMIT = 20;

export function useInfiniteAnniversariesData(id: string) {
  const anniversariesQuery = useInfiniteQuery({
    queryKey: infiniteAnniversariesQueryKey(id),
    queryFn: ({ pageParam }) =>
      anniversaryService.listPage(id, {
        limit: ANNIVERSARIES_PAGE_LIMIT,
        page: pageParam,
      }),
    enabled: Boolean(id),
    getNextPageParam: getNextAnniversariesPageParam,
    initialPageParam: 1,
  });
  const anniversaries = useMemo(
    () =>
      anniversariesQuery.data?.pages.reduce(
        (items, page) => items.concat(page.items),
        [] as Anniversary[],
      ) ?? [],
    [anniversariesQuery.data],
  );

  return { anniversaries, anniversariesQuery };
}

export function getNextAnniversariesPageParam(lastPage: AnniversaryPage) {
  if (!lastPage.hasMore) return undefined;

  return lastPage.page + 1;
}
