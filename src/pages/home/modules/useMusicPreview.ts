import { useCallback, useEffect, useRef, useState } from "react";

import { pauseMusicPlayback } from "@/hooks/useMusicPlayer";

type PreviewSource = File | string | null;

const DEFAULT_STATE = {
  currentTime: 0,
  duration: 0,
  error: false,
  playing: false,
};

export function useMusicPreview(source: PreviewSource) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    setState(DEFAULT_STATE);
    if (!source) return;

    const objectUrl = getObjectUrl(source);
    const preview = new Audio(objectUrl.url);
    audioRef.current = preview;
    preview.preload = "metadata";

    const updateProgress = () => {
      setState((current) => ({
        ...current,
        currentTime: getFiniteTime(preview.currentTime),
        duration: getFiniteTime(preview.duration),
      }));
    };
    const handlePlay = () => {
      setState((current) => ({ ...current, error: false, playing: true }));
    };
    const handlePause = () => {
      setState((current) => ({ ...current, playing: false }));
    };
    const handleError = () => {
      setState((current) => ({ ...current, error: true, playing: false }));
    };

    preview.addEventListener("durationchange", updateProgress);
    preview.addEventListener("loadedmetadata", updateProgress);
    preview.addEventListener("timeupdate", updateProgress);
    preview.addEventListener("play", handlePlay);
    preview.addEventListener("pause", handlePause);
    preview.addEventListener("ended", handlePause);
    preview.addEventListener("error", handleError);

    return () => {
      preview.removeEventListener("durationchange", updateProgress);
      preview.removeEventListener("loadedmetadata", updateProgress);
      preview.removeEventListener("timeupdate", updateProgress);
      preview.removeEventListener("play", handlePlay);
      preview.removeEventListener("pause", handlePause);
      preview.removeEventListener("ended", handlePause);
      preview.removeEventListener("error", handleError);
      preview.pause();
      preview.removeAttribute("src");
      preview.load();
      if (objectUrl.revoke) URL.revokeObjectURL(objectUrl.url);
      if (audioRef.current !== preview) return;

      audioRef.current = null;
    };
  }, [source]);

  const toggle = useCallback(async () => {
    const preview = audioRef.current;
    if (!preview) return;
    if (!preview.paused) {
      preview.pause();
      return;
    }

    pauseMusicPlayback();
    if (preview.ended) preview.currentTime = 0;
    try {
      await preview.play();
    } catch {
      setState((current) => ({ ...current, error: true, playing: false }));
    }
  }, []);

  return { ...state, toggle };
}

function getObjectUrl(source: File | string) {
  if (typeof source === "string") return { revoke: false, url: source };

  return { revoke: true, url: URL.createObjectURL(source) };
}

function getFiniteTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;

  return value;
}
