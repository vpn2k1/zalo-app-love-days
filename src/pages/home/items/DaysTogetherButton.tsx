import { Box, Button, Text } from "@/components/zaui";

type Props = {
  days: number;
  onClick: () => void;
};

export function DaysTogetherButton({ days, onClick }: Props) {
  return (
    <Button
      htmlType="button"
      className="mb-3 block min-h-[116px] w-full rounded-[18px] border-0 bg-white/90 px-[18px] pb-3.5 pt-[13px] text-center"
      onClick={onClick}
    >
      <Box className="font-serif text-[39px] font-medium leading-[1.32] text-[#d9467e]">
        {days.toLocaleString("vi-VN")}
      </Box>
      <Text className="text-xs font-bold text-[#7f6072]">days together</Text>
    </Button>
  );
}
