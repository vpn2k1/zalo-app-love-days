import type { RefObject } from "react";
import type { Control } from "react-hook-form";
import {
  AppCalendarPicker,
  AppImagePicker,
  AppTextInput,
} from "@/components/forms";
import { AppSheet, Box, Button, Text } from "@/components/zaui";
import type { AppSheetRef } from "@/components/zaui";
import type { HomeDisplayFormValues } from "../types/HomePageType";

type ElapsedTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Props = {
  control: Control<HomeDisplayFormValues>;
  elapsed: ElapsedTime;
  loading?: boolean;
  disabled?: boolean;
  sheetRef: RefObject<AppSheetRef>;
  startDate: string;
  onClose: () => void;
  onSave: () => Promise<void>;
};

export function DaysTogetherSheet({
  control,
  elapsed,
  loading,
  disabled,
  sheetRef,
  onClose,
  onSave,
}: Props) {
  return (
    <AppSheet ref={sheetRef}>
      <Box
        className="px-5 pb-5 pt-2 overflow-y-auto overflow-x-hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Box className="mb-5 text-center">
          <Text className="mt-2 text-[13px] leading-5 text-[#716773]">
            Thay đổi thông tin không gian
          </Text>
        </Box>

        <Box className="rounded-[22px] border border-[rgba(134,97,124,0.18)] bg-white/70 p-3 shadow-[0_10px_28px_rgba(84,49,72,0.08)]">
          <AppImagePicker
            control={control}
            name="backgroundUrl"
            label="Ảnh nền"
            optional
          />
        </Box>

        <Box className="my-5 grid grid-cols-2 gap-2 text-center min-[360px]:grid-cols-4">
          <TimePill value={elapsed.days.toLocaleString()} label="Ngày" />
          <TimePill
            value={String(elapsed.hours).padStart(2, "0")}
            label="Giờ"
          />
          <TimePill
            value={String(elapsed.minutes).padStart(2, "0")}
            label="Phút"
          />
          <TimePill
            value={String(elapsed.seconds).padStart(2, "0")}
            label="Giây"
          />
        </Box>

        <AppCalendarPicker
          control={control}
          name="startDate"
          label="Ngày bắt đầu"
          required
        />

        <Box className="mt-5 grid grid-cols-2 gap-3">
          <Button
            fullWidth
            htmlType="button"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          >
            Đóng
          </Button>
          <Button
            fullWidth
            disabled={loading || disabled}
            htmlType="button"
            loading={loading}
            variant="primary"
            onClick={onSave}
          >
            Lưu
          </Button>
        </Box>
      </Box>
    </AppSheet>
  );
}

function TimePill({ value, label }: { value: string; label: string }) {
  return (
    <Box className="min-w-0 rounded-2xl border border-white bg-white/80 px-1.5 py-3 shadow-sm">
      <Text className="text-[clamp(15px,5vw,18px)] font-bold leading-none text-[#d9467e]">
        {value}
      </Text>
      <Text className="mt-1 text-[11px] font-semibold text-[#9b6b82]">
        {label}
      </Text>
    </Box>
  );
}

function formatDate(value: string) {
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}
