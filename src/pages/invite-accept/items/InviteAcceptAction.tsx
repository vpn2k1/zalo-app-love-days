import { Box, Button, Text } from "@/components/zaui";

type Props = {
  loading?: boolean;
  onAccept: () => Promise<void>;
  onAcceptWithoutZaloInfo: () => Promise<void>;
};

export function InviteAcceptAction({
  loading,
  onAccept,
  onAcceptWithoutZaloInfo,
}: Props) {
  return (
    <Box className="app-opening-action">
      <Button fullWidth loading={loading} onClick={onAccept}>
        Tham gia ngay
      </Button>
      <Button
        fullWidth
        loading={loading}
        onClick={onAcceptWithoutZaloInfo}
      >
        Tham gia không lấy thông tin
      </Button>
      <Text className="app-opening-note">
        Bạn có thể chỉnh hồ sơ sau khi vào ứng dụng.
      </Text>
    </Box>
  );
}
