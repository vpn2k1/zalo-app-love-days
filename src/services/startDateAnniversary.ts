import { supabase } from "@/services/supabaseClient";
import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import type { Couple } from "@/types/couple";

export const START_DATE_ANNIVERSARY_TITLE = "Ngày bắt đầu yêu";
export const START_DATE_ANNIVERSARY_NOTE = "Cột mốc đầu tiên của hai bạn";

export function createStartDateAnniversaryDraft(date: string): AnniversaryDraft {
  return {
    title: START_DATE_ANNIVERSARY_TITLE,
    date,
    repeat_type: "yearly",
    note: START_DATE_ANNIVERSARY_NOTE,
    image_url: "",
  };
}

export function isStartDateAnniversary(memory: Anniversary, coupleId: string) {
  if (memory.couple_id !== coupleId) return false;

  return memory.title === START_DATE_ANNIVERSARY_TITLE;
}

export function isStartDateAnniversaryDraft(memory: AnniversaryDraft) {
  return memory.title === START_DATE_ANNIVERSARY_TITLE;
}

export async function syncSupabaseStartDateAnniversary(couple: Couple) {
  if (!supabase) return;

  const { data: existing, error: findError } = await supabase
    .from("anniversaries")
    .select("id,date,repeat_type,note")
    .eq("couple_id", couple.id)
    .eq("title", START_DATE_ANNIVERSARY_TITLE)
    .maybeSingle();

  if (findError) throw findError;

  if (existing?.id) {
    if (isSyncedStartDateAnniversary(existing, couple.start_date)) return;

    const { error } = await supabase
      .from("anniversaries")
      .update({
        date: couple.start_date,
        repeat_type: "yearly",
        note: START_DATE_ANNIVERSARY_NOTE,
      })
      .eq("id", existing.id)
      .eq("couple_id", couple.id);

    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("anniversaries").insert({
    couple_id: couple.id,
    title: START_DATE_ANNIVERSARY_TITLE,
    date: couple.start_date,
    repeat_type: "yearly",
    note: START_DATE_ANNIVERSARY_NOTE,
    image_url: "",
    created_by: couple.created_by,
  });

  if (error) throw error;
}

function isSyncedStartDateAnniversary(
  memory: Pick<Anniversary, "date" | "note" | "repeat_type">,
  startDate: string,
) {
  if (memory.date !== startDate) return false;
  if (memory.repeat_type !== "yearly") return false;
  if (memory.note !== START_DATE_ANNIVERSARY_NOTE) return false;

  return true;
}
