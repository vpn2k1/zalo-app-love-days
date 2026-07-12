import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import {
  quickMemoryImageStorageKey,
  useAppNavigation,
} from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Anniversary } from "@/types/anniversary";
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
  const { data } = useGetMemory();
  console.log(data);
  
  const initialImageUrl = getInitialImageUrl(searchParams.get("quickImage"));
  const navigation = useAppNavigation();
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversariesQuery } = useAnniversariesData(
    coupleData?.couple.id ?? "",
  );

  if (!user) return null;

  if (coupleQuery.isPending) {
    return <MemoryDetailLoadingState />;
  }

  if (!coupleData?.couple.id && !coupleQuery.isPending) {
    return <MemoryDetailMissingState onBack={navigation.goBack} />;
  }

  if (mode === "create") {
    return (
      <MemoryDetailCreateContent
        coupleId={coupleData.couple.id}
        initialImageUrl={initialImageUrl}
        userId={user.id}
        onBack={navigation.goBack}
        onCreated={navigation.goMemory}
      />
    );
  }

  if (anniversariesQuery.isPending) {
    return <MemoryDetailLoadingState />;
  }

  const memory = findMemory(anniversariesQuery.data, memoryId);
  if (!memory) {
    return <MemoryDetailMissingState onBack={navigation.goBack} />;
  }

  return (
    <MemoryDetailUpdateContent
      coupleId={coupleData.couple.id}
      memory={memory}
      onBack={navigation.goBack}
    />
  );
}

function findMemory(items: Anniversary[] | undefined, memoryId: string | null) {
  if (!items) return undefined;
  if (!memoryId) return undefined;

  return items.find((item) => item.id === memoryId);
}

function getMemoryDetailMode(value: string | null): MemoryDetailMode {
  if (value === "create") return "create";

  return "update";
}

function getInitialImageUrl(quickImage: string | null) {
  if (quickImage !== "1") return "";

  return sessionStorage.getItem(quickMemoryImageStorageKey) ?? "";
}
