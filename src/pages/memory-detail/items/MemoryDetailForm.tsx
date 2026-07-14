import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { Box } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { currentUserStore } from "@/services/currentUserStore";

import {
  getCanCreate,
  getCanUpdate,
} from "../modules/memoryDetailForm";
import { useMemoryDetailCreate } from "../modules/useMemoryDetailCreate";
import { useMemoryDetailDelete } from "../modules/useMemoryDetailDelete";
import { useMemoryDetailUpdate } from "../modules/useMemoryDetailUpdate";
import type {
  MemoryDetailFormValues,
  MemoryDetailMode,
} from "../types/MemoryDetailPageType";
import { MemoryDeleteConfirmModal } from "./MemoryDeleteConfirmModal";
import { MemoryDetailFields } from "./MemoryDetailFields";
import { MemoryDetailFooter } from "./MemoryDetailFooter";
import { MemoryDetailFormShell } from "./MemoryDetailFormShell";
import { MemoryDetailHeader } from "./MemoryDetailHeader";

export function MemoryDetailForm() {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const { control, formState, handleSubmit } =
    useFormContext<MemoryDetailFormValues>();
  const createdBy = useWatch({ control, name: "created_by", exact: true });
  const mode = useWatch({ control, name: "mode", exact: true });
  const createMutation = useMemoryDetailCreate();
  const deleteMutation = useMemoryDetailDelete();
  const navigation = useAppNavigation();
  const canCreate = getCanCreate(formState.isValid, createMutation.isPending);
  const updateMutation = useMemoryDetailUpdate();
  const canUpdate = getCanUpdate(
    formState.isDirty,
    formState.isValid,
    updateMutation.isPending,
  );
  const canDelete = getCanDelete(
    mode,
    createdBy,
    deleteMutation.isPending,
  );
  const submit = handleSubmit((values) => {
    if (mode !== "update") {
      createMutation.mutate(values);
      return;
    }

    updateMutation.mutate(values);
  });
  const openDeleteConfirm = () => {
    setDeleteConfirmVisible(true);
  };
  const closeDeleteConfirm = () => {
    if (deleteMutation.isPending) return;

    setDeleteConfirmVisible(false);
  };
  const confirmDelete = () => {
    deleteMutation.mutate();
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
      <MemoryDetailHeader
        canDelete={canDelete}
        mode={mode}
        onBack={navigation.goBack}
        onDelete={openDeleteConfirm}
      />
      <Box className="grid gap-3">
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
        show={view.loading || deleteMutation.isPending}
        message={getLoadingMessage(view.loading, view.loadingMessage)}
      />
      <MemoryDeleteConfirmModal
        loading={deleteMutation.isPending}
        visible={deleteConfirmVisible}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
      />
    </MemoryDetailFormShell>
  );
}

function getCanDelete(
  mode: MemoryDetailMode,
  createdBy: string | undefined,
  deleting: boolean,
) {
  if (mode !== "update") return false;
  if (deleting) return false;

  return currentUserStore.get()?.id === createdBy;
}

function getLoadingMessage(saving: boolean, savingMessage: string) {
  if (saving) return savingMessage;

  return "Đang xoá kỷ niệm...";
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
