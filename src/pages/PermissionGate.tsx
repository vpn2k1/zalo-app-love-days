import { Button, Icon, Page, Text } from "zmp-ui";
import { StatusBar } from "./home/StatusBar";
import "../css/app.css";

type Props = {
  blocked?: boolean;
  loading?: boolean;
  error?: string;
  onAllow: () => void;
};

export function PermissionGate({ blocked, loading, error, onAllow }: Props) {
  return (
    <Page className="app-opening-page">
      <StatusBar />

      <header className="app-opening-header">
        <Text.Title size="large">Love Days</Text.Title>
        <Text>Mini app lưu giữ hành trình yêu</Text>
      </header>

      <section className="app-opening-hero">
        <div className="app-hero-icon">♡</div>
        <Text className="app-hero-copy">Bắt đầu câu chuyện của hai bạn</Text>
      </section>

      <section className="app-opening-card">
        <div>
          <Text.Title size="small">
            {blocked ? "Cần quyền Zalo để tiếp tục" : "Lưu lại hành trình"}
          </Text.Title>
          <Text className="app-card-copy">
            {blocked
              ? "Ứng dụng cần quyền đọc thông tin cơ bản để tạo không gian riêng cho hai bạn."
              : "Đếm ngày bên nhau, kỷ niệm và ghi chú trong Zalo"}
          </Text>
        </div>
        <span className="app-small-heart">
          <Icon icon="zi-heart" />
        </span>
      </section>

      <section className="app-opening-days">
        <Text.Title size="large">
          {blocked ? "thử lại" : "1 chạm"}
        </Text.Title>
        <Text>thiết lập rồi vào app</Text>
      </section>

      <OpeningActionGrid />
      <Text className="app-opening-before">Trước khi bắt đầu</Text>
      {error && <Text className="app-error-text">{error}</Text>}

      <div className="app-opening-action">
        <Button fullWidth loading={loading} onClick={onAllow}>
          {blocked ? "Thử lại" : "Thiết lập"}
        </Button>
        <Text className="app-opening-note">An toàn, riêng tư và có thể chỉnh sau.</Text>
      </div>
    </Page>
  );
}

function OpeningActionGrid() {
  const items = [
    { icon: "zi-calendar", label: "Ngày yêu" },
    { icon: "zi-note", label: "Kỷ niệm" },
    { icon: "zi-chat", label: "Ghi chú" },
    { icon: "zi-shield-solid", label: "Riêng tư" },
  ] as const;

  return (
    <div className="app-actions app-opening-actions">
      {items.map((item) => (
        <div className="app-action" key={item.label}>
          <Icon icon={item.icon} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
