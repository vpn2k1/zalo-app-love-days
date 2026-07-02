import type { Anniversary, UpcomingAnniversary } from "@/types/anniversary";
import type { Couple } from "@/types/couple";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const todayDateString = () => {
  const now = new Date();
  return toDateInputValue(now);
};

export const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const diffInDays = (from: string, to = todayDateString()) => {
  const start = startOfDay(parseLocalDate(from)).getTime();
  const end = startOfDay(parseLocalDate(to)).getTime();
  return Math.max(0, Math.floor((end - start) / MS_PER_DAY));
};

export const diffFromNowParts = (from: string) => {
  const start = parseLocalDate(from).getTime();
  const diff = Math.max(0, Date.now() - start);
  const totalMinutes = Math.floor(diff / 60000);
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
};

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parseLocalDate(value));

export const getNextAnniversary = (
  couple: Couple,
  anniversaries: Anniversary[],
): UpcomingAnniversary | null => {
  const base: Anniversary[] = [
    {
      id: "love-start",
      couple_id: couple.id,
      title: "Ngày bắt đầu yêu",
      date: couple.start_date,
      repeat_type: "yearly",
      note: "Cột mốc đầu tiên của hai bạn",
      created_by: couple.created_by,
    },
    ...anniversaries,
  ];

  const today = startOfDay(new Date());
  const upcoming = base
    .map((item) => {
      const nextDate =
        item.repeat_type === "yearly"
          ? nextYearlyDate(item.date, today)
          : startOfDay(parseLocalDate(item.date));

      return {
        title: item.title,
        date: toDateInputValue(nextDate),
        originalDate: item.date,
        daysLeft: Math.ceil(
          (nextDate.getTime() - today.getTime()) / MS_PER_DAY,
        ),
        repeat_type: item.repeat_type,
        note: item.note,
      };
    })
    .filter((item) => item.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return upcoming[0] ?? null;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const nextYearlyDate = (value: string, today: Date) => {
  const original = parseLocalDate(value);
  let next = new Date(today.getFullYear(), original.getMonth(), original.getDate());
  if (next.getTime() < today.getTime()) {
    next = new Date(today.getFullYear() + 1, original.getMonth(), original.getDate());
  }
  return next;
};
