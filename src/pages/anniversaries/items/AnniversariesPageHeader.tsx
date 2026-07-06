import { Input } from "zmp-ui";
import { Box, Button, Icon, Text } from "@/components/zaui";
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
    <Box className="mb-4 rounded-[24px] border border-[var(--love-border)] bg-white/85 p-3.5 shadow-[0_14px_30px_rgba(201,47,103,0.08)]">
      <Box className="mb-3 flex items-center gap-3">
        <Button
          className="min-h-10 min-w-10 rounded-full bg-white/90 p-0 text-[#d9467e]"
          htmlType="button"
          icon={<Icon icon="zi-chevron-left" />}
          variant="tertiary"
          onClick={onBack}
        />
        <Box className="min-w-0 flex-1">
          <Text.Title size="small" className="font-serif text-[#2f1d2a]">
            Tất cả kỷ niệm
          </Text.Title>
          <Text className="text-xs font-bold text-[#8b6b7d]">
            {filteredCount}/{totalCount} ngày đáng nhớ
          </Text>
        </Box>
      </Box>
      <Input.Search
        label="Tìm kiếm"
        placeholder="Tên hoặc ghi chú kỷ niệm"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      <Box className="mt-3 grid grid-cols-3 gap-2">
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
