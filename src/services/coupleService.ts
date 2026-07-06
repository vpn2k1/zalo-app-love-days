import { mockDb } from "@/services/mockDb";
import { isMockMode, supabase } from "@/services/supabaseClient";
import { mediaService } from "@/services/mediaService";
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
    const { data: couple, error: coupleError } = await supabase
      .from("couples")
      .insert({
        start_date: input.startDate,
        title: "Yêu",
        theme: "pastel",
        created_by: user.id,
      })
      .select("*")
      .single();
    if (coupleError) throw coupleError;

    let savedCouple = couple as Couple;
    const backgroundUrl = await mediaService.uploadImagePath({
      coupleId: savedCouple.id, fileName: "background", path: input.backgroundUrl, scope: "backgrounds",
    });
    if (backgroundUrl) {
      const { data: updatedCouple, error: backgroundError } = await supabase
        .from("couples")
        .update({ background_url: backgroundUrl, updated_at: new Date().toISOString() })
        .eq("id", savedCouple.id)
        .select("*")
        .single();
      if (backgroundError) throw backgroundError;
      savedCouple = updatedCouple as Couple;
    }
    const customAvatarUrl = await mediaService.uploadImagePath({
      coupleId: couple.id,
      fileName: `avatar-${user.id}`,
      path: input.customAvatarUrl,
      scope: "avatars",
    });
    const { data: updatedUser, error: userError } = await supabase
      .from("users")
      .update({
        display_name: input.displayName,
        custom_avatar_url: customAvatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("*")
      .single();
    if (userError) throw userError;

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
      const anniversaries = await Promise.all(
        input.anniversaries.map(async (item, index) => ({
          couple_id: couple.id,
          title: item.title,
          date: item.date,
          repeat_type: item.repeat_type,
          note: item.note,
          image_url: await mediaService.uploadImagePath({
            coupleId: couple.id,
            fileName: `anniversary-${index + 1}-${item.title}`,
            path: item.image_url,
            scope: "anniversaries",
          }),
          created_by: user.id,
        })),
      );
      const { error: anniversaryError } = await supabase
        .from("anniversaries")
        .insert(anniversaries);
      if (anniversaryError) throw anniversaryError;
    }

    return { couple: savedCouple, members: [{ ...(member as CoupleMember), user: updatedUser }] };
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

  async leaveCouple(coupleId: string): Promise<void> {
    if (isMockMode || !supabase) {
      mockDb.leaveCouple(coupleId);
      return;
    }

    const { error: inviteError } = await supabase
      .from("partner_invites")
      .delete()
      .eq("couple_id", coupleId);
    if (inviteError) throw inviteError;

    const { error: anniversaryError } = await supabase
      .from("anniversaries")
      .delete()
      .eq("couple_id", coupleId);
    if (anniversaryError) throw anniversaryError;

    const { error: memberError } = await supabase
      .from("couple_members")
      .delete()
      .eq("couple_id", coupleId);
    if (memberError) throw memberError;

    const { error: coupleError } = await supabase
      .from("couples")
      .delete()
      .eq("id", coupleId);
    if (coupleError) throw coupleError;
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
