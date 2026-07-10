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
    <Box className="relative mx-auto min-h-0 w-full max-w-[430px] flex-1 overflow-hidden rounded-[44px] bg-black [@media(max-height:680px)]:rounded-[30px]">
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
          {error && <Text className="mt-3 text-sm text-white">{error}</Text>}
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
