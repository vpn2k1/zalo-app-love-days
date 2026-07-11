import type { RefObject } from "react";

import { AppSpinner, Box, Text } from "@/components/zaui";

type Props = {
  error: string;
  loading: boolean;
  ready: boolean;
  videoRef: RefObject<HTMLVideoElement>;
  zoom: number;
};

export function AppCameraPreview({
  error,
  loading,
  ready,
  videoRef,
  zoom,
}: Props) {
  return (
    <Box className="mb-5 relative aspect-square w-full overflow-hidden rounded-3xl bg-black shadow-[0_18px_42px_rgba(84,49,72,0.16)]">
      <video
        ref={videoRef}
        autoPlay
        className={getVideoClassName(ready)}
        muted
        playsInline
        style={{ transform: `scale(${getPreviewZoom(zoom)})` }}
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

function getPreviewZoom(zoom: number) {
  if (zoom < 1) return 1;

  return zoom;
}

function getVideoClassName(ready: boolean) {
  const base = "absolute inset-0 size-full object-cover transition-opacity";
  if (ready) return `${base} opacity-100`;

  return `${base} opacity-0`;
}
