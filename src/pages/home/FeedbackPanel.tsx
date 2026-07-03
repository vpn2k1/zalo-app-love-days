import { Box, Text } from "zmp-ui";

type Props = {
  mockMode: boolean;
  inviteFeedback?: string;
  actionFeedback?: string;
  addPartnerLoading?: boolean;
  profileLoading?: boolean;
};

export function FeedbackPanel({
  mockMode,
  inviteFeedback,
  actionFeedback,
  addPartnerLoading,
  profileLoading,
}: Props) {
  if (!mockMode && !inviteFeedback && !actionFeedback && !addPartnerLoading && !profileLoading) {
    return null;
  }

  return (
    <Box className="app-feedback">
      {mockMode && <Text>Mock mode đang bật.</Text>}
      {addPartnerLoading && <Text>Đang mở chia sẻ Zalo...</Text>}
      {profileLoading && <Text>Đang lưu hồ sơ...</Text>}
      {inviteFeedback && <Text>{inviteFeedback}</Text>}
      {actionFeedback && <Text>{actionFeedback}</Text>}
    </Box>
  );
}
