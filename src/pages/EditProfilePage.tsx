import { useState } from "react";
import { Box, Button, Input, Page, Text } from "zmp-ui";
import type { AppUser } from "@/types/user";

type Props = {
  user: AppUser;
  loading?: boolean;
  onSave: (payload: Pick<AppUser, "display_name" | "custom_avatar_url">) => Promise<void>;
  onBack: () => void;
};

export function EditProfilePage({ user, loading, onSave, onBack }: Props) {
  const [displayName, setDisplayName] = useState(user.display_name || user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.custom_avatar_url || "");

  return (
    <Page className="love-page">
      <Box className="page-header">
        <Text className="overline">Hồ sơ</Text>
        <Text.Title size="large">Sửa profile</Text.Title>
      </Box>
      <Box className="soft-card form-stack">
        <Input
          label="Tên hiển thị"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
        <Input
          label="Ảnh đại diện tuỳ chỉnh"
          value={avatarUrl}
          placeholder="https://..."
          onChange={(event) => setAvatarUrl(event.target.value)}
        />
      </Box>
      <Box className="bottom-action dual">
        <Button variant="secondary" onClick={onBack}>
          Quay lại
        </Button>
        <Button
          loading={loading}
          onClick={() =>
            onSave({
              display_name: displayName.trim(),
              custom_avatar_url: avatarUrl.trim() || null,
            })
          }
        >
          Lưu
        </Button>
      </Box>
    </Page>
  );
}
