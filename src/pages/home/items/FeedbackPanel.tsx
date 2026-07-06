import { Box, Text } from "@/components/zaui";

type Props = {
  mockMode: boolean;
  addPartnerLoading?: boolean;
  profileLoading?: boolean;
};

export function FeedbackPanel({
  mockMode,
  addPartnerLoading,
  profileLoading,
}: Props) {
  if (!mockMode && !addPartnerLoading && !profileLoading) {
    return null;
  }

  return (
    <Box className="mb-3 grid gap-1 rounded-[18px] bg-white/90 px-3 py-2.5 text-center text-[#7b5f70]">
      {mockMode && <Text>Chế độ mô phỏng đang bật.</Text>}
      {addPartnerLoading && <Text>Đang mở chia sẻ Zalo...</Text>}
      {profileLoading && <Text>Đang lưu hồ sơ...</Text>}
    </Box>
  );
}
