import { useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { AppPageHeader } from "@/components/AppPageHeader";
import { Box, Button, Icon, Text } from "@/components/zaui";
import type { AppSheetRef } from "@/components/zaui";

import { AlbumFilterSheet } from "./AlbumFilterSheet";
import { getFilterLabel, getSortLabel } from "./albumFilterHelpers";
import type { AlbumPageFormValues } from "../types/AlbumPageType";

type Props = {
  filteredCount: number;
  totalCount: number;
  onBack: () => void;
  onQuickAdd: () => void;
};

export function AlbumPageHeader({
  filteredCount,
  totalCount,
  onBack,
  onQuickAdd,
}: Props) {
  const sheetRef = useRef<AppSheetRef>(null);
  const { control } = useFormContext<AlbumPageFormValues>();
  const [filters, sortOrder] = useWatch({
    control,
    exact: true,
    name: ["filters", "sortOrder"],
  });

  return (
    <Box>
      <AppPageHeader
        title="Albums"
        subtitle={`${filteredCount}/${totalCount} ảnh kỷ niệm`}
        onBack={onBack}
        action={
          <Box className="flex items-center gap-2">
            <Button
              className="!size-10 !min-h-10 !min-w-10 rounded-full bg-[#fff0f6] p-0 text-[#d9467e]"
              htmlType="button"
              icon={<Icon icon="zi-plus" />}
              variant="tertiary"
              onClick={onQuickAdd}
            />
            <Button
              className="!size-10 !min-h-10 !min-w-10 rounded-full bg-[#d9467e] p-0 text-white"
              htmlType="button"
              icon={<Icon icon="zi-filter" />}
              variant="tertiary"
              onClick={() => sheetRef.current?.open()}
            />
          </Box>
        }
      />
      <Box className="mb-3 min-w-0">
        <Text className=" overflow-hidden text-ellipsis whitespace-nowrap rounded-2xl bg-[#fff5f8] px-3 py-2 text-sm font-[850] text-[#3a2232]">
          {getFilterLabel(filters)} · {getSortLabel(sortOrder)}
        </Text>
      </Box>
      <AlbumFilterSheet ref={sheetRef} />
    </Box>
  );
}
