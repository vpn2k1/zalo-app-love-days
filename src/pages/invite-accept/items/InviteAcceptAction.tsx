import { Box, Button, Text } from "@/components/zaui";

type Props = {
  loading?: boolean;
  onAccept: () => Promise<void>;
};

export function InviteAcceptAction({ loading, onAccept }: Props) {
  return (
    <Box className="app-opening-action">
      <Button fullWidth loading={loading} onClick={onAccept}>
        Tham gia ngay
      </Button>
      <Text className="app-opening-note">
        Bạn có thể chỉnh hồ sơ sau khi vào app.
      </Text>
    </Box>
  );
}
