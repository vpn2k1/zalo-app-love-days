import { mockDb } from "@/services/mockDb";
import { isMockMode, supabase } from "@/services/supabaseClient";
import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";

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

    const { data, error } = await supabase
      .from("anniversaries")
      .insert({
        couple_id: coupleId,
        title: draft.title,
        date: draft.date,
        repeat_type: draft.repeat_type,
        note: draft.note,
        created_by: userId,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },
};
