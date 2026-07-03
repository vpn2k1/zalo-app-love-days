import { Button, Icon, Page, Text } from "zmp-ui";
import { StatusBar } from "./home/StatusBar";
import "../css/app.css";

type Props = {
  loading?: boolean;
  error?: string;
  onAccept: () => Promise<void>;
};

export function InviteAcceptPage({ loading, error, onAccept }: Props) {
  return (
    <Page className="app-opening-page">
      <StatusBar />

      <header className="app-opening-header">
        <Text.Title size="large">Love Days</Text.Title>
        <Text>Lời mời dành riêng cho hai bạn</Text>
      </header>

      <section className="app-opening-hero">
        <div className="app-hero-icon">
          <Icon icon="zi-heart" />
        </div>
        <Text className="app-hero-copy">Người ấy đang chờ bạn tham gia</Text>
      </section>

      <section className="app-opening-card">
        <div>
          <Text.Title size="small">Cùng lưu giữ hành trình</Text.Title>
          <Text className="app-card-copy">
            Nhận lời mời để đếm ngày bên nhau, thêm kỷ niệm và lưu dấu mốc riêng.
          </Text>
        </div>
        <span className="app-small-heart">
          <Icon icon="zi-add-user" />
        </span>
      </section>

      <section className="app-opening-days">
        <Text.Title size="large">2 người</Text.Title>
        <Text>một không gian chung</Text>
      </section>

      {error && <Text className="app-error-text">{error}</Text>}

      <div className="app-opening-action">
        <Button fullWidth loading={loading} onClick={onAccept}>
          Tham gia ngay
        </Button>
        <Text className="app-opening-note">Bạn có thể chỉnh hồ sơ sau khi vào app.</Text>
      </div>
    </Page>
  );
}
