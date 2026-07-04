import { Box, Text } from "@/components/zaui";
import { homeStyles } from "../modules/inlineStyles";

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
    <Box style={homeStyles.feedback}>
      {mockMode && <Text>Mock mode đang bật.</Text>}
      {addPartnerLoading && <Text>Đang mở chia sẻ Zalo...</Text>}
      {profileLoading && <Text>Đang lưu hồ sơ...</Text>}
    </Box>
  );
}
