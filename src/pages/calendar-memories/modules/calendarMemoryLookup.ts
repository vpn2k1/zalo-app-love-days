import type { Anniversary } from "@/types/anniversary";
import { parseLocalDate, toDateInputValue } from "@/utils/date";

export function createCalendarMemoryLookup(anniversaries: Anniversary[]) {
  const exactDateMap = new Map<string, Anniversary>();
  const yearlyDateMap = new Map<string, Anniversary>();

  anniversaries.forEach((memory) => {
    if (memory.repeat_type === "yearly") {
      yearlyDateMap.set(getMonthDayKey(memory.date), memory);
      return;
    }

    exactDateMap.set(memory.date, memory);
  });

  return {
    findByDate(date: Date) {
      const exactMemory = exactDateMap.get(toDateInputValue(date));
      if (exactMemory) return exactMemory;

      return yearlyDateMap.get(getMonthDayKey(toDateInputValue(date)));
    },
  };
}

function getMonthDayKey(value: string) {
  const date = parseLocalDate(value);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${month}-${day}`;
}
