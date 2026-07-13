import {
  quickMemoryImageStorageKey,
  useAppNavigation,
} from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSearchParams } from "@/components/zaui";

import { MemoryDetailCreateContent } from "./items/MemoryDetailCreateContent";
import { MemoryDetailLoadingState } from "./items/MemoryDetailLoadingState";
import { MemoryDetailMissingState } from "./items/MemoryDetailMissingState";
import { MemoryDetailUpdateContent } from "./items/MemoryDetailUpdateContent";
import type { MemoryDetailMode } from "./types/MemoryDetailPageType";
import { useGetMemory } from "./modules/useGetMemory";

export function MemoryDetailPage() {
  const [searchParams] = useSearchParams();
  const mode = getMemoryDetailMode(searchParams.get("type"));
  const memoryId = searchParams.get("id");
  const memoryQuery = useGetMemory();
  const initialImageUrl = getInitialImageUrl(searchParams.get("quickImage"));
  const navigation = useAppNavigation();
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();

  if (!user) return null;

  if (coupleQuery.isPending) {
    return <MemoryDetailLoadingState />;
  }

  if (!coupleData?.couple.id && !coupleQuery.isPending) {
    return <MemoryDetailMissingState onBack={navigation.goBack} />;
  }

  const coupleId = coupleData?.couple.id;
  if (!coupleId) {
    return <MemoryDetailLoadingState />;
  }

  if (mode === "create") {
    return (
      <MemoryDetailCreateContent
        coupleId={coupleId}
        initialImageUrl={initialImageUrl}
        userId={user.id}
        onBack={navigation.goBack}
        onCreated={navigation.goMemory}
      />
    );
  }

  if (!memoryId) {
    return <MemoryDetailMissingState onBack={navigation.goBack} />;
  }

  if (memoryQuery.isPending) {
    return <MemoryDetailLoadingState />;
  }

  if (!memoryQuery.data) {
    return <MemoryDetailMissingState onBack={navigation.goBack} />;
  }

  return (
    <MemoryDetailUpdateContent
      coupleId={coupleId}
      memory={memoryQuery.data}
      onBack={navigation.goBack}
    />
  );
}

function getMemoryDetailMode(value: string | null): MemoryDetailMode {
  if (value === "create") return "create";

  return "update";
}

function getInitialImageUrl(quickImage: string | null) {
  if (quickImage !== "1") return "";

  return sessionStorage.getItem(quickMemoryImageStorageKey) ?? "";
}
