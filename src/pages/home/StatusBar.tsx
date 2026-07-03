import { Icon } from "zmp-ui";

export function StatusBar() {
  return (
    <div className="app-status">
      <span>9:41</span>
      <span className="app-status-icons">
        <Icon icon="zi-more-grid" />
        <Icon icon="zi-search" />
        <Icon icon="zi-close" />
      </span>
    </div>
  );
}
