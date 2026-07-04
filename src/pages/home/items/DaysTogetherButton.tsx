import { Button, Text } from "@/components/zaui";
import { homeStyles } from "../modules/inlineStyles";

type Props = {
  days: number;
  onClick: () => void;
};

export function DaysTogetherButton({ days, onClick }: Props) {
  return (
    <Button
      htmlType="button"
      style={homeStyles.daysButton}
      onClick={onClick}
    >
      <div style={homeStyles.daysNumber}>
        {days.toLocaleString("vi-VN")}
      </div>
      <Text style={homeStyles.daysLabel}>days together</Text>
    </Button>
  );
}
