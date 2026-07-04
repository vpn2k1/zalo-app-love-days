import { Box, Button, Icon, Text } from "@/components/zaui";
import { diffFromNowParts, diffInDays, formatDate } from "@/utils/date";

type Props = {
  startDate: string;
  onEditStartDate?: () => void;
};

export function LoveCounterCard({ startDate, onEditStartDate }: Props) {
  const days = diffInDays(startDate);
  const parts = diffFromNowParts(startDate);

  return (
    <Box className="main-love-card">
      <Text className="overline">Đã yêu nhau</Text>
      <Box className="days-number">{days.toLocaleString("vi-VN")}</Box>
      <Text className="days-label">ngày</Text>
      <Box className="counter-date-row">
        <Text className="subtle">
          Từ {formatDate(startDate)} · khoảng {parts.hours.toLocaleString("vi-VN")} giờ{" "}
          {parts.minutes} phút
        </Text>
        {onEditStartDate && (
          <Button
            htmlType="button"
            className="icon-button mini-edit-button"
            aria-label="Sửa ngày bắt đầu"
            onClick={onEditStartDate}
          >
            <Icon icon="zi-edit" />
          </Button>
        )}
      </Box>
      <Box className="love-stat-row">
        <Box className="love-stat">
          <Text className="love-stat-value">
            {Math.floor(days / 30).toLocaleString("vi-VN")}
          </Text>
          <Text>tháng bên nhau</Text>
        </Box>
        <Box className="love-stat">
          <Text className="love-stat-value">
            {parts.hours.toLocaleString("vi-VN")}
          </Text>
          <Text>giờ thương nhớ</Text>
        </Box>
      </Box>
    </Box>
  );
}
