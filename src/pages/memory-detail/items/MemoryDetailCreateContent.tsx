import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { AppImageViewer, Box } from "@/components/zaui";

import { MemoryDetailFields } from "./MemoryDetailFields";
import { MemoryDetailFooter } from "./MemoryDetailFooter";
import { MemoryDetailFormShell } from "./MemoryDetailFormShell";
import { MemoryDetailHeader } from "./MemoryDetailHeader";
import { MemoryImagePreview } from "./MemoryImagePreview";
import {
  getCanCreate,
  getCreateMemoryDetailDefaultValues,
} from "../modules/memoryDetailForm";
import { useMemoryDetailCreate } from "../modules/useMemoryDetailCreate";
import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";

type Props = {
  coupleId: string;
  initialImageUrl?: string;
  userId: string;
  onBack: () => void;
  onCreated: (memoryId: string) => void;
};

export function MemoryDetailCreateContent({
  coupleId,
  initialImageUrl,
  userId,
  onBack,
  onCreated,
}: Props) {
  const [viewerVisible, setViewerVisible] = useState(false);
  const methods = useForm<MemoryDetailFormValues>({
    defaultValues: getCreateMemoryDetailDefaultValues(initialImageUrl),
    mode: "onChange",
  });
  const { control, formState, handleSubmit } = methods;
  const imageUrl = useWatch({ control, name: "image_url" });
  const createMutation = useMemoryDetailCreate({
    coupleId,
    userId,
    onCreated: (memory) => {
      onCreated(memory.id);
    },
  });
  const canCreate = getCanCreate(formState.isValid, createMutation.isPending);
  const submit = handleSubmit((values) => {
    createMutation.mutate(values);
  });
  const openViewer = () => {
    if (!imageUrl) return;

    setViewerVisible(true);
  };
  const closeViewer = () => {
    setViewerVisible(false);
  };

  return (
    <MemoryDetailFormShell>
      <FormProvider {...methods}>
        <MemoryDetailHeader mode="create" onBack={onBack} />
        <Box className="grid gap-3">
          <MemoryImagePreview imageUrl={imageUrl} onOpen={openViewer} />
          <MemoryDetailFields dateDisabled={false} />
        </Box>
        <MemoryDetailFooter
          canSubmit={canCreate}
          loading={createMutation.isPending}
          submitLabel="Tạo mới"
          onBack={onBack}
          onSubmit={submit}
        />
        <BlockingLoadingOverlay
          show={createMutation.isPending}
          message="Đang tạo kỷ niệm..."
        />
        {imageUrl && (
          <AppImageViewer
            images={[imageUrl]}
            visible={viewerVisible}
            onClose={closeViewer}
          />
        )}
      </FormProvider>
    </MemoryDetailFormShell>
  );
}
