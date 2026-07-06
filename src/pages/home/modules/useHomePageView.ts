import { useWatch } from "react-hook-form";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import type { Person } from "../types/HomePageType";
import type { HomeDisplayFormValues } from "../types/HomePageType";
import { useHomePage } from "./useHomePage";
import { useHomePageContext } from "./useHomePageContext";

export function useHomePageView() {
  const props = useHomePageContext();
  const navigation = useAppNavigation();
  const memories = useWatch<HomeDisplayFormValues, "memories">({ name: "memories" });
  const startDate = useWatch<HomeDisplayFormValues, "startDate">({ name: "startDate" });
  const backgroundUrl = useWatch<HomeDisplayFormValues, "backgroundUrl">({ name: "backgroundUrl" });
  const currentName = useWatch<HomeDisplayFormValues, "currentName">({ name: "currentName" });
  const currentAvatar = useWatch<HomeDisplayFormValues, "currentAvatar">({ name: "currentAvatar" });
  const partnerName = useWatch<HomeDisplayFormValues, "partnerName">({ name: "partnerName" });
  const partnerAvatar = useWatch<HomeDisplayFormValues, "partnerAvatar">({ name: "partnerAvatar" });
  const home = useHomePage({ ...props, anniversaries: memories, startDate });
  const currentPerson = { avatar: currentAvatar, name: currentName };
  const partnerPerson = getPartnerPerson(partnerName, partnerAvatar);

  const toggleAnniversaryForm = () => {
    home.setShowAnniversaryForm((value) => !value);
  };

  const showAnniversaryForm = () => {
    home.setShowAnniversaryForm(true);
  };

  const hideAnniversaryForm = () => {
    home.setShowAnniversaryForm(false);
  };

  const saveHomeDisplayInfo = (values: HomeDisplayFormValues) =>
    saveDisplayInfo(props, values);

  return {
    addAnniversary: home.addAnniversary,
    addAnniversaryLoading: props.addAnniversaryLoading,
    backgroundUrl,
    currentPerson,
    memories,
    nextAnniversary: home.nextAnniversary,
    onAddPartner: props.onAddPartner,
    onEditProfile: props.onEditProfile,
    onSaveDisplayInfo: saveHomeDisplayInfo,
    onViewAlbums: navigation.goAlbum,
    onViewAllAnniversaries: navigation.goAnniversaries,
    openCalendar: showAnniversaryForm,
    partnerPerson,
    profileLoading: props.profileLoading,
    hideAnniversaryForm,
    showAnniversaryComposer: home.showAnniversaryForm,
    showAnniversaryForm,
    startDate,
    toggleAnniversaryForm,
    visibleAnniversaries: home.visibleAnniversaries,
  };
}

async function saveDisplayInfo(
  props: ReturnType<typeof useHomePageContext>,
  values: HomeDisplayFormValues,
) {
  await props.onUpdateProfile({
    custom_avatar_url: values.currentAvatar || null,
    display_name: values.currentName.trim(),
  });
  await props.onUpdateBackground(values.backgroundUrl || null);
  await props.onUpdateStartDate(values.startDate);
}

function getPartnerPerson(name: string, avatar: string): Person | undefined {
  if (!name && !avatar) return undefined;

  return { avatar, name };
}
