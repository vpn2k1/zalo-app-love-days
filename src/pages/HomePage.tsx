import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Icon, Page, Text } from "zmp-ui";
import { AnniversaryForm } from "@/components/AnniversaryForm";
import { AnniversaryList } from "@/components/AnniversaryList";
import { LoveCounterCard } from "@/components/LoveCounterCard";
import { NextAnniversaryCard } from "@/components/NextAnniversaryCard";
import { UserSideCard } from "@/components/UserSideCard";
import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";
import { getNextAnniversary } from "@/utils/date";
import { isMockMode } from "@/services/supabaseClient";

type Props = {
  user: AppUser;
  coupleData: CoupleWithMembers;
  anniversaries: Anniversary[];
  addPartnerLoading?: boolean;
  inviteFeedback?: string;
  profileLoading?: boolean;
  addAnniversaryLoading?: boolean;
  onAddPartner: () => Promise<unknown>;
  onSaveProfile: (payload: {
    display_name: string;
    custom_avatar_url: string | null;
    start_date: string;
  }) => Promise<unknown>;
  onAddAnniversary: (draft: AnniversaryDraft) => Promise<unknown>;
  onEditProfile: () => void;
};

export function HomePage({
  user,
  coupleData,
  anniversaries,
  addPartnerLoading,
  inviteFeedback,
  profileLoading,
  addAnniversaryLoading,
  onAddPartner,
  onSaveProfile,
  onAddAnniversary,
  onEditProfile,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentMember = coupleData.members.find((member) => member.user_id === user.id);
  const otherMember = coupleData.members.find((member) => member.user_id !== user.id);
  const currentUser: AppUser =
    currentMember?.user_id === user.id ? { ...currentMember.user, ...user } : user;
  const partner = otherMember?.user;
  const [showQuickEdit, setShowQuickEdit] = useState(false);
  const [showAnniversaryForm, setShowAnniversaryForm] = useState(false);
  const [nameDraft, setNameDraft] = useState(currentUser.display_name || currentUser.name);
  const [startDateDraft, setStartDateDraft] = useState(coupleData.couple.start_date);
  const [actionFeedback, setActionFeedback] = useState("");
  const nextAnniversary = useMemo(
    () => getNextAnniversary(coupleData.couple, anniversaries),
    [anniversaries, coupleData.couple],
  );

  useEffect(() => {
    setNameDraft(currentUser.display_name || currentUser.name);
    setStartDateDraft(coupleData.couple.start_date);
  }, [coupleData.couple.start_date, currentUser.display_name, currentUser.name]);

  const saveQuickEdit = async () => {
    setActionFeedback("");
    if (!startDateDraft) {
      setActionFeedback("Vui lòng chọn ngày bắt đầu.");
      return;
    }
    try {
      await onSaveProfile({
        display_name: nameDraft.trim() || currentUser.name,
        custom_avatar_url: currentUser.custom_avatar_url || null,
        start_date: startDateDraft,
      });
      setActionFeedback("Đã cập nhật thông tin.");
      setShowQuickEdit(false);
    } catch (error) {
      console.error(error);
      setActionFeedback("Không thể cập nhật thông tin. Vui lòng thử lại.");
    }
  };

  const saveAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setActionFeedback("Vui lòng chọn một tệp ảnh.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setActionFeedback("Ảnh tối đa 2MB để lưu ổn định trong mini app.");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    setActionFeedback("");
    try {
      await onSaveProfile({
        display_name: nameDraft.trim() || currentUser.name,
        custom_avatar_url: dataUrl,
        start_date: coupleData.couple.start_date,
      });
      setActionFeedback("Đã cập nhật ảnh đại diện.");
    } catch (error) {
      console.error(error);
      setActionFeedback("Không thể cập nhật ảnh đại diện. Vui lòng thử lại.");
    }
  };

  const addAnniversary = async (draft: AnniversaryDraft) => {
    setActionFeedback("");
    try {
      await onAddAnniversary(draft);
      setActionFeedback("Đã thêm ngày kỷ niệm.");
      setShowAnniversaryForm(false);
    } catch (error) {
      console.error(error);
      setActionFeedback("Không thể thêm ngày kỷ niệm. Vui lòng thử lại.");
    }
  };

  return (
    <Page className="love-page">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={saveAvatar}
      />
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
          <UserSideCard
            user={currentUser}
            label="Mình"
            onAvatarClick={() => fileInputRef.current?.click()}
            onEditName={() => setShowQuickEdit(true)}
          />
          <div className="center-heart">♥</div>
          <UserSideCard
            user={partner}
            label="Người ấy"
            emptyLabel="Thêm đối tác"
            onEmptyAction={onAddPartner}
          />
        </Box>
      </Box>

      {showQuickEdit && (
        <Box className="soft-card quick-edit-card">
          <label className="native-field">
            <span>Tên hiển thị</span>
            <input
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
            />
          </label>
          <label className="native-field">
            <span>Ngày bắt đầu</span>
            <input
              type="date"
              value={startDateDraft}
              onChange={(event) => setStartDateDraft(event.target.value)}
            />
          </label>
          <div className="inline-actions">
            <Button variant="secondary" onClick={() => setShowQuickEdit(false)}>
              Hủy
            </Button>
            <Button loading={profileLoading} onClick={saveQuickEdit}>
              Lưu
            </Button>
          </div>
        </Box>
      )}

      <LoveCounterCard
        startDate={coupleData.couple.start_date}
        onEditStartDate={() => setShowQuickEdit(true)}
      />
      <NextAnniversaryCard anniversary={nextAnniversary} />

      <Box className="section-title-row">
        <Text.Title size="small">Danh sách kỷ niệm</Text.Title>
        <Button
          size="small"
          variant="tertiary"
          icon={<Icon icon={showAnniversaryForm ? "zi-close" : "zi-plus"} />}
          onClick={() => setShowAnniversaryForm((value) => !value)}
        />
      </Box>
      {showAnniversaryForm && (
        <Box className="soft-card">
          <AnniversaryForm
            loading={addAnniversaryLoading}
            onAdd={addAnniversary}
          />
        </Box>
      )}
      <AnniversaryList anniversaries={anniversaries} />

      {addPartnerLoading && (
        <Text className="subtle center-text">Đang mở chia sẻ Zalo...</Text>
      )}
      {inviteFeedback && <Text className="subtle center-text">{inviteFeedback}</Text>}
      {actionFeedback && <Text className="subtle center-text">{actionFeedback}</Text>}
    </Page>
  );
}
