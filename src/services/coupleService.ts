import { mockDb } from "@/services/mockDb";
import { isMockMode, supabase } from "@/services/supabaseClient";
import type { Anniversary } from "@/types/anniversary";
import type { Couple, CoupleMember, CoupleWithMembers, SetupCoupleInput } from "@/types/couple";
import type { AppUser } from "@/types/user";

const getSupabaseCoupleByUser = async (
  userId: string,
): Promise<CoupleWithMembers | null> => {
  if (!supabase) return null;

  const { data: memberships, error } = await supabase
    .from("couple_members")
    .select("*, couple:couples(*), user:users(*)")
    .eq("user_id", userId)
    .limit(1);

  if (error) throw error;
  const first = memberships?.[0] as
    | (CoupleMember & { couple: Couple })
    | undefined;
  if (!first) return null;

  const { data: members, error: membersError } = await supabase
    .from("couple_members")
    .select("*, user:users(*)")
    .eq("couple_id", first.couple_id)
    .order("side", { ascending: true });

  if (membersError) throw membersError;
  return { couple: first.couple, members: (members ?? []) as CoupleMember[] };
};

export const coupleService = {
  async getCoupleByUser(userId: string): Promise<CoupleWithMembers | null> {
    if (isMockMode || !supabase) {
      return mockDb.getCoupleByUser(userId);
    }

    return getSupabaseCoupleByUser(userId);
  },

  async createCouple(
    user: AppUser,
    input: SetupCoupleInput,
  ): Promise<CoupleWithMembers> {
    if (isMockMode || !supabase) {
      return mockDb.createCouple(user, input);
    }

    const existingCouple = await getSupabaseCoupleByUser(user.id);
    if (existingCouple) {
      return existingCouple;
    }

    const { error: userError } = await supabase
      .from("users")
      .update({ display_name: input.displayName, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (userError) throw userError;

    const { data: couple, error: coupleError } = await supabase
      .from("couples")
      .insert({
        start_date: input.startDate,
        title: "Love Days",
        theme: "pastel",
        created_by: user.id,
      })
      .select("*")
      .single();
    if (coupleError) throw coupleError;

    const { data: member, error: memberError } = await supabase
      .from("couple_members")
      .insert({
        couple_id: couple.id,
        user_id: user.id,
        role: "owner",
        side: "left",
      })
      .select("*, user:users(*)")
      .single();
    if (memberError) throw memberError;

    if (input.anniversaries.length > 0) {
      const { error: anniversaryError } = await supabase
        .from("anniversaries")
        .insert(
          input.anniversaries.map((item) => ({
            couple_id: couple.id,
            title: item.title,
            date: item.date,
            repeat_type: item.repeat_type,
            note: item.note,
            created_by: user.id,
          })),
        );
      if (anniversaryError) throw anniversaryError;
    }

    return { couple, members: [member as CoupleMember] };
  },

  async updateCoupleStartDate(coupleId: string, startDate: string): Promise<Couple> {
    if (isMockMode || !supabase) {
      return mockDb.updateCoupleStartDate(coupleId, startDate);
    }

    const { data, error } = await supabase
      .from("couples")
      .update({ start_date: startDate, updated_at: new Date().toISOString() })
      .eq("id", coupleId)
      .select("*")
      .single();

    if (error) throw error;
    return data as Couple;
  },

  async getAnniversaries(coupleId: string): Promise<Anniversary[]> {
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
};
