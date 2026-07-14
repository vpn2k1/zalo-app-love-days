import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";

import { useAppSnackbar } from "@/components/zaui";
import {
  allAnniversariesQueryKey,
  anniversariesByDateQueryKey,
  coupleQueryKey,
} from "@/config/queryKeys";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import {
  restoreCurrentUser,
  setCurrentUserCache,
} from "@/hooks/useCurrentUser";
import type { Anniversary } from "@/types/anniversary";
import { getNextAnniversary, todayDateString } from "@/utils/date";

import type { HomeFormValues, Person } from "../types/HomePageType";
import { useInvitePartnerMutation } from "./useInvitePartnerMutation";
import { useTodayAnniversaries } from "./useTodayAnniversaries";

export function useHomePage() {
  const queryClient = useQueryClient();
  const navigation = useAppNavigation();
  const snackbar = useAppSnackbar();
  const invitePartner = useInvitePartnerMutation();
  const [refreshing, setRefreshing] = useState(false);
  const { control } = useFormContext<HomeFormValues>();
  const [
    backgroundUrl,
    coupleCreatedBy,
    coupleId,
    currentAvatar,
    currentName,
    memories,
    partnerAvatar,
    partnerName,
    startDate,
  ] = useWatch({
    control,
    exact: true,
    name: [
      "backgroundUrl",
      "coupleCreatedBy",
      "coupleId",
      "currentAvatar",
      "currentName",
      "memories",
      "partnerAvatar",
      "partnerName",
      "startDate",
    ],
  });
  const currentPerson = {
    avatar: currentAvatar,
    name: currentName,
  };
  const { todayAnniversaries } = useTodayAnniversaries(coupleId);
  const partnerPerson = getPartnerPerson(partnerName, partnerAvatar);
  const nextAnniversary = useMemo(
    () => {
      if (!startDate) return null;

      return getNextAnniversary({
        created_by: coupleCreatedBy,
        id: coupleId,
        start_date: startDate,
      }, memories);
    },
    [coupleCreatedBy, coupleId, memories, startDate],
  );
  const visibleAnniversaries = useMemo(
    () => getNewestAnniversaries(memories),
    [memories],
  );

  const addPartner = async () => {
    await invitePartner.mutateAsync();
  };

  const refresh = async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      const user = await restoreCurrentUser();
      setCurrentUserCache(queryClient, user);
      if (!user) {
        navigation.goPermission({ replace: true });
        return;
      }

      await Promise.all([
        queryClient.refetchQueries({ queryKey: coupleQueryKey(user.id) }),
        queryClient.refetchQueries({
          queryKey: allAnniversariesQueryKey(coupleId),
        }),
        queryClient.refetchQueries({
          queryKey: anniversariesByDateQueryKey(coupleId, todayDateString()),
        }),
      ]);
    } catch (error) {
      console.error(error);
      snackbar.showError("Không thể làm mới. Vui lòng thử lại.");
    } finally {
      setRefreshing(false);
    }
  };

  return {
    addPartner,
    backgroundUrl,
    currentPerson,
    memories,
    nextAnniversary,
    onEditProfile: navigation.goEdit,
    onQuickAddMemory: navigation.goCreateMemory,
    onRefresh: refresh,
    onViewAlbums: navigation.goAlbum,
    onViewAllAnniversaries: navigation.goAnniversaries,
    openCalendar: navigation.goCalendar,
    partnerPerson,
    refreshing,
    startDate,
    todayAnniversaries,
    visibleAnniversaries,
    blockingMessage: getBlockingMessage(invitePartner.isPending),
  };
}

function getPartnerPerson(name: string, avatar: string): Person | undefined {
  if (!name && !avatar) return undefined;

  return { avatar, name };
}

function getNewestAnniversaries(anniversaries: Anniversary[]) {
  return [...anniversaries]
    .sort(compareAnniversaryDateDesc)
    .slice(0, 5);
}

function compareAnniversaryDateDesc(left: Anniversary, right: Anniversary) {
  return getDateTime(right.date) - getDateTime(left.date);
}

function getDateTime(value: string) {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return 0;

  return time;
}

function getBlockingMessage(invitingPartner: boolean) {
  if (invitingPartner) return "Đang mời người ấy...";

  return null;
}
