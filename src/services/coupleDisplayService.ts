import { mockDb } from "@/services/mockDb";
import { isMockMode, supabase } from "@/services/supabaseClient";
import type { Couple } from "@/types/couple";

export const coupleDisplayService = {
  async updateBackground(
    coupleId: string,
    backgroundUrl: string | null,
  ): Promise<Couple> {
    if (isMockMode || !supabase) {
      return mockDb.updateCoupleBackground(coupleId, backgroundUrl);
    }

    const { data, error } = await supabase
      .from("couples")
      .update({
        background_url: backgroundUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", coupleId)
      .select("*")
      .single();

    if (error) throw error;
    return data as Couple;
  },
};
