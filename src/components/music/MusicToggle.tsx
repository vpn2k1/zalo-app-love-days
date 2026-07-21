import type { KeyboardEvent } from "react";

import { Box, Icon } from "@/components/zaui";

type Props = {
  className?: string;
  label: string;
  onToggle: () => void;
  playing: boolean;
};

export function MusicToggle({ className, label, onToggle, playing }: Props) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onToggle();
  };

  return (
    <Box
      aria-label={label}
      aria-pressed={playing}
      className={getPlayerClassName(playing, className)}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <Box className={getNoteClassName(playing)}>
        <span
          aria-hidden
          className="-translate-y-px font-serif text-[28px] font-bold leading-none"
        >
          ♫
        </span>
      </Box>
      <Box aria-hidden className={getStatusClassName(playing)}>
        <Icon icon={getStatusIcon(playing)} className="text-xs text-c" />
      </Box>
    </Box>
  );
}

function getPlayerClassName(playing: boolean, className?: string) {
  const base =
    "relative grid size-[60px] cursor-pointer select-none place-items-center overflow-visible rounded-full border-2 border-white bg-gradient-to-br transition-[transform,box-shadow] duration-200 active:scale-95";
  const customClassName = className ?? "";
  if (!playing) {
    return `${base} from-white to-[#fff0f6] text-[#d9467e] shadow-[0_10px_26px_rgba(84,49,72,0.18)] ${customClassName}`;
  }

  return `${base} from-[#e84d86] to-[#8b6ff2] text-white ring-4 ring-[#f4bfd4]/35 shadow-[0_12px_30px_rgba(173,58,123,0.34)] ${customClassName}`;
}

function getNoteClassName(playing: boolean) {
  const base =
    "grid size-11 place-items-center rounded-full border transition-colors";
  if (!playing) return `${base} border-[#f4d1df] bg-white`;

  return `${base} border-white/25 bg-white/15`;
}

function getStatusClassName(playing: boolean) {
  const base =
    "absolute -bottom-0.5 -right-0.5 grid size-6 justify-center rounded-full border-2 shadow-[0_3px_8px_rgba(84,49,72,0.2)]";
  if (!playing) return `${base} border-white bg-[#d9467e] text-white`;

  return `${base} border-[#f5d4e2] bg-white text-[#8b6ff2]`;
}

function getStatusIcon(playing: boolean) {
  if (!playing) return "zi-play-solid" as const;

  return "zi-pause-solid" as const;
}
