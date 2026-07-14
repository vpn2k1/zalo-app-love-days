import { mockDb } from "@/services/mockDb";
import type { Anniversary, AnniversaryPage } from "@/types/anniversary";

export function getMockAnniversaryPage(
  coupleId: string,
  page: number,
  limit: number,
): AnniversaryPage {
  const from = (page - 1) * limit;
  const items = mockDb
    .getAnniversaries(coupleId)
    .sort(compareAnniversaryDateDesc)
    .slice(from, from + limit + 1);

  return { hasMore: items.length > limit, items: items.slice(0, limit), limit, page };
}

export function normalizePositiveNumber(
  value: number | undefined,
  fallback: number,
) {
  if (!value) return fallback;
  if (!Number.isFinite(value)) return fallback;
  if (value < 1) return fallback;
  return Math.floor(value);
}

export function compareAnniversaryDateDesc(
  left: Anniversary,
  right: Anniversary,
) {
  return getDateTime(right.date) - getDateTime(left.date);
}

export function isAnniversaryOnDate(anniversary: Anniversary, date: string) {
  if (anniversary.date === date) return true;
  if (anniversary.repeat_type !== "yearly") return false;
  return getMonthDay(anniversary.date) === getMonthDay(date);
}

function getMonthDay(value: string) {
  return value.slice(5);
}

function getDateTime(value: string) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return 0;
  return time;
}
