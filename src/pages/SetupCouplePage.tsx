import { useState } from "react";
import { Box, Button, Input, Page, Text } from "zmp-ui";
import { AnniversaryForm } from "@/components/AnniversaryForm";
import { AnniversaryList } from "@/components/AnniversaryList";
import type { AnniversaryDraft } from "@/types/anniversary";
import type { SetupCoupleInput } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { todayDateString } from "@/utils/date";

type Props = {
  user: AppUser;
  loading?: boolean;
  onCreate: (input: SetupCoupleInput) => Promise<void>;
};

export function SetupCouplePage({ user, loading, onCreate }: Props) {
  const [startDate, setStartDate] = useState(todayDateString());
  const [displayName, setDisplayName] = useState(user.display_name || user.name);
  const [anniversaries, setAnniversaries] = useState<AnniversaryDraft[]>([]);

  const submit = () =>
    onCreate({
      startDate,
      displayName: displayName.trim() || user.name,
      anniversaries,
    });

  return (
    <Page className="love-page">
      <Box className="page-header">
        <Text className="overline">Thiết lập</Text>
        <Text.Title size="large">Không gian của hai bạn</Text.Title>
        <Text className="subtle">
          Chọn ngày bắt đầu yêu và lưu vài cột mốc đáng nhớ.
        </Text>
      </Box>

      <Box className="soft-card form-stack">
        <label className="native-field">
          <span>Ngày bắt đầu yêu</span>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </label>
        <Input
          label="Tên hiển thị của mình"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </Box>

      <Box className="soft-card">
        <AnniversaryForm
          onAdd={(draft) => setAnniversaries((current) => [...current, draft])}
        />
        <AnniversaryList anniversaries={anniversaries} />
      </Box>

      <Box className="bottom-action">
        <Button fullWidth loading={loading} onClick={submit}>
          Tạo Love Days
        </Button>
      </Box>
    </Page>
  );
}
