import { useMemo, useState } from "react";
import { useAppSnackbar } from "@/components/zaui";
import type { AnniversaryDraft } from "@/types/anniversary";
import { diffInDays, getNextAnniversary } from "@/utils/date";
import { pickImagePath } from "@/utils/imagePicker";
import type { HomePageContentProps } from "../types/HomePageType";

export function useHomePage({
  user,
  coupleData,
  anniversaries,
  onSaveProfile,
  onAddAnniversary,
}: Pick<
  HomePageContentProps,
  "user" | "coupleData" | "anniversaries" | "onSaveProfile" | "onAddAnniversary"
>) {
  const [showAnniversaryForm, setShowAnniversaryForm] = useState(false);
  const snackbar = useAppSnackbar();
  const currentMember = coupleData.members.find((member) => member.user_id === user.id);
  const partnerMember = coupleData.members.find((member) => member.user_id !== user.id);
  let currentUser = user;
  if (currentMember?.user_id === user.id) {
    currentUser = { ...currentMember.user, ...user };
  }
  const partner = partnerMember?.user;
  const currentPerson = {
    name: currentUser.display_name || currentUser.name,
    avatar: currentUser.custom_avatar_url || currentUser.avatar_url,
  };
  let partnerPerson;
  if (partner) {
    partnerPerson = {
      name: partner.display_name || partner.name,
      avatar: partner.custom_avatar_url || partner.avatar_url,
    };
  }
  const days = diffInDays(coupleData.couple.start_date);
  const nextAnniversary = useMemo(
    () => getNextAnniversary(coupleData.couple, anniversaries),
    [anniversaries, coupleData.couple],
  );
  const visibleAnniversaries = anniversaries.slice(0, 2);

  const saveAvatar = async () => {
    let imagePath = "";
    try {
      imagePath = await pickImagePath();
    } catch (error) {
      console.error(error);
      snackbar.showError("Không thể chọn ảnh. Vui lòng thử lại.");
      return;
    }

    if (!imagePath) return;

    try {
      await onSaveProfile({
        display_name: currentUser.display_name || currentUser.name,
        custom_avatar_url: imagePath,
      });
      snackbar.showSuccess("Đã cập nhật ảnh đại diện.");
    } catch (error) {
      console.error(error);
    }
  };

  const addAnniversary = async (draft: AnniversaryDraft) => {
    try {
      await onAddAnniversary(draft);
      snackbar.showSuccess("Đã thêm ngày kỷ niệm.");
      setShowAnniversaryForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    addAnniversary,
    currentUser,
    currentPerson,
    days,
    nextAnniversary,
    partner,
    partnerPerson,
    saveAvatar,
    setShowAnniversaryForm,
    showAnniversaryForm,
    visibleAnniversaries,
  };
}
