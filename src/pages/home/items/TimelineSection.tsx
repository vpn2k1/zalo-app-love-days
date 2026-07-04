import { Box, Icon, Text } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";
import { homeStyles } from "../modules/inlineStyles";

type Props = {
  anniversaries: Anniversary[];
};

export function TimelineSection({ anniversaries }: Props) {
  if (anniversaries.length === 0) {
    return (
      <Box style={homeStyles.timeline}>
        <TimelineHeader />
        <div style={homeStyles.timelineItem}>
          <Text style={homeStyles.timelineIcon}>♡</Text>
          <div>
            <Text style={homeStyles.timelineTitle}>Beach sunset</Text>
            <Text style={homeStyles.muted}>12 photos</Text>
          </div>
          <Text style={homeStyles.timelineIcon}>✦</Text>
          <div>
            <Text style={homeStyles.timelineTitle}>Coffee date</Text>
            <Text style={homeStyles.muted}>5 photos</Text>
          </div>
        </div>
      </Box>
    );
  }

  return (
    <Box style={homeStyles.timeline}>
      <TimelineHeader />
      {anniversaries.map((item) => (
        <div style={homeStyles.timelineItem} key={item.id}>
          <Text style={homeStyles.timelineIcon}>♡</Text>
          <div>
            <Text style={homeStyles.timelineTitle}>{item.title}</Text>
            <Text style={homeStyles.muted}>{formatDate(item.date)}</Text>
          </div>
        </div>
      ))}
    </Box>
  );
}

function TimelineHeader() {
  return (
    <div style={homeStyles.timelineHead}>
      <Text.Title size="small" style={homeStyles.sectionTitleText}>
        Photo album timeline
      </Text.Title>
      <Icon icon="zi-chevron-right" />
    </div>
  );
}
