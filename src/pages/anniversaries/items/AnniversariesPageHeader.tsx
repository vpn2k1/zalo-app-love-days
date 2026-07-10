import { Input } from "zmp-ui";

import { AppPageHeader } from "@/components/AppPageHeader";
import { Box, Button } from "@/components/zaui";

import type { AnniversaryFilter } from "../types/AnniversariesPageType";

type Props = {
  filter: AnniversaryFilter;
  filteredCount: number;
  query: string;
  setFilter: (filter: AnniversaryFilter) => void;
  setQuery: (query: string) => void;
  totalCount: number;
  onBack: () => void;
};

const FILTERS: Array<{ label: string; value: AnniversaryFilter }> = [
  { label: "Tất cả", value: "all" },
  { label: "Hàng năm", value: "yearly" },
  { label: "Một lần", value: "none" },
];

export function AnniversariesPageHeader({
  filter,
  filteredCount,
  query,
  setFilter,
  setQuery,
  totalCount,
  onBack,
}: Props) {
  return (
    <Box>
      <AppPageHeader
        title="Tất cả kỷ niệm"
        subtitle={`${filteredCount}/${totalCount} ngày đáng nhớ`}
        onBack={onBack}
      />
      <Input.Search
        label="Tìm kiếm"
        placeholder="Tên hoặc ghi chú kỷ niệm"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      <Box className="my-3 grid grid-cols-3 gap-2">
        {FILTERS.map((item) => (
          <Button
            className={getFilterClassName(filter, item.value)}
            htmlType="button"
            key={item.value}
            size="small"
            variant="tertiary"
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

function getFilterClassName(
  current: AnniversaryFilter,
  value: AnniversaryFilter,
) {
  const base = "min-h-9 rounded-full px-2 text-xs font-[850]";
  if (current !== value) {
    return `${base} bg-[#fff5f8] text-[#8b6b7d]`;
  }

  return `${base} bg-[#d9467e] text-white`;
}
