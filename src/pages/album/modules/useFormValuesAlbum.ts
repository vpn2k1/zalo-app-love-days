import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCoupleData } from "@/hooks/useCoupleData";
import { useInfiniteAnniversariesData } from "@/hooks/useInfiniteAnniversariesData";

import { emptyFilters } from "../items/albumFilterHelpers";
import type { AlbumPageFormValues } from "../types/AlbumPageType";

export function useFormValuesAlbum() {
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversaries, anniversariesQuery } = useInfiniteAnniversariesData(
    coupleData?.couple.id ?? "",
  );
  const forms = useForm<AlbumPageFormValues>({
    defaultValues: {
      anniversaries: [],
      draftFilters: emptyFilters(),
      filters: emptyFilters(),
      sortOrder: "newest",
    },
  });

  useEffect(() => {
    forms.setValue("anniversaries", anniversaries);
  }, [anniversaries, forms]);

  const loading = coupleQuery.isPending
    || Boolean(coupleData && anniversariesQuery.isPending);

  return { anniversariesQuery, coupleData, forms, loading };
}
