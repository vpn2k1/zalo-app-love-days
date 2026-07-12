import { Box, Icon } from "@/components/zaui";
import type { HomePageContentProps, Person } from "../types/HomePageType";
import { PersonChip } from "./PersonChip";

type Props = {
  currentPerson: Person;
  partnerPerson?: Person;
  onAddPartner: HomePageContentProps["onAddPartner"];
  onEditProfile: HomePageContentProps["onEditProfile"];
};

export function CouplePeoplePanel({
  currentPerson,
  partnerPerson,
  onAddPartner,
  onEditProfile,
}: Props) {
  let partnerClick: HomePageContentProps["onAddPartner"] | undefined =
    onAddPartner;
  if (partnerPerson) {
    partnerClick = undefined;
  }

  return (
    <Box className="my-4 grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 rounded-2xl bg-white p-3">
      <Box className="min-w-0">
        <PersonChip person={currentPerson} onClick={onEditProfile} />
      </Box>
      <Box className="flex justify-center pt-3">
        <Icon icon="zi-heart-solid" size={36} className="text-[#ef4444]" />
      </Box>
      <Box className="min-w-0">
        <PersonChip
          person={partnerPerson}
          emptyLabel="Mời người ấy"
          onEmptyClick={partnerClick}
        />
      </Box>
    </Box>
  );
}
