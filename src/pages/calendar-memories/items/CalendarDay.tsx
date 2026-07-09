import { Box, Text } from "@/components/zaui";
import { useWatch } from "react-hook-form";

function toDateOnlyTime(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

function isSameDate(dateA?: Date, dateB?: Date): boolean {
  if (!dateA || !dateB) return false;

  return toDateOnlyTime(dateA) === toDateOnlyTime(dateB);
}
export function CalendarDay({
  hasMemory,
  date,
  selected,
  onSelected,
}: {
  hasMemory?: boolean;
  date: Date;
  selected: boolean;
  onSelected: (date: Date) => void;
}) {
  const dayLabel = date.getDate().toString();
  return (
    <Box
      className="flex h-12 w-full items-center justify-center"
      onClick={() => onSelected(date)}
    >
      <Box
        className={[
          "grid size-8 place-items-center rounded-full",
          hasMemory
            ? "bg-gradient-to-br from-[#ff6b9e] to-[#ff4a85] shadow-md shadow-[#ff4a85]/30"
            : "bg-[#fff4f8]",
          selected ? "ring-2 ring-[#ff4a85] ring-offset-2" : "",
        ].join(" ")}
      >
        <Text
          className={[
            "leading-none",
            hasMemory ? "font-bold text-white" : "font-semibold",
          ].join(" ")}
        >
          {dayLabel}
        </Text>
      </Box>
    </Box>
  );
}
