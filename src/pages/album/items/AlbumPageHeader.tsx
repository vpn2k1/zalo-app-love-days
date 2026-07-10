import { useRef } from "react";

import { AppPageHeader } from "@/components/AppPageHeader";
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
      <AppPageHeader
        title="Albums"
        subtitle={`${filteredCount}/${totalCount} ảnh kỷ niệm`}
        onBack={onBack}
        action={
          <Button
            className="!size-10 !min-h-10 !min-w-10 rounded-full bg-[#d9467e] p-0 text-white"
            htmlType="button"
            icon={<Icon icon="zi-filter" />}
            variant="tertiary"
            onClick={() => sheetRef.current?.open()}
          />
        }
      />
      <Box className="mb-3 min-w-0">
        <Text className=" overflow-hidden text-ellipsis whitespace-nowrap rounded-2xl bg-[#fff5f8] px-3 py-2 text-sm font-[850] text-[#3a2232]">
          {getFilterLabel(filters)} · {getSortLabel(sortOrder)}
        </Text>
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
