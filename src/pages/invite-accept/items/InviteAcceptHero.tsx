import { Icon, Text } from "@/components/zaui";

export function InviteAcceptHero() {
  return (
    <section className="app-opening-hero">
      <div className="app-hero-icon">
        <Icon icon="zi-heart" />
      </div>
      <Text className="app-hero-copy">Người ấy đang chờ bạn tham gia</Text>
    </section>
  );
}
