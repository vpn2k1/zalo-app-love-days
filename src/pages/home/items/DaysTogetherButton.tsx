import { Box, Text } from "@/components/zaui";
import { useEffect, useMemo, useState } from "react";

type ElapsedTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function DaysTogetherButton({ startDate }: { startDate: string }) {
  const [elapsed, setElapsed] = useState<ElapsedTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const startTime = useMemo(() => {
    if (!startDate) return null;

    const [y, m, d] = startDate.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  }, [startDate]);

  useEffect(() => {
    if (!startTime) return;

    const tick = () => {
      const diff = Math.max(0, Date.now() - startTime);

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const rem = diff % (24 * 60 * 60 * 1000);

      const hours = Math.floor(rem / (60 * 60 * 1000));
      const rem2 = rem % (60 * 60 * 1000);

      const minutes = Math.floor(rem2 / (60 * 1000));
      const seconds = Math.floor((rem2 % (60 * 1000)) / 1000);

      setElapsed({ days, hours, minutes, seconds });
    };

    tick();

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  if (!startDate) return null;

  return (
    <Box className="relative mb-3.5 w-full overflow-hidden rounded-[28px] bg-gradient-to-br from-[#fff7fb] via-white to-[#ffe4ef] px-5 py-6 text-center shadow-[0_18px_40px_rgba(217,70,126,0.18)] border border-white/80">
      {/* Decorative blur circles */}
      <Box className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-[#ffd1e3] opacity-60 blur-2xl" />
      <Box className="pointer-events-none absolute -bottom-10 -right-8 h-28 w-28 rounded-full bg-[#f9a8d4] opacity-40 blur-2xl" />

      <Box className="relative z-10">
        <Text className="text-[14px] font-semibold uppercase tracking-[0.22em] text-[#c45a86]">
          Chúng mình đã bên nhau
        </Text>

        <Box className="mt-3 flex items-end justify-center gap-2">
          <Text className="font-serif text-[56px] font-bold leading-none text-[#d9467e] drop-shadow-sm">
            {elapsed.days.toLocaleString()}
          </Text>
          <Text className="mb-1 text-[18px] font-semibold text-[#9b6b82]">
            ngày
          </Text>
        </Box>

        <Box className="mt-5 grid grid-cols-3 gap-2">
          <TimeBox value={elapsed.hours} label="Giờ" />
          <TimeBox value={elapsed.minutes} label="Phút" />
          <TimeBox value={elapsed.seconds} label="Giây" />
        </Box>

        <Text className="mt-4 text-[13px] font-medium text-[#a18495]">
          Từ ngày {formatDate(startDate)}
        </Text>
      </Box>
    </Box>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <Box className="rounded-2xl bg-white/75 px-2 py-3 shadow-sm border border-white">
      <Text className="text-[22px] font-bold leading-none text-[#d9467e]">
        {String(value).padStart(2, "0")}
      </Text>
      <Text className="mt-1 text-[12px] font-medium text-[#9b6b82]">
        {label}
      </Text>
    </Box>
  );
}

function formatDate(value: string) {
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}
