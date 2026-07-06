import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

import { AppSheet, type AppSheetRef, Box, Button, Text } from "@/components/zaui";
import { AlbumFilterFields } from "./AlbumFilterFields";
import {
  emptyFilters,
  getOptionClassName,
  getSortClassName,
  normalizeFilters,
} from "./albumFilterHelpers";
import type {
  AlbumFilterMode,
  AlbumFilters,
  AlbumSortOrder,
} from "../types/AlbumPageType";

type Props = {
  filters: AlbumFilters;
  setFilters: (filters: AlbumFilters) => void;
  setSortOrder: (sortOrder: AlbumSortOrder) => void;
  sortOrder: AlbumSortOrder;
};

const FILTER_MODES: Array<{ label: string; value: AlbumFilterMode }> = [
  { label: "Tất cả", value: "all" },
  { label: "Theo ngày", value: "day" },
  { label: "Khoảng ngày", value: "range" },
  { label: "Theo năm", value: "year" },
];

const SORT_OPTIONS: Array<{ label: string; value: AlbumSortOrder }> = [
  { label: "Cũ nhất", value: "oldest" },
  { label: "Mới nhất", value: "newest" },
  { label: "Tuần", value: "week" },
  { label: "Tháng", value: "month" },
  { label: "Năm", value: "year" },
];

export const AlbumFilterSheet = forwardRef<AppSheetRef, Props>(
  function AlbumFilterSheet({
    filters,
    setFilters,
    setSortOrder,
    sortOrder,
  }: Props, ref) {
    const { control, handleSubmit, reset, setValue } = useForm<AlbumFilters>({
      defaultValues: filters,
    });
    const mode = useWatch({ control, name: "mode" });
    const sheetRef = useRef<AppSheetRef>(null);

    useEffect(() => {
      reset(filters);
    }, [filters, reset]);

    useImperativeHandle(ref, () => ({
      close: () => sheetRef.current?.close(),
      open: () => sheetRef.current?.open(),
    }));

    const applyFilters = handleSubmit((values) => {
      setFilters(normalizeFilters(values));
      sheetRef.current?.close();
    });

    const clearFilters = () => {
      const nextFilters = emptyFilters();
      reset(nextFilters);
      setFilters(nextFilters);
    };

    return (
      <AppSheet ref={sheetRef} title="Quản lý bộ lọc">
        <Box className="px-4 pb-[calc(18px+env(safe-area-inset-bottom))] pt-2">
          <Text className="mb-2 text-xs font-bold uppercase text-[#8b6b7d]">
            Lọc ảnh
          </Text>
          <Box className="grid grid-cols-3 gap-2">
            {FILTER_MODES.map((item) => (
              <Button
                className={getOptionClassName(mode, item.value)}
                htmlType="button"
                key={item.value}
                size="small"
                variant="tertiary"
                onClick={() => setValue("mode", item.value)}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <AlbumFilterFields control={control} mode={mode} />
          <Text className="mb-2 mt-4 text-xs font-bold uppercase text-[#8b6b7d]">
            Sắp xếp
          </Text>
          <Box className="grid grid-cols-2 gap-2">
            {SORT_OPTIONS.map((item) => (
              <Button
                className={getSortClassName(sortOrder, item.value)}
                htmlType="button"
                key={item.value}
                size="small"
                variant="tertiary"
                onClick={() => setSortOrder(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Box className="mt-5 grid grid-cols-2 gap-2">
            <Button
              className="min-h-11 rounded-full bg-[#fff5f8] text-sm font-[850] text-[#8b6b7d]"
              htmlType="button"
              variant="tertiary"
              onClick={clearFilters}
            >
              Xóa lọc
            </Button>
            <Button
              className="min-h-11 rounded-full bg-[#d9467e] text-sm font-[850] text-white"
              htmlType="button"
              onClick={() => void applyFilters()}
            >
              Áp dụng
            </Button>
          </Box>
        </Box>
      </AppSheet>
    );
  },
);
