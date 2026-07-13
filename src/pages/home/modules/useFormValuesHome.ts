import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Anniversary } from "@/types/anniversary";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";

import type { HomeFormValues } from "../types/HomePageType";

const EMPTY_HOME_FORM_VALUES: HomeFormValues = {
  backgroundUrl: "",
  coupleCreatedBy: "",
  coupleId: "",
  currentAvatar: "",
  currentName: "",
  memories: [],
  partnerAvatar: "",
  partnerName: "",
  startDate: "",
};

export function useFormValuesHome() {
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversaries, anniversariesQuery } = useAnniversariesData(
    coupleData?.couple.id ?? "",
  );
  const values = useMemo(
    () => getHomeFormValues(user, coupleData, anniversaries),
    [anniversaries, coupleData, user],
  );
  const forms = useForm<HomeFormValues>({
    defaultValues: EMPTY_HOME_FORM_VALUES,
    values,
  });
  const loading = coupleQuery.isPending
    || Boolean(coupleData && anniversariesQuery.isPending);

  return { coupleData, forms, loading, user };
}

function getHomeFormValues(
  user: AppUser | null,
  coupleData: CoupleWithMembers | null,
  memories: Anniversary[],
): HomeFormValues {
  if (!user || !coupleData) return EMPTY_HOME_FORM_VALUES;

  const currentMember = coupleData.members.find(
    (member) => member.user_id === user.id,
  );
  const partnerMember = coupleData.members.find(
    (member) => member.user_id !== user.id,
  );
  const currentUser = getCurrentUser(user, currentMember?.user);
  const partner = partnerMember?.user;

  return {
    backgroundUrl: coupleData.couple.background_url || "",
    coupleCreatedBy: coupleData.couple.created_by,
    coupleId: coupleData.couple.id,
    currentAvatar:
      currentUser.custom_avatar_url || currentUser.avatar_url || "",
    currentName: currentUser.display_name || currentUser.name,
    memories,
    partnerAvatar: partner?.custom_avatar_url || partner?.avatar_url || "",
    partnerName: partner?.display_name || partner?.name || "",
    startDate: coupleData.couple.start_date,
  };
}

function getCurrentUser(user: AppUser, memberUser: AppUser | undefined) {
  if (!memberUser) return user;

  return { ...memberUser, ...user };
}
