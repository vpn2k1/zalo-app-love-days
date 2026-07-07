import { Page, Text } from "@/components/zaui";
import { StatusBar } from "@/pages/home/items/StatusBar";
import { PermissionAllowAction } from "./items/PermissionAllowAction";
import { PermissionCard } from "./items/PermissionCard";
import { PermissionHeader } from "./items/PermissionHeader";
import { PermissionHero } from "./items/PermissionHero";
import { PermissionStats } from "./items/PermissionStats";
import { getPermissionCopy } from "./modules/getPermissionCopy";
import type { PermissionGateProps } from "./types/PermissionGateType";
import "../../css/app.css";
import { PermissionStep } from "./items/PermissionStep";

export function PermissionGate({
  blocked,
  loading,
  onAllow,
}: PermissionGateProps) {
  const copy = getPermissionCopy(blocked);

  return (
    <Page className="app-opening-page">
      {/* <StatusBar /> */}
      <PermissionHeader />
      <PermissionHero title={copy.heroTitle} />
      <Text className="app-alternate-intro-subtitle">{copy.note}</Text>
      <PermissionStep/>
      <PermissionCard copy={copy.cardCopy} title={copy.cardTitle} />
      <PermissionAllowAction
        actionLabel={copy.actionLabel}
        loading={loading}
        onAllow={onAllow}
      />
    </Page>
  );
}
