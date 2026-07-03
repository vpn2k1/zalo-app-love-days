import { Box, Icon, Text } from "zmp-ui";
import type { Anniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  anniversaries: Anniversary[];
};

export function TimelineSection({ anniversaries }: Props) {
  return (
    <Box className="app-timeline">
      <div className="app-timeline-head">
        <Text.Title size="small">Photo album timeline</Text.Title>
        <Icon icon="zi-chevron-right" />
      </div>
      {anniversaries.length > 0 ? (
        anniversaries.map((item) => (
          <div className="app-timeline-item" key={item.id}>
            <span className="app-timeline-icon">♡</span>
            <div>
              <Text className="app-timeline-title">{item.title}</Text>
              <Text className="app-muted">{formatDate(item.date)}</Text>
            </div>
          </div>
        ))
      ) : (
        <div className="app-timeline-item">
          <span className="app-timeline-icon">♡</span>
          <div>
            <Text className="app-timeline-title">Beach sunset</Text>
            <Text className="app-muted">12 photos</Text>
          </div>
          <span className="app-timeline-icon app-timeline-icon-alt">✦</span>
          <div>
            <Text className="app-timeline-title">Coffee date</Text>
            <Text className="app-muted">5 photos</Text>
          </div>
        </div>
      )}
    </Box>
  );
}
