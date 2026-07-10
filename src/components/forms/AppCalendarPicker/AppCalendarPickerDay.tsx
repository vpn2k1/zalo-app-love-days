import type { CellRenderInfo } from "zmp-ui/calendar";

import { Box, Text } from "@/components/zaui";
import { toDateOnlyTime } from "@/components/forms/AppCalendarPicker/AppCalendarPickerUtils";

export function renderDayOfWeekName(dayIndex: number) {
  const day = getDayOfWeekLabel(dayIndex);

  return (
    <Box className="flex w-full items-center justify-center">
      <Text className="text-[10px] text-[#d9467e]">{day}</Text>
    </Box>
  );
}

export function renderDateCell({
  disabledDate,
  selectedDate,
  onSelected,
}: {
  disabledDate: (date: Date) => boolean;
  selectedDate?: Date;
  onSelected: (date: Date) => void;
}) {
  return (date: Date, info: CellRenderInfo<Date>) => {
    if (info.type !== "date") return <>{info.originNode}</>;

    return (
      <DatePickerDay
        date={date}
        disabled={disabledDate(date)}
        selected={isSameDate(selectedDate, date)}
        onSelected={onSelected}
      />
    );
  };
}

function DatePickerDay({
  date,
  disabled,
  selected,
  onSelected,
}: {
  date: Date;
  disabled: boolean;
  selected: boolean;
  onSelected: (date: Date) => void;
}) {
  const selectDate = () => {
    if (disabled) return;

    onSelected(date);
  };

  return (
    <Box
      className="flex items-center justify-center"
      onClick={selectDate}
    >
      <Box className={getDatePickerDayClass(selected, disabled)}>
        <Text className={getDatePickerDayTextClass(selected, disabled)}>
          {date.getDate()}
        </Text>
      </Box>
    </Box>
  );
}

function getDayOfWeekLabel(dayIndex: number) {
  if (dayIndex === 0) return "CN";

  return `T${dayIndex + 1}`;
}

function getDatePickerDayClass(selected: boolean, disabled: boolean) {
  const classes = ["grid size-6 place-items-center rounded-full m-1"];

  if (selected) {
    classes.push(
      "bg-gradient-to-br from-[#ff6b9e] to-[#ff4a85] shadow-md shadow-[#ff4a85]/30",
    );
  }
  if (!selected) classes.push("bg-[#fff4f8]");
  if (disabled) classes.push("opacity-30");

  return classes.join(" ");
}

function getDatePickerDayTextClass(selected: boolean, disabled: boolean) {
  const classes = ["leading-none text-xs"];

  if (selected) classes.push("text-white");
  if (!selected) classes.push("");
  if (disabled) classes.push("line-through");

  return classes.join(" ");
}

function isSameDate(dateA?: Date, dateB?: Date): boolean {
  if (!dateA || !dateB) return false;

  return toDateOnlyTime(dateA) === toDateOnlyTime(dateB);
}
