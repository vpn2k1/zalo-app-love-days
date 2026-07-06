import type {
  AlbumFilterMode,
  AlbumFilters,
  AlbumSortOrder,
} from "../types/AlbumPageType";

export function emptyFilters(): AlbumFilters {
  return {
    date: "",
    endDate: "",
    mode: "all",
    startDate: "",
    year: "",
  };
}

export function normalizeFilters(filters: AlbumFilters): AlbumFilters {
  return {
    date: filters.date,
    endDate: filters.endDate,
    mode: filters.mode,
    startDate: filters.startDate,
    year: keepDigits(filters.year),
  };
}

export function getFilterLabel(filters: AlbumFilters) {
  if (filters.mode === "day" && filters.date) return `Ngày ${filters.date}`;
  if (filters.mode === "range") return getRangeLabel(filters);
  if (filters.mode === "year" && filters.year) return `Năm ${filters.year}`;

  return "Tất cả ảnh";
}

export function getSortLabel(sortOrder: AlbumSortOrder) {
  if (sortOrder === "oldest") return "Cũ nhất";
  if (sortOrder === "week") return "Theo tuần";
  if (sortOrder === "month") return "Theo tháng";
  if (sortOrder === "year") return "Theo năm";

  return "Mới nhất";
}

export function getOptionClassName(
  current: AlbumFilterMode,
  value: AlbumFilterMode,
) {
  const base = "min-h-9 rounded-full px-2 text-xs font-[850]";
  if (current !== value) return `${base} bg-[#fff5f8] text-[#8b6b7d]`;

  return `${base} bg-[#d9467e] text-white`;
}

export function getSortClassName(
  current: AlbumSortOrder,
  value: AlbumSortOrder,
) {
  const base = "min-h-9 rounded-full px-2 text-xs font-[850]";
  if (current !== value) return `${base} bg-[#fff5f8] text-[#8b6b7d]`;

  return `${base} bg-[#d9467e] text-white`;
}

export function keepDigits(value: string) {
  return value.replace(/\D/g, "");
}

function getRangeLabel(filters: AlbumFilters) {
  if (filters.startDate && filters.endDate) {
    return `${filters.startDate} - ${filters.endDate}`;
  }
  if (filters.startDate) return `Từ ${filters.startDate}`;
  if (filters.endDate) return `Đến ${filters.endDate}`;

  return "Khoảng ngày";
}
