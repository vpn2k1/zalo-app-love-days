import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCoupleData } from "@/hooks/useCoupleData";
import { useInfiniteAnniversariesData } from "@/hooks/useInfiniteAnniversariesData";

import type { AnniversariesPageFormValues } from "../types/AnniversariesPageType";

export function useFormValuesAnniversaries() {
  const { coupleData, coupleQuery } = useCoupleData();
  const { anniversaries, anniversariesQuery } = useInfiniteAnniversariesData(
    coupleData?.couple.id ?? "",
  );
  const forms = useForm<AnniversariesPageFormValues>({
    defaultValues: {
      anniversaries: [],
      filter: "all",
      query: "",
    },
  });

  useEffect(() => {
    forms.setValue("anniversaries", anniversaries);
  }, [anniversaries, forms]);

  const loading = coupleQuery.isPending
    || Boolean(coupleData && anniversariesQuery.isPending);

  return { anniversariesQuery, coupleData, forms, loading };
}
