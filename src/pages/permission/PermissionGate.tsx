import { Page, Text } from "@/components/zaui";
import { StatusBar } from "@/pages/home/items/StatusBar";
import { PermissionAllowAction } from "./items/PermissionAllowAction";
import { PermissionCard } from "./items/PermissionCard";
import { PermissionHeader } from "./items/PermissionHeader";
import { PermissionHero } from "./items/PermissionHero";
import { PermissionStats } from "./items/PermissionStats";
import { getPermissionCopy } from "./modules/getPermissionCopy";
import "../../css/app.css";
import { PermissionStep } from "./items/PermissionStep";
import { AppStatusBar } from "@/components/AppStatusBar";
import {
  useAuthorizeMutation,
  useSkipAuthorizeMutation,
} from "@/hooks/mutations/useAuthorizeMutation";

export function PermissionGate({
  blocked,
}: { blocked?: boolean }) {
  const authorize = useAuthorizeMutation();
  const skipAuthorize = useSkipAuthorizeMutation();
  const copy = getPermissionCopy(blocked);

  return (
    <Page className="app-opening-page">
      <AppStatusBar />
      <PermissionHeader />
      <PermissionHero title={copy.heroTitle} />
      <Text className="app-alternate-intro-subtitle">{copy.note}</Text>
      <PermissionStep />
      <PermissionCard copy={copy.cardCopy} title={copy.cardTitle} />
      <PermissionAllowAction
        actionLabel={copy.actionLabel}
        loading={authorize.isPending}
        onAllow={() => authorize.mutateAsync()}
        onSkip={() => skipAuthorize.mutateAsync()}
        skipLoading={skipAuthorize.isPending}
      />
    </Page>
  );
}
