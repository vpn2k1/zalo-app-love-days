import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { quickMemoryImageStorageKey } from "@/hooks/useAppNavigation";
import { useCoupleData } from "@/hooks/useCoupleData";
import { anniversaryService } from "@/services/anniversaryService";
import { useSearchParams } from "@/components/zaui";

import {
  getCreateMemoryDetailDefaultValues,
  getMemoryDetailDefaultValues,
} from "./memoryDetailForm";
import type {
  MemoryDetailFormValues,
  MemoryDetailMode,
} from "../types/MemoryDetailPageType";

export function useFormValuesMemory() {
  const [searchParams] = useSearchParams();
  const memoryId = searchParams.get("id");
  const { coupleData } = useCoupleData();
  const coupleId = coupleData?.couple.id;
  const mode = getMemoryDetailMode(searchParams.get("type"));
  const initialImageUrl = getInitialImageUrl(searchParams.get("quickImage"));

  const memoryQuery = useQuery({
    queryKey: ["get-memory", coupleId, memoryId],
    queryFn: () =>
      anniversaryService.getOne({
        coupleId: coupleId ?? "",
        id: memoryId ?? "",
      }),
    enabled: Boolean(memoryId && coupleId),
  });
  const loading = mode !== "create" && Boolean(memoryId) && (
    !coupleId || memoryQuery.isPending
  );
  const missing = mode !== "create" && !loading && !memoryQuery.data;
  const forms = useForm<MemoryDetailFormValues>({
    defaultValues: {
      ...getCreateMemoryDetailDefaultValues(initialImageUrl),
      created_by: "",
      id: "",
      couple_id: coupleId ?? "",
      mode,
    },
    mode: "all",
  });

  useEffect(() => {
    if (memoryQuery.data) {
      forms.reset({
        ...getMemoryDetailDefaultValues(memoryQuery.data),
        couple_id: coupleId ?? "",
        created_by: memoryQuery.data.created_by,
        id: memoryQuery.data.id,
        mode: "update",
      });
      return;
    }
    if (mode !== "create") return;

    forms.reset({
      ...getCreateMemoryDetailDefaultValues(initialImageUrl),
      couple_id: coupleId ?? "",
      created_by: "",
      id: "",
      mode: "create",
    });
  }, [coupleId, forms, initialImageUrl, memoryQuery.data, mode]);

  return {
    forms,
    loading,
    memoryQuery,
    missing,
    mode,
  };
}

function getMemoryDetailMode(value: string | null): MemoryDetailMode {
  if (value === "create") return "create";

  return "update";
}

function getInitialImageUrl(quickImage: string | null) {
  if (quickImage !== "1") return "";

  return sessionStorage.getItem(quickMemoryImageStorageKey) ?? "";
}
