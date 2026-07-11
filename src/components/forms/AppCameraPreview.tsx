import type { RefObject } from "react";

import { AppSpinner, Box, Text } from "@/components/zaui";

type Props = {
  error: string;
  loading: boolean;
  ready: boolean;
  videoRef: RefObject<HTMLVideoElement>;
};

export function AppCameraPreview({ error, loading, ready, videoRef }: Props) {
  return (
    <Box className="relative aspect-square w-full overflow-hidden rounded-3xl bg-black shadow-[0_18px_42px_rgba(84,49,72,0.16)]">
      <video
        ref={videoRef}
        autoPlay
        className={getVideoClassName(ready)}
        muted
        playsInline
      />
      {(loading || error) && (
        <Box className="absolute inset-0 z-10 grid place-items-center bg-black/45 px-6 text-center">
          {loading && <AppSpinner />}
          {error && <Text className="text-sm font-bold text-white">{error}</Text>}
        </Box>
      )}
    </Box>
  );
}

function getVideoClassName(ready: boolean) {
  const base = "absolute inset-0 size-full object-cover transition-opacity";
  if (ready) return `${base} opacity-100`;

  return `${base} opacity-0`;
}
