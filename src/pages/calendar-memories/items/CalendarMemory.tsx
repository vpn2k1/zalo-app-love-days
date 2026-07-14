import { useWatch } from "react-hook-form";

import { AppSafeImage } from "@/components/AppSafeImage";
import { AppSpinner, Box, Button, Icon, Text } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import type { Anniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

import type { TCalendarMemoriesPage } from "../CalendarMemoriesPage";
import { useSelectedDateMemories } from "../modules/useSelectedDateMemories";

type Props = {
  onCreate: () => void;
};

export function CalendarMemory({ onCreate }: Props) {
  const navigation = useAppNavigation();
  const date = useWatch<TCalendarMemoriesPage, "selectDate">({
    name: "selectDate",
    exact: true,
  });
  const coupleId = useWatch<TCalendarMemoriesPage, "coupleId">({
    name: "coupleId",
    exact: true,
  });
  const { memories, memoriesQuery } = useSelectedDateMemories(coupleId, date);
  if (!date) return null;

  if (memoriesQuery.isPending) {
    return <CalendarMemoryLoading />;
  }

  if (memories.length === 0) {
    return <EmptyCalendarMemory onCreate={onCreate} />;
  }

  return (
    <Box className="mt-4 rounded-[24px] border border-[var(--love-border)] bg-white/85 p-3.5 shadow-[0_14px_30px_rgba(201,47,103,0.08)]">
      <Text className="text-xs font-bold uppercase text-[#c45a86]">
        Kỷ niệm trong ngày
      </Text>
      <Box className="mt-3 grid gap-3">
        {memories.map((memory) => (
          <CalendarMemoryItem
            key={memory.id}
            memory={memory}
            onOpen={() => navigation.goMemory(memory.id)}
          />
        ))}
      </Box>
    </Box>
  );
}

function CalendarMemoryItem({
  memory,
  onOpen,
}: {
  memory: Anniversary;
  onOpen: () => void;
}) {
  return (
    <Box className="rounded-[20px] bg-[#fff7fa] p-3">
      <Box className="flex gap-3">
        <MemoryThumb memory={memory} />
        <Box className="min-w-0 flex-1">
          <Text.Title size="small" className="font-serif text-[#2f1d2a]">
            {memory.title}
          </Text.Title>
          <Text className="mt-1 text-xs font-bold text-[#8b6b7d]">
            {formatDate(memory.date)}
          </Text>
          {memory.note && (
            <Text className="mt-2 text-xs leading-[1.45] text-[#a45f7d]">
              {memory.note}
            </Text>
          )}
        </Box>
      </Box>
      <Button
        fullWidth
        size="small"
        variant="secondary"
        className="mt-3 rounded-2xl font-bold"
        onClick={onOpen}
      >
        Chỉnh sửa kỷ niệm
      </Button>
    </Box>
  );
}

function CalendarMemoryLoading() {
  return (
    <Box className="mt-4 grid min-h-[156px] place-items-center rounded-[24px] border border-[var(--love-border)] bg-white/85 p-4 shadow-[0_14px_30px_rgba(201,47,103,0.08)]">
      <Box className="grid place-items-center gap-2">
        <AppSpinner />
        <Text className="text-xs font-bold text-[#8b6b7d]">
          Đang mở chi tiết kỷ niệm...
        </Text>
      </Box>
    </Box>
  );
}

function EmptyCalendarMemory({ onCreate }: Pick<Props, "onCreate">) {
  return (
    <Box className="mt-4 rounded-[24px] border border-[var(--love-border)] bg-white/85 p-4 text-center shadow-[0_14px_30px_rgba(201,47,103,0.08)]">
      <Text className="text-xs font-bold uppercase text-[#c45a86]">
        Chi tiết kỷ niệm
      </Text>
      <Text className="mt-1 text-xs font-bold text-[#8b6b7d]">
        Tạo một kỷ niệm mới cho ngày này.
      </Text>
      <Button
        fullWidth
        size="small"
        variant="primary"
        className="mt-3 rounded-2xl border-none font-bold"
        onClick={onCreate}
      >
        Tạo kỷ niệm mới
      </Button>
    </Box>
  );
}

function MemoryThumb({ memory }: { memory: Anniversary }) {
  if (memory.image_url) {
    return (
      <AppSafeImage
        alt=""
        className="size-[72px] flex-none rounded-[18px] object-cover"
        fallback={<MemoryThumbFallback />}
        src={memory.image_url}
      />
    );
  }

  return <MemoryThumbFallback />;
}

function MemoryThumbFallback() {
  return (
    <Box className="grid size-[72px] flex-none place-items-center rounded-[18px] bg-[#ffe4ef]">
      <Icon
        icon="zi-heart-solid"
        className="text-2xl text-[var(--love-primary)]"
      />
    </Box>
  );
}
