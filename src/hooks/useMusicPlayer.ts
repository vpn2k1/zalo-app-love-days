import { useEffect, useState } from "react";

type MusicPlayerState = {
  name: "music-player" | null;
  error: boolean;
  playing: boolean;
};

const defaultState: MusicPlayerState = {
  name: null,
  error: false,
  playing: false,
};
const listeners = new Set<(state: MusicPlayerState) => void>();
let currentState = defaultState;
let currentUrl: string | null = null;
let audio: HTMLAudioElement | null = null;

function emit(state: MusicPlayerState) {
  currentState = state;
  listeners.forEach((listener) => listener(state));
}

function setMusicSource(url: string | null) {
  if (!url) {
    clearMusicSource();
    return;
  }
  if (url === currentUrl) return;

  clearMusicSource();
  currentUrl = url;
  audio = new Audio(url);
  audio.loop = true;
  audio.preload = "none";
  audio.addEventListener("play", handlePlay);
  audio.addEventListener("pause", handlePause);
  audio.addEventListener("error", handleError);
  emit({ name: "music-player", error: false, playing: false });
}

function clearMusicSource() {
  currentUrl = null;
  if (!audio) {
    emit(defaultState);
    return;
  }

  audio.pause();
  audio.removeEventListener("play", handlePlay);
  audio.removeEventListener("pause", handlePause);
  audio.removeEventListener("error", handleError);
  audio.removeAttribute("src");
  audio.load();
  audio = null;
  emit(defaultState);
}

function handlePlay() {
  emit({ name: "music-player", error: false, playing: true });
}

function handlePause() {
  if (!currentUrl) return;

  emit({ name: "music-player", error: false, playing: false });
}

function handleError() {
  emit({ name: "music-player", error: true, playing: false });
}

async function toggleMusicPlayback() {
  if (!audio) return false;
  if (!audio.paused) {
    audio.pause();
    return true;
  }

  try {
    await audio.play();
    return true;
  } catch {
    handleError();
    return false;
  }
}

export function pauseMusicPlayback() {
  if (!audio || audio.paused) return;

  audio.pause();
}

export function useMusicPlayer(url: string | null) {
  const [state, setState] = useState(currentState);

  useEffect(() => {
    listeners.add(setState);

    return () => {
      listeners.delete(setState);
    };
  }, []);

  useEffect(() => {
    setMusicSource(url);

    return () => {
      if (url !== currentUrl) return;

      clearMusicSource();
    };
  }, [url]);

  return {
    ...state,
    toggle: toggleMusicPlayback,
  };
}
