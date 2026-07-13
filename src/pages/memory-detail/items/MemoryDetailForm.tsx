import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { AppImageViewer, Box } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";

import {
  getCanCreate,
  getCanUpdate,
} from "../modules/memoryDetailForm";
import { useMemoryDetailCreate } from "../modules/useMemoryDetailCreate";
import { useMemoryDetailUpdate } from "../modules/useMemoryDetailUpdate";
import type {
  MemoryDetailFormValues,
  MemoryDetailMode,
} from "../types/MemoryDetailPageType";
import { MemoryDetailFields } from "./MemoryDetailFields";
import { MemoryDetailFooter } from "./MemoryDetailFooter";
import { MemoryDetailFormShell } from "./MemoryDetailFormShell";
import { MemoryDetailHeader } from "./MemoryDetailHeader";
import { MemoryImagePreview } from "./MemoryImagePreview";

export function MemoryDetailForm() {
  const [viewerVisible, setViewerVisible] = useState(false);

  const { control, formState, handleSubmit } =
    useFormContext<MemoryDetailFormValues>();
  const imageUrl = useWatch({ control, name: "image_url", exact: true });
  const mode = useWatch({ control, name: "mode", exact: true });
  const createMutation = useMemoryDetailCreate();
  const navigation = useAppNavigation();
  const canCreate = getCanCreate(formState.isValid, createMutation.isPending);
  const updateMutation = useMemoryDetailUpdate();
  const canUpdate = getCanUpdate(
    formState.isDirty,
    formState.isValid,
    updateMutation.isPending,
  );
  const submit = handleSubmit((values) => {
    if (mode !== "update") {
      createMutation.mutate(values);
      return;
    }

    updateMutation.mutate(values);
  });
  const openViewer = () => {
    if (!imageUrl) return;

    setViewerVisible(true);
  };
  const closeViewer = () => {
    setViewerVisible(false);
  };
  const view = getMemoryDetailFormView(
    mode,
    canCreate,
    canUpdate,
    createMutation.isPending,
    updateMutation.isPending,
  );

  return (
    <MemoryDetailFormShell>
      <MemoryDetailHeader mode={mode} onBack={navigation.goBack} />
      <Box className="grid gap-3">
        <MemoryImagePreview imageUrl={imageUrl} onOpen={openViewer} />
        <MemoryDetailFields dateDisabled={mode === "update"} />
      </Box>
      <MemoryDetailFooter
        canSubmit={view.canSubmit}
        loading={view.loading}
        submitLabel={view.submitLabel}
        onBack={navigation.goBack}
        onSubmit={submit}
      />
      <BlockingLoadingOverlay
        show={view.loading}
        message={view.loadingMessage}
      />
      {imageUrl && (
        <AppImageViewer
          images={[imageUrl]}
          visible={viewerVisible}
          onClose={closeViewer}
        />
      )}
    </MemoryDetailFormShell>
  );
}

function getMemoryDetailFormView(
  mode: MemoryDetailMode,
  canCreate: boolean,
  canUpdate: boolean,
  creating: boolean,
  updating: boolean,
) {
  if (mode !== "update") {
    return {
      canSubmit: canCreate,
      loading: creating,
      loadingMessage: "Đang tạo kỷ niệm...",
      submitLabel: "Tạo mới",
    };
  }

  return {
    canSubmit: canUpdate,
    loading: updating,
    loadingMessage: "Đang lưu kỷ niệm...",
    submitLabel: "Cập nhật",
  };
}
