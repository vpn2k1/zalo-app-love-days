import { useRef, type ChangeEvent } from "react";

import { MAX_MUSIC_FILE_SIZE_MB, MUSIC_FILE_ACCEPT } from "@/config/music";
import { Box, Button, Text } from "@/components/zaui";

import { DaysTogetherMusicPreview } from "./DaysTogetherMusicPreview";

type Props = {
  musicUrl: string;
  removed: boolean;
  selectedFile: File | null;
  onRemove: () => void;
  onSelect: (file: File) => void;
};

export function DaysTogetherMusicField({
  musicUrl,
  removed,
  selectedFile,
  onRemove,
  onSelect,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewSource = getPreviewSource(musicUrl, removed, selectedFile);
  const hasMusic = Boolean(previewSource);
  const statusLabel = getStatusLabel(musicUrl, removed, selectedFile);
  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    onSelect(file);
  };

  return (
    <Box className="relative mt-4 overflow-hidden rounded-[24px] border border-white/90 bg-gradient-to-br from-[#fff0f6] via-white to-[#f8efff] p-4 shadow-[0_14px_34px_rgba(134,45,83,0.12)]">
      <Box className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-[#f9a8d4]/25 blur-2xl" />
      <input
        ref={inputRef}
        accept={MUSIC_FILE_ACCEPT}
        aria-label="Chọn tệp nhạc MP3"
        className="hidden"
        type="file"
        onChange={selectFile}
      />
      <Box className="relative flex items-center gap-3">
        <Box className="grid size-12 flex-none place-items-center rounded-2xl bg-gradient-to-br from-[#d9467e] to-[#8b6ff2] text-white shadow-[0_8px_20px_rgba(201,47,103,0.25)]">
          <Text aria-hidden className="font-serif text-3xl font-bold text-white">
            ♫
          </Text>
        </Box>
        <Box className="min-w-0 flex-1">
          <Box className="flex items-center gap-2">
            <Text className="truncate text-sm font-bold text-[#3c2435]">
              Giai điệu của chúng mình
            </Text>
            {statusLabel && (
              <Text className="flex-none rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase text-[#c45a86] shadow-sm">
                {statusLabel}
              </Text>
            )}
          </Box>
          <Text className="mt-0.5 truncate text-xs text-[#8b6b7d]">
            {getMusicDescription(musicUrl, removed, selectedFile)}
          </Text>
        </Box>
      </Box>

      <DaysTogetherMusicPreview source={previewSource} />

      <Box className="relative mt-4 flex gap-2">
        <Button
          fullWidth
          htmlType="button"
          size="small"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
        >
          {getSelectLabel(hasMusic)}
        </Button>
        {hasMusic && (
          <Button
            fullWidth
            htmlType="button"
            size="small"
            variant="tertiary"
            onClick={onRemove}
          >
            Gỡ nhạc
          </Button>
        )}
      </Box>
      <Text className="relative mt-3 text-center text-[11px] leading-4 text-[#9b7a8e]">
        Chỉ hỗ trợ MP3, tối đa {MAX_MUSIC_FILE_SIZE_MB}MB.
      </Text>
    </Box>
  );
}

function getMusicDescription(
  musicUrl: string,
  removed: boolean,
  selectedFile: File | null,
) {
  if (selectedFile) return `${selectedFile.name} · ${formatFileSize(selectedFile.size)}`;
  if (removed) return "Nhạc sẽ được gỡ sau khi lưu";
  if (!musicUrl) return "Chọn một bài hát dành riêng cho hai bạn";

  return "Nhạc nền đang được sử dụng";
}

function getSelectLabel(hasMusic: boolean) {
  if (!hasMusic) return "Thêm nhạc";

  return "Đổi nhạc";
}

function getPreviewSource(
  musicUrl: string,
  removed: boolean,
  selectedFile: File | null,
) {
  if (selectedFile) return selectedFile;
  if (removed || !musicUrl) return null;

  return musicUrl;
}

function getStatusLabel(
  musicUrl: string,
  removed: boolean,
  selectedFile: File | null,
) {
  if (selectedFile) return "Mới";
  if (removed || !musicUrl) return "";

  return "Đã lưu";
}

function formatFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}
