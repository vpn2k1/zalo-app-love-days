import { useRef } from "react";

import { type AppSheetRef, Box, Button, Icon, Text } from "@/components/zaui";
import { AlbumFilterSheet } from "./AlbumFilterSheet";
import { getFilterLabel, getSortLabel } from "./albumFilterHelpers";
import type { AlbumFilters, AlbumSortOrder } from "../types/AlbumPageType";

type Props = {
  filteredCount: number;
  filters: AlbumFilters;
  setFilters: (filters: AlbumFilters) => void;
  setSortOrder: (sortOrder: AlbumSortOrder) => void;
  sortOrder: AlbumSortOrder;
  totalCount: number;
};

export function AlbumPageControls({
  filteredCount,
  filters,
  setFilters,
  setSortOrder,
  sortOrder,
  totalCount,
}: Props) {
  const sheetRef = useRef<AppSheetRef>(null);

  return (
    <Box className="mb-3 rounded-[18px] bg-white/90 p-3">
      <Box className="flex items-center justify-between gap-3">
        <Box className="min-w-0">
          <Text className="text-xs font-bold text-[#8b6b7d]">
            {filteredCount}/{totalCount} ảnh
          </Text>
          <Text className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-[850] text-[#3a2232]">
            {getFilterLabel(filters)} · {getSortLabel(sortOrder)}
          </Text>
        </Box>
        <Button
          className="min-h-10 rounded-full bg-[#d9467e] px-3 text-xs font-[850] text-white"
          htmlType="button"
          icon={<Icon icon="zi-filter" />}
          size="small"
          onClick={() => sheetRef.current?.open()}
        >
          Bộ lọc
        </Button>
      </Box>
      <AlbumFilterSheet
        ref={sheetRef}
        filters={filters}
        setFilters={setFilters}
        setSortOrder={setSortOrder}
        sortOrder={sortOrder}
      />
    </Box>
  );
}
