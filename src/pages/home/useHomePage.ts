import { useMemo, useState } from "react";
import type { AnniversaryDraft } from "@/types/anniversary";
import { diffInDays, getNextAnniversary } from "@/utils/date";
import { pickImagePath } from "@/utils/imagePicker";
import type { HomePageProps } from "./types";

export function useHomePage({
  user,
  coupleData,
  anniversaries,
  onSaveProfile,
  onAddAnniversary,
}: Pick<
  HomePageProps,
  "user" | "coupleData" | "anniversaries" | "onSaveProfile" | "onAddAnniversary"
>) {
  const [showAnniversaryForm, setShowAnniversaryForm] = useState(false);
  const [actionFeedback, setActionFeedback] = useState("");
  const currentMember = coupleData.members.find((member) => member.user_id === user.id);
  const partnerMember = coupleData.members.find((member) => member.user_id !== user.id);
  const currentUser = currentMember?.user_id === user.id
    ? { ...currentMember.user, ...user }
    : user;
  const partner = partnerMember?.user;
  const days = diffInDays(coupleData.couple.start_date);
  const nextAnniversary = useMemo(
    () => getNextAnniversary(coupleData.couple, anniversaries),
    [anniversaries, coupleData.couple],
  );
  const visibleAnniversaries = anniversaries.slice(0, 2);

  const saveAvatar = async () => {
    setActionFeedback("");
    try {
      const imagePath = await pickImagePath();
      if (!imagePath) return;
      await onSaveProfile({
        display_name: currentUser.display_name || currentUser.name,
        custom_avatar_url: imagePath,
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

  return {
    actionFeedback,
    addAnniversary,
    currentUser,
    days,
    nextAnniversary,
    partner,
    saveAvatar,
    setShowAnniversaryForm,
    showAnniversaryForm,
    visibleAnniversaries,
  };
}
