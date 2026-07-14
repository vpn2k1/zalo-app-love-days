import { mockDb } from "@/services/mockDb";
import { isMockMode, supabase } from "@/services/supabaseClient";
import { inviteConfig } from "@/config/invite";
import { buildInvitePath, buildInviteUrl } from "@/utils/invite";
import { coupleService } from "@/services/coupleService";
import { getInviteErrorMessage, inviteConflictMessages } from "@/services/inviteErrors";
import { zaloService } from "@/services/zaloService";
import type { Couple, CoupleMember, CoupleWithMembers } from "@/types/couple";
import type { PartnerInvite } from "@/types/invite";
import type { AppUser } from "@/types/user";

const getCoupleMembers = async (coupleId: string): Promise<CoupleMember[]> => {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("couple_members")
    .select("*, user:users(*)")
    .eq("couple_id", coupleId)
    .order("side", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CoupleMember[];
};
const getCoupleWithMembers = async (coupleId: string): Promise<CoupleWithMembers> => {
  if (!supabase) throw new Error("Supabase chưa được cấu hình.");

  const { data: couple, error: coupleError } = await supabase
    .from("couples")
    .select("*")
    .eq("id", coupleId)
    .single();
  if (coupleError) throw coupleError;

  return {
    couple: couple as Couple,
    members: await getCoupleMembers(coupleId),
  };
};

const cancelPendingInvitesForCouple = async (
  coupleId: string,
  exceptInviteId?: string,
) => {
  if (!supabase) return;

  let query = supabase
    .from("partner_invites")
    .update({ status: "cancelled" })
    .eq("couple_id", coupleId)
    .eq("status", "pending");

  if (exceptInviteId) {
    query = query.neq("id", exceptInviteId);
  }

  const { error } = await query;
  if (error) throw error;
};

const ensureCoupleCanInvite = async (coupleId: string) => {
  const members = await getCoupleMembers(coupleId);
  const hasPartner = members.some((member) => member.role === "partner" || member.side === "right");
  if (hasPartner || members.length >= 2) {
    await cancelPendingInvitesForCouple(coupleId);
    throw new Error("Nhật Ký Yêu này đã có đối tác, không thể tạo thêm lời mời.");
  }
};

export const inviteService = {
  async createInvite(coupleId: string, invitedBy: string): Promise<PartnerInvite> {
    if (isMockMode || !supabase) {
      return mockDb.createInvite(coupleId, invitedBy);
    }

    await ensureCoupleCanInvite(coupleId);

    const { data: existingInvite, error: existingInviteError } = await supabase
      .from("partner_invites")
      .select("*")
      .eq("couple_id", coupleId)
      .eq("status", "pending")
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existingInviteError) throw existingInviteError;
    if (existingInvite) return existingInvite as PartnerInvite;

    const inviteCode = crypto.randomUUID().split("-").join("").slice(0, 12);
    const { data, error } = await supabase
      .from("partner_invites")
      .insert({
        couple_id: coupleId,
        invite_code: inviteCode,
        invited_by: invitedBy,
        status: "pending",
        expires_at: new Date(
          Date.now() + inviteConfig.expiresInDays * 24 * 60 * 60 * 1000,
        ).toISOString(),
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async shareInvite(
    inviteCode: string,
    thumbnailOverride?: string,
  ): Promise<{ inviteUrl: string; fallbackUsed: boolean }> {
    const inviteUrl = buildInviteUrl(inviteCode);
    try {
      await zaloService.shareInvite({
        ...inviteConfig,
        thumbnail: thumbnailOverride || inviteConfig.thumbnail,
        path: buildInvitePath(inviteCode),
      });
      return { inviteUrl, fallbackUsed: false };
    } catch (error) {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(inviteUrl);
          return { inviteUrl, fallbackUsed: true };
        } catch (clipboardError) {
          console.error(clipboardError);
        }
      }
      throw error;
    }
  },

  async acceptInvite(inviteCode: string, user: AppUser): Promise<CoupleWithMembers> {
    if (isMockMode || !supabase) {
      return mockDb.acceptInvite(inviteCode, user);
    }

    const { data: invite, error: inviteError } = await supabase
      .from("partner_invites")
      .select("*")
      .eq("invite_code", inviteCode)
      .maybeSingle();
    if (inviteError) throw inviteError;
    if (!invite || invite.status !== "pending") {
      throw new Error(getInviteErrorMessage(invite as PartnerInvite | null));
    }

    if (new Date(invite.expires_at).getTime() < Date.now()) {
      await supabase
        .from("partner_invites")
        .update({ status: "expired" })
        .eq("id", invite.id);
      throw new Error("Lời mời đã hết hạn.");
    }

    const existingCouple = await coupleService.getCoupleByUser(user.id);
    if (existingCouple && existingCouple.couple.id === invite.couple_id) {
      return existingCouple;
    }
    const members = await getCoupleMembers(invite.couple_id);
    const hasPartner = members.some((member) => member.role === "partner" || member.side === "right");
    if (hasPartner || members.length >= 2) {
      await cancelPendingInvitesForCouple(invite.couple_id);
      throw new Error(inviteConflictMessages.targetMatchedOther);
    }
    if (existingCouple && existingCouple.members.length >= 2) {
      throw new Error(inviteConflictMessages.currentUserMatchedOther);
    }
    if (existingCouple) {
      await coupleService.leaveCouple(existingCouple.couple.id);
    }
    const { error: memberError } = await supabase
      .from("couple_members")
      .insert({
        couple_id: invite.couple_id,
        user_id: user.id,
        role: "partner",
        side: "right",
      });
    if (memberError) {
      await cancelPendingInvitesForCouple(invite.couple_id);
      throw new Error(inviteConflictMessages.targetMatchedOther);
    }

    const { error: acceptError } = await supabase
      .from("partner_invites")
      .update({
        status: "accepted",
        accepted_by: user.id,
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invite.id);
    if (acceptError) throw acceptError;

    await cancelPendingInvitesForCouple(invite.couple_id, invite.id);

    return getCoupleWithMembers(invite.couple_id);
  },
};
