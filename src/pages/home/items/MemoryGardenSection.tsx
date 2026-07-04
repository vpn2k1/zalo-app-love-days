import { Box, Button, Text } from "@/components/zaui";
import type { Anniversary, UpcomingAnniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";
import { homeStyles } from "../modules/inlineStyles";
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
      <Box style={homeStyles.sectionTitle}>
        <Text.Title size="small" style={homeStyles.sectionTitleText}>
          Memory garden
        </Text.Title>
        <Button
          htmlType="button"
          style={homeStyles.linkButton}
          onClick={onShowAnniversaryForm}
        >
          View all
        </Button>
      </Box>

      <div style={homeStyles.eventGrid}>
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
      </div>
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
