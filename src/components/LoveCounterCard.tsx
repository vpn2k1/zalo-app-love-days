import { Box, Icon, Text } from "zmp-ui";
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
      <div className="days-number">{days.toLocaleString("vi-VN")}</div>
      <Text className="days-label">ngày</Text>
      <div className="counter-date-row">
        <Text className="subtle">
          Từ {formatDate(startDate)} · khoảng {parts.hours.toLocaleString("vi-VN")} giờ{" "}
          {parts.minutes} phút
        </Text>
        {onEditStartDate && (
          <button
            type="button"
            className="icon-button mini-edit-button"
            aria-label="Sửa ngày bắt đầu"
            onClick={onEditStartDate}
          >
            <Icon icon="zi-edit" />
          </button>
        )}
      </div>
      <div className="love-stat-row">
        <div className="love-stat">
          <strong>{Math.floor(days / 30).toLocaleString("vi-VN")}</strong>
          <span>tháng bên nhau</span>
        </div>
        <div className="love-stat">
          <strong>{parts.hours.toLocaleString("vi-VN")}</strong>
          <span>giờ thương nhớ</span>
        </div>
      </div>
    </Box>
  );
}
