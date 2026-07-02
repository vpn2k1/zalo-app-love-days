import { Box, Button, Page, Text } from "zmp-ui";

type Props = {
  blocked?: boolean;
  loading?: boolean;
  onAllow: () => void;
};

export function PermissionGate({ blocked, loading, onAllow }: Props) {
  return (
    <Page className="love-page center-page">
      <Box className="permission-card">
        <div className="heart-mark">♥</div>
        <Text.Title size="large">Love Days</Text.Title>
        {blocked ? (
          <Text className="permission-copy">
            Ứng dụng cần quyền đọc thông tin Zalo để hoạt động.
          </Text>
        ) : (
          <Text className="permission-copy">
            Love Days cần quyền đọc thông tin Zalo để tạo không gian riêng cho bạn
            và người ấy.
          </Text>
        )}
        <Button fullWidth loading={loading} onClick={onAllow}>
          {blocked ? "Thử lại" : "Cho phép"}
        </Button>
      </Box>
    </Page>
  );
}
