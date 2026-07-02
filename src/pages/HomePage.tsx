import { useMemo, useState } from "react";
import { Box, Button, Icon, Page, Text } from "zmp-ui";
import { AnniversaryList } from "@/components/AnniversaryList";
import { LoveCounterCard } from "@/components/LoveCounterCard";
import { NextAnniversaryCard } from "@/components/NextAnniversaryCard";
import { UserSideCard } from "@/components/UserSideCard";
import type { Anniversary } from "@/types/anniversary";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { getNextAnniversary } from "@/utils/date";
import { isMockMode } from "@/services/supabaseClient";

type Props = {
  user: AppUser;
  coupleData: CoupleWithMembers;
  anniversaries: Anniversary[];
  onAddPartner: () => Promise<void>;
  onEditProfile: () => void;
};

export function HomePage({
  user,
  coupleData,
  anniversaries,
  onAddPartner,
  onEditProfile,
}: Props) {
  const [sharing, setSharing] = useState(false);
  const owner = coupleData.members.find((member) => member.side === "left")?.user;
  const partner = coupleData.members.find((member) => member.side === "right")?.user;
  const nextAnniversary = useMemo(
    () => getNextAnniversary(coupleData.couple, anniversaries),
    [anniversaries, coupleData.couple],
  );

  const handleAddPartner = async () => {
    setSharing(true);
    try {
      await onAddPartner();
    } finally {
      setSharing(false);
    }
  };

  return (
    <Page className="love-page">
      <Box className="home-hero">
        <Box className="home-topbar">
          <div>
            <Text className="overline">Love Days</Text>
            <Text.Title size="large">{coupleData.couple.title}</Text.Title>
          </div>
          <Button
            size="small"
            variant="tertiary"
            icon={<Icon icon="zi-user" />}
            onClick={onEditProfile}
          />
        </Box>
        {isMockMode && <div className="mock-badge">Mock mode</div>}
        <Box className="couple-row">
          <UserSideCard user={owner || user} label="Mình" />
          <div className="center-heart">♥</div>
          <UserSideCard
            user={partner}
            label="Người ấy"
            emptyLabel="Thêm đối tác"
            onEmptyAction={handleAddPartner}
          />
        </Box>
      </Box>

      <LoveCounterCard startDate={coupleData.couple.start_date} />
      <NextAnniversaryCard anniversary={nextAnniversary} />

      <Box className="section-title-row">
        <Text.Title size="small">Danh sách kỷ niệm</Text.Title>
      </Box>
      <AnniversaryList anniversaries={anniversaries} />

      {sharing && <Text className="subtle center-text">Đang mở chia sẻ Zalo...</Text>}
    </Page>
  );
}
