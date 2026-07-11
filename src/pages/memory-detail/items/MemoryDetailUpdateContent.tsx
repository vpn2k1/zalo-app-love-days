import { useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { AppImageViewer, Box } from "@/components/zaui";
import type { Anniversary } from "@/types/anniversary";

import { MemoryDetailFields } from "./MemoryDetailFields";
import { MemoryDetailFooter } from "./MemoryDetailFooter";
import { MemoryDetailFormShell } from "./MemoryDetailFormShell";
import { MemoryDetailHeader } from "./MemoryDetailHeader";
import { MemoryImagePreview } from "./MemoryImagePreview";
import {
  getCanUpdate,
  getMemoryDetailDefaultValues,
} from "../modules/memoryDetailForm";
import { useMemoryDetailUpdate } from "../modules/useMemoryDetailUpdate";
import type { MemoryDetailFormValues } from "../types/MemoryDetailPageType";

type Props = {
  coupleId: string;
  memory: Anniversary;
  onBack: () => void;
};

export function MemoryDetailUpdateContent({
  coupleId,
  memory,
  onBack,
}: Props) {
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
    <MemoryDetailFormShell>
      <FormProvider {...methods}>
        <MemoryDetailHeader memory={memory} mode="update" onBack={onBack} />
        <Box className="grid gap-3">
          <MemoryImagePreview imageUrl={imageUrl} onOpen={openViewer} />
          <MemoryDetailFields dateDisabled />
        </Box>
        <MemoryDetailFooter
          canSubmit={canUpdate}
          loading={updateMutation.isPending}
          submitLabel="Cập nhật"
          onBack={onBack}
          onSubmit={submit}
        />
        <BlockingLoadingOverlay
          show={updateMutation.isPending}
          message="Đang lưu kỷ niệm..."
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
