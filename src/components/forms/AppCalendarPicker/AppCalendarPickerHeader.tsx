import { Box, Icon, Text } from "@/components/zaui";
import {
  clampDate,
  createSafeDate,
} from "@/components/forms/AppCalendarPicker/AppCalendarPickerMonthYearSheet";

type Props = {
  endDate?: Date;
  startDate?: Date;
  viewDate: Date;
  onOpenSheet: () => void;
  onViewDateChange: (date: Date) => void;
};

export function AppCalendarPickerHeader({
  endDate,
  startDate,
  viewDate,
  onOpenSheet,
  onViewDateChange,
}: Props) {
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  const goPrevMonth = () => {
    const nextDate = createSafeDate(year, month - 1, viewDate.getDate());
    onViewDateChange(clampDate(nextDate, startDate, endDate));
  };

  const goNextMonth = () => {
    const nextDate = createSafeDate(year, month + 1, viewDate.getDate());
    onViewDateChange(clampDate(nextDate, startDate, endDate));
  };

  return (
    <Box className="flex items-center justify-between gap-2 bg-white">
      <Box type="button" onClick={goPrevMonth}>
        <Icon
          icon="zi-chevron-left"
          size={30}
          className="text-[var(--love-primary)]"
        />
      </Box>

      <Box
        onClick={onOpenSheet}
        className="flex min-w-0 flex-1 items-center justify-center gap-2"
      >
        <Text.Title
          size="small"
          className="text-center font-semibold text-[var(--love-primary)]"
        >
          {`Tháng ${month + 1} - ${year}`}
        </Text.Title>
      </Box>

      <Box type="button" onClick={goNextMonth}>
        <Icon
          icon="zi-chevron-right"
          size={30}
          className="text-[var(--love-primary)]"
        />
      </Box>
    </Box>
  );
}
