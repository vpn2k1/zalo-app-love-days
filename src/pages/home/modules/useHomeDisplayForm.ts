import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Anniversary } from "@/types/anniversary";
import type { CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";
import type { HomeDisplayFormValues } from "../types/HomePageType";

type Input = {
  anniversaries: Anniversary[];
  coupleData: CoupleWithMembers;
  user: AppUser;
};

export function useHomeDisplayForm({ anniversaries, coupleData, user }: Input) {
  const methods = useForm<HomeDisplayFormValues>({
    defaultValues: getHomeDisplayFormValues({
      anniversaries,
      coupleData,
      user,
    }),
  });

  useEffect(() => {
    methods.reset(
      getHomeDisplayFormValues({ anniversaries, coupleData, user }),
      { keepDirtyValues: true },
    );
  }, [anniversaries, coupleData, methods, user]);

  return methods;
}

function getHomeDisplayFormValues({
  anniversaries,
  coupleData,
  user,
}: Input): HomeDisplayFormValues {
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
    currentAvatar:
      currentUser.custom_avatar_url || currentUser.avatar_url || "",
    currentName: currentUser.display_name || currentUser.name,
    memories: anniversaries,
    partnerAvatar: partner?.custom_avatar_url || partner?.avatar_url || "",
    partnerName: partner?.display_name || partner?.name || "",
    startDate: coupleData.couple.start_date,
    coupleId: coupleData.couple.id,
    background: coupleData.couple.background_url || "",
  };
}

function getCurrentUser(user: AppUser, memberUser: AppUser | undefined) {
  if (!memberUser) return user;

  return { ...memberUser, ...user };
}
