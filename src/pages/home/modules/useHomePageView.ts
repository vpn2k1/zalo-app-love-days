import { useWatch } from "react-hook-form";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import type { Person } from "../types/HomePageType";
import type { HomeDisplayFormValues } from "../types/HomePageType";
import { useHomePage } from "./useHomePage";
import { useHomePageContext } from "./useHomePageContext";

export function useHomePageView() {
  const props = useHomePageContext();
  const navigation = useAppNavigation();
  const memories = useWatch<HomeDisplayFormValues, "memories">({
    name: "memories",
  });
  const startDate = useWatch<HomeDisplayFormValues, "startDate">({
    name: "startDate",
    exact: true,
  });
  const backgroundUrl = useWatch<HomeDisplayFormValues, "backgroundUrl">({
    name: "backgroundUrl",
    exact: true,
  });
  const currentName = useWatch<HomeDisplayFormValues, "currentName">({
    name: "currentName",
    exact: true,
  });
  const currentAvatar = useWatch<HomeDisplayFormValues, "currentAvatar">({
    name: "currentAvatar",
    exact: true,
  });
  const partnerName = useWatch<HomeDisplayFormValues, "partnerName">({
    name: "partnerName",
    exact: true,
  });
  const partnerAvatar = useWatch<HomeDisplayFormValues, "partnerAvatar">({
    name: "partnerAvatar",
    exact: true,
  });
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

  return {
    addAnniversary: home.addAnniversary,
    addAnniversaryLoading: props.addAnniversaryLoading,
    backgroundUrl,
    currentPerson,
    memories,
    nextAnniversary: home.nextAnniversary,
    onAddPartner: props.onAddPartner,
    onEditProfile: props.onEditProfile,
    onViewAlbums: navigation.goAlbum,
    onViewAllAnniversaries: navigation.goAnniversaries,
    openCalendar: navigation.goCalendar,
    partnerPerson,
    hideAnniversaryForm,
    showAnniversaryComposer: home.showAnniversaryForm,
    showAnniversaryForm,
    startDate,
    toggleAnniversaryForm,
    visibleAnniversaries: home.visibleAnniversaries,
  };
}

function getPartnerPerson(name: string, avatar: string): Person | undefined {
  if (!name && !avatar) return undefined;

  return { avatar, name };
}
