import { Box, Button, Icon, Text } from "@/components/zaui";

type Props = {
  onOpenLegal: () => void;
};

export function EditProfileLegalLinks({ onOpenLegal }: Props) {
  return (
    <Box className="my-4 rounded-[22px] border border-pink-100 bg-white/85 p-3 shadow-[0_12px_28px_rgba(201,47,103,0.08)]">
      <Box className="mb-2 flex items-center gap-2 ">
        <Text className="text-[#d9467e] text-xs font-bold">
          Bạn có thể xem thông tin chính sách, điều khoản và liên hệ
          chúng tôi tại đây.
        </Text>
      </Box>
      <Box className="grid gap-2">
        <Button
          fullWidth
          htmlType="button"
          size="small"
          variant="secondary"
          onClick={onOpenLegal}
        >
          Xem thông tin
        </Button>
      </Box>
    </Box>
  );
}
