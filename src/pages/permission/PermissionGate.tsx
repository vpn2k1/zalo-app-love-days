import { Page, Text } from "@/components/zaui";
import { StatusBar } from "@/pages/home/items/StatusBar";
import { PermissionActionGrid } from "./items/PermissionActionGrid";
import { PermissionAllowAction } from "./items/PermissionAllowAction";
import { PermissionCard } from "./items/PermissionCard";
import { PermissionHeader } from "./items/PermissionHeader";
import { PermissionHero } from "./items/PermissionHero";
import { PermissionStats } from "./items/PermissionStats";
import { getPermissionCopy } from "./modules/getPermissionCopy";
import type { PermissionGateProps } from "./types/PermissionGateType";
import "../../css/app.css";

export function PermissionGate({
  blocked,
  loading,
  onAllow,
}: PermissionGateProps) {
  const copy = getPermissionCopy(blocked);

  return (
    <Page className="app-opening-page">
      <StatusBar />
      <PermissionHeader />
      <PermissionHero />
      <PermissionCard copy={copy.cardCopy} title={copy.cardTitle} />
      <PermissionStats dayTitle={copy.dayTitle} />
      <PermissionActionGrid />
      <Text className="app-opening-before">Trước khi bắt đầu</Text>
      <PermissionAllowAction
        actionLabel={copy.actionLabel}
        loading={loading}
        onAllow={onAllow}
      />
    </Page>
  );
}
