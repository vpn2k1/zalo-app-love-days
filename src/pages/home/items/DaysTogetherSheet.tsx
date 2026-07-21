import type { RefObject, SyntheticEvent } from "react";
import type { Control } from "react-hook-form";

import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import {
  AppCalendarPicker,
  AppImagePicker,
} from "@/components/forms";
import { AppSheet, Box, Button, Text } from "@/components/zaui";
import type { AppSheetRef } from "@/components/zaui";
import type { DaysTogetherFormValues } from "../types/HomePageType";
import { DaysTogetherMusicField } from "./DaysTogetherMusicField";

type ElapsedTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type Props = {
  control: Control<DaysTogetherFormValues>;
  elapsed: ElapsedTime;
  loading?: boolean;
  disabled?: boolean;
  musicRemoved: boolean;
  musicUrl: string;
  selectedMusicFile: File | null;
  sheetRef: RefObject<AppSheetRef>;
  onClose: () => void;
  onMusicRemove: () => void;
  onMusicSelect: (file: File) => void;
  onSave: () => Promise<void>;
};

export function DaysTogetherSheet({
  control,
  elapsed,
  loading,
  disabled,
  musicRemoved,
  musicUrl,
  selectedMusicFile,
  sheetRef,
  onClose,
  onMusicRemove,
  onMusicSelect,
  onSave,
}: Props) {
  const stopSheetEvent = (event: SyntheticEvent) => {
    event.stopPropagation();
  };

  const close = (event: SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onClose();
  };

  return (
    <AppSheet ref={sheetRef}>
      <Box
        className="flex h-full min-h-0 flex-col overflow-hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onClick={stopSheetEvent}
        onPointerDown={stopSheetEvent}
        onTouchStart={stopSheetEvent}
      >
        <BlockingLoadingOverlay
          show={Boolean(loading)}
          message="Đang lưu thông tin không gian..."
        />
        <Box className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pb-4 pt-2">
          <Box className="mb-5 text-center">
            <Text className="mt-2 text-[13px] leading-5 text-[#716773]">
              Thay đổi thông tin không gian
            </Text>
          </Box>

          <Box className="rounded-[22px] border border-[rgba(134,97,124,0.18)] bg-white/70 p-3 shadow-[0_10px_28px_rgba(84,49,72,0.08)]">
            <AppImagePicker
              control={control}
              name="background"
              label="Ảnh nền"
              optional
            />
          </Box>

          <DaysTogetherMusicField
            musicUrl={musicUrl}
            removed={musicRemoved}
            selectedFile={selectedMusicFile}
            onRemove={onMusicRemove}
            onSelect={onMusicSelect}
          />

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
            defaultValue={new Date()}
            label="Ngày bắt đầu"
            maskClosable
            required
          />
        </Box>

        <Box className="grid flex-none grid-cols-2 gap-3 border-t border-pink-100 bg-white/80 px-5 pb-[calc(18px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
          <Button
            fullWidth
            htmlType="button"
            variant="secondary"
            onClick={close}
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
