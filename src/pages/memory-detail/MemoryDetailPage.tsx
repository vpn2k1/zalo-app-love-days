import { AppStatusBar } from "@/components/AppStatusBar";
import { AppImageViewer, Page, useSearchParams } from "@/components/zaui";
import { useAnniversariesData } from "@/hooks/useAnniversariesData";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Anniversary } from "@/types/anniversary";
import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { MemoryDetailFields } from "./items/MemoryDetailFields";
import { MemoryDetailFooter } from "./items/MemoryDetailFooter";
import { MemoryDetailHeader } from "./items/MemoryDetailHeader";
import { MemoryDetailLoadingState } from "./items/MemoryDetailLoadingState";
import { MemoryDetailMissingState } from "./items/MemoryDetailMissingState";
import { MemoryImagePreview } from "./items/MemoryImagePreview";
import {
  getCanUpdate,
  getMemoryDetailDefaultValues,
} from "./modules/memoryDetailForm";
import { useMemoryDetailUpdate } from "./modules/useMemoryDetailUpdate";
import type { MemoryDetailFormValues } from "./types/MemoryDetailPageType";

export function MemoryDetailPage() {
  const [searchParams] = useSearchParams();
  const memoryId = searchParams.get("id");
  const navigation = useAppNavigation();
  const { user } = useCurrentUser();
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversariesQuery } = useAnniversariesData();
  const memory = findMemory(anniversariesQuery.data, memoryId);

  if (!user) return null;

  if (coupleQuery.isPending || anniversariesQuery.isPending) {
    return <MemoryDetailLoadingState />;
  }

  if (!coupleData || !memory) {
    return <MemoryDetailMissingState onBack={navigation.goAnniversaries} />;
  }

  return (
    <MemoryDetailContent
      coupleId={coupleData.couple.id}
      memory={memory}
      onBack={navigation.goAnniversaries}
    />
  );
}

function MemoryDetailContent({
  coupleId,
  memory,
  onBack,
}: {
  coupleId: string;
  memory: Anniversary;
  onBack: () => void;
}) {
  const [viewerVisible, setViewerVisible] = useState(false);
  const methods = useForm<MemoryDetailFormValues>({
    defaultValues: getMemoryDetailDefaultValues(memory),
    mode: "onChange",
  });
  const { control, formState, handleSubmit, reset } = methods;
  const imageUrl = useWatch({ control, name: "image_url" });
  const updateMutation = useMemoryDetailUpdate({
    coupleId,
    memory,
    onUpdated: (updatedMemory) => {
      reset(getMemoryDetailDefaultValues(updatedMemory));
    },
  });
  const canUpdate = getCanUpdate(
    formState.isDirty,
    formState.isValid,
    updateMutation.isPending,
  );
  const openViewer = () => {
    if (!imageUrl) return;

    setViewerVisible(true);
  };
  const closeViewer = () => {
    setViewerVisible(false);
  };
  const submit = handleSubmit((values) => {
    updateMutation.mutate(values);
  });

  return (
    <FormProvider {...methods}>
      <Page className="mx-auto min-h-screen w-[min(100%,430px)] bg-[#fff4f8] px-[18px] pb-[calc(96px+env(safe-area-inset-bottom))] pt-4 text-[#3c2435]">
        <AppStatusBar />
        <MemoryDetailHeader memory={memory} onBack={onBack} />
        <MemoryImagePreview imageUrl={imageUrl} onOpen={openViewer} />
        <MemoryDetailFields />
        <MemoryDetailFooter
          canUpdate={canUpdate}
          loading={updateMutation.isPending}
          onBack={onBack}
          onSubmit={submit}
        />
        {imageUrl && (
          <AppImageViewer
            images={[imageUrl]}
            visible={viewerVisible}
            onClose={closeViewer}
          />
        )}
      </Page>
    </FormProvider>
  );
}

function findMemory(items: Anniversary[] | undefined, memoryId: string | null) {
  if (!items) return undefined;
  if (!memoryId) return undefined;

  return items.find((item) => item.id === memoryId);
}
