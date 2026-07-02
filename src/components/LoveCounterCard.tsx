import { Box, Text } from "zmp-ui";
import { diffFromNowParts, diffInDays, formatDate } from "@/utils/date";

type Props = {
  startDate: string;
};

export function LoveCounterCard({ startDate }: Props) {
  const days = diffInDays(startDate);
  const parts = diffFromNowParts(startDate);

  return (
    <Box className="main-love-card">
      <Text className="overline">Đã yêu nhau</Text>
      <div className="days-number">{days.toLocaleString("vi-VN")}</div>
      <Text className="days-label">ngày</Text>
      <Text className="subtle">
        Từ {formatDate(startDate)} · khoảng {parts.hours.toLocaleString("vi-VN")} giờ{" "}
        {parts.minutes} phút
      </Text>
    </Box>
  );
}
