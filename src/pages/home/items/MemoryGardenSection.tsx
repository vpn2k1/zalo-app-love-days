import { Box, Button, Text } from "@/components/zaui";
import type { Anniversary, UpcomingAnniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";
import { MilestoneCard } from "./MilestoneCard";

type Props = {
  anniversaries: Anniversary[];
  nextAnniversary: UpcomingAnniversary | null;
  onShowAnniversaryForm: () => void;
};

export function MemoryGardenSection({
  anniversaries,
  nextAnniversary,
  onShowAnniversaryForm,
}: Props) {
  return (
    <>
      <Box className="mb-2 mt-1 flex items-center justify-between gap-3">
        <Text.Title
          size="small"
          className="font-serif font-medium text-[#2f1d2a]"
        >
          Memory garden
        </Text.Title>
        <Button
          htmlType="button"
          className="min-h-8 rounded-full bg-transparent px-2.5 font-[850] text-[#e14d86]"
          onClick={onShowAnniversaryForm}
        >
          View all
        </Button>
      </Box>

      <Box className="mb-3 grid grid-cols-2 gap-2.5">
        <MilestoneCard
          icon="zi-calendar"
          title="Next anniversary"
          label={getNextAnniversaryLabel(nextAnniversary)}
          value={getNextAnniversaryValue(nextAnniversary)}
        />
        <MilestoneCard
          icon="zi-heart"
          title="First trip"
          label={`${anniversaries.length} memories`}
          value={getFirstMemoryValue(anniversaries)}
        />
      </Box>
    </>
  );
}

function getNextAnniversaryLabel(
  nextAnniversary: Props["nextAnniversary"],
) {
  if (!nextAnniversary) return "Chưa có lịch";
  return `Còn ${nextAnniversary.daysLeft} ngày`;
}

function getNextAnniversaryValue(
  nextAnniversary: Props["nextAnniversary"],
) {
  if (!nextAnniversary) return "Thêm ngay";
  return formatDate(nextAnniversary.date);
}

function getFirstMemoryValue(anniversaries: Anniversary[]) {
  const [first] = anniversaries;
  if (!first) return "Da Nang";
  return first.title;
}
