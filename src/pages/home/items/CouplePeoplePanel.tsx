import { Icon } from "@/components/zaui";
import type { HomePageContentProps, Person } from "../types/HomePageType";
import { PersonChip } from "./PersonChip";

type Props = {
  currentPerson: Person;
  partnerPerson?: Person;
  onAddPartner: HomePageContentProps["onAddPartner"];
  onSaveAvatar: () => Promise<void>;
};

export function CouplePeoplePanel({
  currentPerson,
  partnerPerson,
  onAddPartner,
  onSaveAvatar,
}: Props) {
  let partnerClick: HomePageContentProps["onAddPartner"] | undefined =
    onAddPartner;
  if (partnerPerson) {
    partnerClick = undefined;
  }

  return (
    <div className="w-full grid grid-cols-10 items-start bg-white rounded-2xl p-4 gap-4 my-4">
      <div className="col-span-4 flex justify-center">
        <PersonChip person={currentPerson} onClick={onSaveAvatar} />
      </div>
      <div className="col-span-2 flex justify-center pt-3">
        <Icon icon="zi-heart-solid" size={50} style={{ color: "#ef4444" }} />
      </div>
      <div className="col-span-4 flex justify-center">
        <PersonChip
          person={partnerPerson}
          emptyLabel="Mời người ấy"
          onClick={partnerClick}
        />
      </div>
    </div>
  );
}
