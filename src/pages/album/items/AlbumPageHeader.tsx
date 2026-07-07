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
    <Box>
      <Box className="flex items-center gap-2">
        <Button
          className="min-h-10 min-w-10 p-0 text-[#d9467e]"
          htmlType="button"
          icon={<Icon icon="zi-chevron-left" />}
          variant="tertiary"
          onClick={onBack}
        />
        <Text.Title size="small" className="font-serif text-[#2f1d2a]">
          Albums
        </Text.Title>
      </Box>
      <Box className="min-w-0 flex justify-between  my-1">
        <Text className=" overflow-hidden text-ellipsis whitespace-nowrap rounded-2xl bg-[#fff5f8] px-3 py-2 text-sm font-[850] text-[#3a2232]">
          {getFilterLabel(filters)} · {getSortLabel(sortOrder)}
        </Text>
        <Box
          className="flex items-center justify-center p-2  rounded-full bg-[#d9467e] text-white"
          onClick={() => sheetRef.current?.open()}
        >
          <Icon icon="zi-filter" />
        </Box>
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
