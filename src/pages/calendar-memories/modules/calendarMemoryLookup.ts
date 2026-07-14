import type { Anniversary } from "@/types/anniversary";
import { parseLocalDate, toDateInputValue } from "@/utils/date";

export function createCalendarMemoryLookup(anniversaries: Anniversary[]) {
  const exactDateMap = new Map<string, Anniversary[]>();
  const yearlyDateMap = new Map<string, Anniversary[]>();

  anniversaries.forEach((memory) => {
    if (memory.repeat_type === "yearly") {
      addMemory(yearlyDateMap, getMonthDayKey(memory.date), memory);
      return;
    }

    addMemory(exactDateMap, memory.date, memory);
  });

  return {
    findByDate(date: Date) {
      const exactMemories = exactDateMap.get(toDateInputValue(date)) ?? [];
      const yearlyMemories = yearlyDateMap.get(
        getMonthDayKey(toDateInputValue(date)),
      ) ?? [];

      return [...exactMemories, ...yearlyMemories];
    },
  };
}

function addMemory(
  map: Map<string, Anniversary[]>,
  key: string,
  memory: Anniversary,
) {
  map.set(key, [...(map.get(key) ?? []), memory]);
}

function getMonthDayKey(value: string) {
  const date = parseLocalDate(value);
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${month}-${day}`;
}
