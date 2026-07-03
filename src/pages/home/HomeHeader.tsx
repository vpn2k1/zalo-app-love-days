import { Icon, Text } from "zmp-ui";

type Props = {
  title: string;
  subtitle: string;
  onEditProfile: () => void;
};

export function HomeHeader({ title, subtitle, onEditProfile }: Props) {
  return (
    <header className="app-header">
      <div>
        <Text.Title size="large">{title}</Text.Title>
        <Text className="app-header-subtitle">{subtitle}</Text>
      </div>
      <button
        type="button"
        className="app-icon-button"
        aria-label="Mở hồ sơ"
        onClick={onEditProfile}
      >
        <Icon icon="zi-user" />
      </button>
    </header>
  );
}
