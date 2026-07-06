import { useRef } from "react";
import { Box, Button, Icon, Text } from "@/components/zaui";
import type { AppSheetRef } from "@/components/zaui";
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
  onBack: () => void;
};

export function AlbumPageHeader({
  filteredCount,
  filters,
  setFilters,
  setSortOrder,
  sortOrder,
  totalCount,
  onBack,
}: Props) {
  const sheetRef = useRef<AppSheetRef>(null);

  return (
    <Box className="mb-4 rounded-[24px] border border-[var(--love-border)] bg-white/85 p-3.5 shadow-[0_14px_30px_rgba(201,47,103,0.08)]">
      <Box className="flex items-center gap-3">
        <Button
          className="min-h-10 min-w-10 rounded-full bg-white/90 p-0 text-[#d9467e]"
          htmlType="button"
          icon={<Icon icon="zi-chevron-left" />}
          variant="tertiary"
          onClick={onBack}
        />
        <Box className="min-w-0 flex-1">
          <Text.Title size="small" className="font-serif text-[#2f1d2a]">
            Bộ ảnh kỷ niệm
          </Text.Title>
          <Text className="text-xs font-bold text-[#8b6b7d]">
            {filteredCount}/{totalCount} ảnh
          </Text>
        </Box>
        <Button
          className="min-h-10 rounded-full bg-[#d9467e] px-3 text-xs font-[850] text-white"
          htmlType="button"
          icon={<Icon icon="zi-filter" />}
          size="small"
          onClick={() => sheetRef.current?.open()}
        >
          Lọc
        </Button>
      </Box>
      <Text className="mt-3 overflow-hidden text-ellipsis whitespace-nowrap rounded-2xl bg-[#fff5f8] px-3 py-2 text-sm font-[850] text-[#3a2232]">
        {getFilterLabel(filters)} · {getSortLabel(sortOrder)}
      </Text>
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
