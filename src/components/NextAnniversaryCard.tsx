import { Box, Text } from "@/components/zaui";
import type { UpcomingAnniversary } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  anniversary: UpcomingAnniversary | null;
};

export function NextAnniversaryCard({ anniversary }: Props) {
  return (
    <Box className="soft-card next-card">
      <Text className="overline">Kỷ niệm gần nhất</Text>
      {anniversary ? (
        <>
          <Text.Title size="small">{anniversary.title}</Text.Title>
          <Text className="subtle">{formatDate(anniversary.date)}</Text>
          <div className="countdown-pill">
            {anniversary.daysLeft === 0
              ? "Hôm nay"
              : `Còn ${anniversary.daysLeft} ngày`}
          </div>
        </>
      ) : (
        <Text className="empty-text">Chưa có kỷ niệm nào.</Text>
      )}
    </Box>
  );
}
