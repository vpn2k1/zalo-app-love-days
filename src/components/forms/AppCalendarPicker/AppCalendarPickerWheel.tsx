import { useEffect, useMemo, useRef, type ReactNode } from "react";

import { Box } from "@/components/zaui";

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const WHEEL_PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

export type WheelOption<T extends number | string> = {
  label: ReactNode;
  value: T;
};

type Props<T extends number | string> = {
  value: T;
  options: WheelOption<T>[];
  onChange: (value: T) => void;
};

export function AppCalendarPickerWheel<T extends number | string>({
  value,
  options,
  onChange,
}: Props<T>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIndex = useMemo(() => {
    const index = options.findIndex((option) => option.value === value);
    if (index < 0) return 0;

    return index;
  }, [options, value]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    requestAnimationFrame(() => {
      element.scrollTo({
        top: selectedIndex * ITEM_HEIGHT,
        behavior: "auto",
      });
    });
  }, [selectedIndex]);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element) return;

    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);

    scrollTimerRef.current = setTimeout(() => {
      const nextIndex = Math.round(element.scrollTop / ITEM_HEIGHT);
      const safeIndex = Math.max(0, Math.min(options.length - 1, nextIndex));
      const nextOption = options[safeIndex];

      element.scrollTo({
        top: safeIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });

      if (!nextOption) return;
      if (nextOption.value === value) return;

      onChange(nextOption.value);
    }, 80);
  };

  return (
    <Box className="relative overflow-hidden" style={{ height: WHEEL_HEIGHT }}>
      <Box
        className="pointer-events-none absolute left-0 right-0 z-10 rounded-2xl bg-[#ffe4ef]/80"
        style={{
          top: WHEEL_PADDING,
          height: ITEM_HEIGHT,
        }}
      />
      <Box className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-white via-white/90 to-transparent" />
      <Box className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white via-white/90 to-transparent" />

      <div
        ref={scrollRef}
        className="relative z-30 h-full overflow-y-auto snap-y snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          paddingTop: WHEEL_PADDING,
          paddingBottom: WHEEL_PADDING,
        }}
        onScroll={handleScroll}
      >
        {options.map((option) => (
          <WheelButton
            key={String(option.value)}
            active={option.value === value}
            option={option}
            onChange={onChange}
          />
        ))}
      </div>
    </Box>
  );
}

function WheelButton<T extends number | string>({
  active,
  option,
  onChange,
}: {
  active: boolean;
  option: WheelOption<T>;
  onChange: (value: T) => void;
}) {
  const activeClass = getWheelButtonClass(active);

  return (
    <button
      type="button"
      className={[
        "flex w-full snap-center items-center justify-center rounded-2xl text-center transition",
        activeClass,
      ].join(" ")}
      style={{ height: ITEM_HEIGHT }}
      onClick={() => onChange(option.value)}
    >
      {option.label}
    </button>
  );
}

function getWheelButtonClass(active: boolean) {
  if (!active) return "text-[15px] font-semibold text-[#8b6b7d]";

  return "text-[17px] font-extrabold text-[#d9467e]";
}
