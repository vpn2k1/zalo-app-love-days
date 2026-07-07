import { Box, Button, Icon, Text } from "@/components/zaui";

type Props = {
  totalCount: number;
  onBack: () => void;
};

export function CalendarMemoriesHeader({ totalCount, onBack }: Props) {
  return (
    <Box className="flex items-center gap-2">
      <Button
        className="min-h-10 min-w-10 p-0 text-[#d9467e]"
        htmlType="button"
        icon={<Icon icon="zi-chevron-left" />}
        variant="tertiary"
        onClick={onBack}
      />
      <Text.Title size="small" className="font-serif text-[#2f1d2a]">
        Lịch kỷ niệm
      </Text.Title>
    </Box>
  );
}
