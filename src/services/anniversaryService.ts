import { mockDb } from "@/services/mockDb";
import { isMockMode, supabase } from "@/services/supabaseClient";
import { mediaService } from "@/services/mediaService";
import type {
  Anniversary,
  AnniversaryDraft,
  AnniversaryUpdateInput,
} from "@/types/anniversary";

export const anniversaryService = {
  async list(coupleId: string): Promise<Anniversary[]> {
    if (isMockMode || !supabase) {
      return mockDb.getAnniversaries(coupleId);
    }

    const { data, error } = await supabase
      .from("anniversaries")
      .select("*")
      .eq("couple_id", coupleId)
      .order("date", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(
    coupleId: string,
    userId: string,
    draft: AnniversaryDraft,
  ): Promise<Anniversary> {
    if (isMockMode || !supabase) {
      return mockDb.addAnniversary(coupleId, userId, draft);
    }

    const imageUrl = await mediaService.uploadImagePath({
      coupleId,
      fileName: `anniversary-${Date.now()}-${draft.title}`,
      path: draft.image_url,
      scope: "anniversaries",
    });
    const { data, error } = await supabase
      .from("anniversaries")
      .insert({
        couple_id: coupleId,
        title: draft.title,
        date: draft.date,
        repeat_type: draft.repeat_type,
        note: draft.note,
        image_url: imageUrl,
        created_by: userId,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async update(
    coupleId: string,
    anniversaryId: string,
    input: AnniversaryUpdateInput,
  ): Promise<Anniversary> {
    if (isMockMode || !supabase) {
      return mockDb.updateAnniversary(anniversaryId, input);
    }

    const imageUrl = await mediaService.uploadImagePath({
      coupleId,
      fileName: `anniversary-${anniversaryId}`,
      path: input.image_url,
      scope: "anniversaries",
    });
    const { data, error } = await supabase
      .from("anniversaries")
      .update({
        date: input.date,
        image_url: imageUrl,
        note: input.note,
        repeat_type: input.repeat_type,
        title: input.title,
      })
      .eq("id", anniversaryId)
      .eq("couple_id", coupleId)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async findOne(coupleId: string, date: Date) {
    if (isMockMode || !supabase) {
      return mockDb
        .getAnniversaries(coupleId)
        .find((item) => item.date === date.toISOString());
    }

    const { data, error } = await supabase
      .from("anniversaries")
      .select("*")
      .eq("couple_id", coupleId)
      .eq("date", toLocalDateString(date))
      .single();

    if (error) throw error;
    return data;
  },
};

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
