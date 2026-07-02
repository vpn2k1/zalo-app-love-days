import { mockDb } from "@/services/mockDb";
import { isMockMode, supabase } from "@/services/supabaseClient";
import { buildInvitePath } from "@/utils/invite";
import { zaloService } from "@/services/zaloService";
import type { Couple, CoupleMember, CoupleWithMembers } from "@/types/couple";
import type { PartnerInvite } from "@/types/invite";
import type { AppUser } from "@/types/user";

export const inviteService = {
  async createInvite(coupleId: string, invitedBy: string): Promise<PartnerInvite> {
    if (isMockMode || !supabase) {
      return mockDb.createInvite(coupleId, invitedBy);
    }

    const inviteCode = crypto.randomUUID().split("-").join("").slice(0, 12);
    const { data, error } = await supabase
      .from("partner_invites")
      .insert({
        couple_id: coupleId,
        invite_code: inviteCode,
        invited_by: invitedBy,
        status: "pending",
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async shareInvite(inviteCode: string) {
    await zaloService.shareInvite(
      "Tham gia Love Days cùng mình nhé ❤️",
      buildInvitePath(inviteCode),
    );
  },

  async acceptInvite(inviteCode: string, user: AppUser): Promise<CoupleWithMembers> {
    if (isMockMode || !supabase) {
      return mockDb.acceptInvite(inviteCode, user);
    }

    const { data: invite, error: inviteError } = await supabase
      .from("partner_invites")
      .select("*")
      .eq("invite_code", inviteCode)
      .eq("status", "pending")
      .single();
    if (inviteError || !invite) {
      throw inviteError ?? new Error("Lời mời không hợp lệ.");
    }

    if (new Date(invite.expires_at).getTime() < Date.now()) {
      await supabase
        .from("partner_invites")
        .update({ status: "expired" })
        .eq("id", invite.id);
      throw new Error("Lời mời đã hết hạn.");
    }

    const { error: memberError } = await supabase
      .from("couple_members")
      .upsert(
        {
          couple_id: invite.couple_id,
          user_id: user.id,
          role: "partner",
          side: "right",
        },
        { onConflict: "couple_id,user_id" },
      );
    if (memberError) throw memberError;

    const { error: acceptError } = await supabase
      .from("partner_invites")
      .update({
        status: "accepted",
        accepted_by: user.id,
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invite.id);
    if (acceptError) throw acceptError;

    const { data: couple, error: coupleError } = await supabase
      .from("couples")
      .select("*")
      .eq("id", invite.couple_id)
      .single();
    if (coupleError) throw coupleError;

    const { data: members, error: membersError } = await supabase
      .from("couple_members")
      .select("*, user:users(*)")
      .eq("couple_id", invite.couple_id)
      .order("side", { ascending: true });
    if (membersError) throw membersError;

    return {
      couple: couple as Couple,
      members: (members ?? []) as CoupleMember[],
    };
  },
};
