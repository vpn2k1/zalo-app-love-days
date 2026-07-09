import { useFormContext, useWatch } from "react-hook-form";
import { Box, Icon, Text } from "zmp-ui";
import { onOpenSheet } from "../modules/useSheetCalendar";

export function CalendarMonthYearHeader() {
  const { setValue } = useFormContext();
  const value = useWatch({ name: "viewDate", exact: true }) as Date;

  const month = value.getMonth();
  const year = value.getFullYear();
  
  const goPrevMonth = () => {
    setValue("viewDate", getSafeDate(value, year, month - 1));
  };

  const goNextMonth = () => {
    setValue("viewDate", getSafeDate(value, year, month + 1));
  };

  return (
    <Box className="flex items-center justify-between gap-2 bg-white px-3 py-3">
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
          className=" text-center font-semibold text-[var(--love-primary)]"
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

function getSafeDate(base: Date, year: number, month: number) {
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const day = Math.min(base.getDate(), lastDayOfMonth);

  return new Date(year, month, day);
}
