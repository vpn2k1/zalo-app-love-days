import { useState } from "react";
import { Box, Button, Icon, Page, Text } from "zmp-ui";
import { AnniversaryForm } from "@/components/AnniversaryForm";
import { isMockMode } from "@/services/supabaseClient";
import { formatDate } from "@/utils/date";
import { FeedbackPanel } from "./home/FeedbackPanel";
import { HomeHeader } from "./home/HomeHeader";
import { MemoryChips } from "./home/MemoryChips";
import { MilestoneCard } from "./home/MilestoneCard";
import { PersonChip } from "./home/PersonChip";
import { QuickActionGrid } from "./home/QuickActionGrid";
import { StatusBar } from "./home/StatusBar";
import { TimelineSection } from "./home/TimelineSection";
import type { HomePageProps } from "./home/types";
import { useHomePage } from "./home/useHomePage";
import "../css/app.css";

export function HomePage(props: HomePageProps) {
  const {
    user,
    coupleData,
    anniversaries,
    addPartnerLoading,
    inviteFeedback,
    profileLoading,
    addAnniversaryLoading,
    onAddPartner,
    onEditProfile,
    onUpdateStartDate,
  } = props;
  const home = useHomePage(props);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDateDraft, setStartDateDraft] = useState(coupleData.couple.start_date);

  const saveStartDate = async () => {
    if (!startDateDraft) return;
    await onUpdateStartDate(startDateDraft);
    setShowDatePicker(false);
  };

  return (
    <Page className="app-page">
      <StatusBar />
      <HomeHeader
        title="Our little universe"
        subtitle={`Friday, ${formatDate(coupleData.couple.start_date)}`}
        onEditProfile={onEditProfile}
      />

      <Box className="app-hero">
        <div className="app-hero-icon">
          <Icon icon="zi-user" />
        </div>
        <Text className="app-hero-copy">Add your favorite couple photo</Text>
      </Box>

      <Box className="app-couple-card">
        <PersonChip
          person={{
            name: home.currentUser.display_name || home.currentUser.name,
            avatar: home.currentUser.custom_avatar_url || home.currentUser.avatar_url,
          }}
          label="Mình"
          onClick={home.saveAvatar}
        />
        <button
          type="button"
          className="app-heart-button"
          aria-label="Sửa hồ sơ"
          onClick={onEditProfile}
        >
          <Icon icon="zi-edit" />
        </button>
        <PersonChip
          person={home.partner ? {
            name: home.partner.display_name || home.partner.name,
            avatar: home.partner.custom_avatar_url || home.partner.avatar_url,
          } : undefined}
          label="Người ấy"
          emptyLabel="Mời người ấy"
          onClick={home.partner ? undefined : onAddPartner}
        />
      </Box>

      <button
        type="button"
        className="app-days-card app-days-button"
        onClick={() => {
          setStartDateDraft(coupleData.couple.start_date);
          setShowDatePicker(true);
        }}
      >
        <div className="app-days-number">{home.days.toLocaleString("vi-VN")}</div>
        <Text className="app-days-label">days together</Text>
      </button>

      {showDatePicker && (
        <div className="app-popup-backdrop" role="presentation">
          <section className="app-popup" role="dialog" aria-modal="true">
            <Text.Title size="small">Chọn lại ngày kỷ niệm</Text.Title>
            <label className="native-field">
              <span>Ngày bắt đầu</span>
              <input
                type="date"
                value={startDateDraft}
                onChange={(event) => setStartDateDraft(event.target.value)}
              />
            </label>
            <div className="app-popup-actions">
              <Button
                variant="secondary"
                onClick={() => setShowDatePicker(false)}
              >
                Huỷ
              </Button>
              <Button
                disabled={!startDateDraft}
                loading={profileLoading}
                onClick={saveStartDate}
              >
                Lưu
              </Button>
            </div>
          </section>
        </div>
      )}

      <QuickActionGrid
        onEditProfile={onEditProfile}
        onAddPartner={onAddPartner}
        onAddAnniversary={() => home.setShowAnniversaryForm((value) => !value)}
        addPartnerLoading={addPartnerLoading}
      />

      {home.showAnniversaryForm && (
        <Box className="app-panel">
          <AnniversaryForm
            loading={addAnniversaryLoading}
            onAdd={home.addAnniversary}
          />
        </Box>
      )}

      <Box className="app-section-title">
        <Text.Title size="small">Memory garden</Text.Title>
        <button
          type="button"
          className="app-link-button"
          onClick={() => home.setShowAnniversaryForm(true)}
        >
          View all
        </button>
      </Box>

      <div className="app-event-grid">
        <MilestoneCard
          icon="zi-calendar"
          title="Next anniversary"
          label={home.nextAnniversary ? `Còn ${home.nextAnniversary.daysLeft} ngày` : "Chưa có lịch"}
          value={home.nextAnniversary ? formatDate(home.nextAnniversary.date) : "Thêm ngay"}
        />
        <MilestoneCard
          icon="zi-heart"
          title="First trip"
          label={`${anniversaries.length} memories`}
          value={anniversaries[0]?.title ?? "Da Nang"}
        />
      </div>

      <TimelineSection anniversaries={home.visibleAnniversaries} />
      <MemoryChips />
      <FeedbackPanel
        mockMode={isMockMode}
        inviteFeedback={inviteFeedback}
        actionFeedback={home.actionFeedback}
        addPartnerLoading={addPartnerLoading}
        profileLoading={profileLoading}
      />
    </Page>
  );
}
