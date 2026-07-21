import { MusicToggle } from "@/components/music/MusicToggle";
import { Box, Progress, Text } from "@/components/zaui";

import { useMusicPreview } from "../modules/useMusicPreview";

type Props = {
  source: File | string | null;
};

export function DaysTogetherMusicPreview({ source }: Props) {
  const preview = useMusicPreview(source);
  if (!source) return null;

  const maxCompleted = getMaxCompleted(preview.duration);

  return (
    <Box className="relative mt-4 overflow-hidden rounded-[20px] border border-[#f3d6e3] bg-gradient-to-br from-white via-[#fff9fc] to-[#f7efff] p-3.5 shadow-[0_10px_24px_rgba(134,45,83,0.09)]">
      <Box className="pointer-events-none absolute -right-5 -top-8 size-20 rounded-full bg-[#d8c8ff]/30 blur-xl" />
      <Box className="relative flex items-center gap-3">
        <MusicToggle
          className="flex-none"
          label={getButtonLabel(preview.playing)}
          onToggle={() => void preview.toggle()}
          playing={preview.playing}
        />
        <Box className="min-w-0 flex-1">
          <Box className="mb-2 flex items-center justify-between gap-2">
            <Text className={getStatusClassName(preview.playing)}>
              {getStatusLabel(preview.playing)}
            </Text>
          </Box>
          <Progress
            className="w-full"
            completed={Math.min(preview.currentTime, maxCompleted)}
            maxCompleted={maxCompleted}
            strokeColor="#d9467e"
            strokeWidth={7}
            trailColor="#f6dce7"
          />
          <Box className="mt-1.5 flex items-center justify-between">
            <Text className="text-[10px] font-semibold tabular-nums text-[#b06b8b]">
              {formatTime(preview.currentTime)}
            </Text>
            <Text className="text-[10px] font-semibold tabular-nums text-[#9b7a8e]">
              {formatTime(preview.duration)}
            </Text>
          </Box>
        </Box>
      </Box>
      {preview.error && (
        <Text
          className="relative mt-3 rounded-xl bg-[#fff0f4] px-3 py-2 text-xs font-medium text-[#c33159]"
          role="alert"
        >
          Không thể nghe thử tệp này.
        </Text>
      )}
    </Box>
  );
}

function getMaxCompleted(duration: number) {
  if (duration > 0) return duration;

  return 1;
}

function getPreviewTitle(source: File | string) {
  if (typeof source === "string") return "Nghe thử nhạc hiện tại";

  return "Nghe thử trước khi lưu";
}

function getButtonLabel(playing: boolean) {
  if (!playing) return "Phát bản nghe thử";

  return "Dừng bản nghe thử";
}

function getStatusClassName(playing: boolean) {
  const base =
    "flex-none rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide";
  if (!playing) return `${base} bg-[#f7eaf0] text-[#9b6b82]`;

  return `${base} bg-[#ffe0ec] text-[#c92f67]`;
}

function getStatusLabel(playing: boolean) {
  if (!playing) return "Sẵn sàng";

  return "Đang phát";
}

function formatTime(seconds: number) {
  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}
