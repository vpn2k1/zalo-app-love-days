import { Box, Button, Page, Text } from "zmp-ui";

type Props = {
  loading?: boolean;
  error?: string;
  onAccept: () => Promise<void>;
};

export function InviteAcceptPage({ loading, error, onAccept }: Props) {
  return (
    <Page className="love-page center-page">
      <Box className="permission-card">
        <div className="heart-mark">♥</div>
        <Text.Title size="large">Lời mời Love Days</Text.Title>
        <Text className="permission-copy">
          Người ấy đang mời bạn cùng lưu giữ những ngày yêu nhau.
        </Text>
        {error && <Text className="error-text">{error}</Text>}
        <Button fullWidth loading={loading} onClick={onAccept}>
          Tham gia ngay
        </Button>
      </Box>
    </Page>
  );
}
