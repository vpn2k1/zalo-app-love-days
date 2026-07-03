import { inviteConfig } from "@/config/invite";
import type { CoupleWithMembers } from "@/types/couple";
import type { PartnerInvite } from "@/types/invite";
import type { AppUser } from "@/types/user";
import { now, readState, uid, writeState } from "./mockDbState";

export const mockInviteDb = {
  createInvite(coupleId: string, invitedBy: string): PartnerInvite {
    const state = readState();
    const members = state.members.filter((member) => member.couple_id === coupleId);
    const hasPartner = members.some(
      (member) => member.role === "partner" || member.side === "right",
    );
    if (hasPartner || members.length >= 2) {
      state.invites = cancelPendingInvites(state.invites, coupleId);
      writeState(state);
      throw new Error("Love Days này đã có đối tác, không thể tạo thêm lời mời.");
    }

    const invite: PartnerInvite = {
      id: uid("invite"),
      couple_id: coupleId,
      invite_code: uid("code").replace("code_", ""),
      invited_by: invitedBy,
      status: "pending",
      expires_at: new Date(
        Date.now() + inviteConfig.expiresInDays * 24 * 60 * 60 * 1000,
      ).toISOString(),
      created_at: now(),
    };
    state.invites.push(invite);
    writeState(state);
    return invite;
  },

  acceptInvite(
    inviteCode: string,
    user: AppUser,
    getCoupleByUser: (userId: string) => CoupleWithMembers | null,
  ): CoupleWithMembers {
    const state = readState();
    const invite = state.invites.find((item) => item.invite_code === inviteCode);
    const existingCouple = getCoupleByUser(user.id);
    if (existingCouple) return acceptExistingCouple(existingCouple, invite);
    validateInvite(invite);

    const roomMembers = state.members.filter((member) => member.couple_id === invite.couple_id);
    const hasPartner = roomMembers.some(
      (member) => member.role === "partner" || member.side === "right",
    );
    if (hasPartner || roomMembers.length >= 2) {
      state.invites = cancelPendingInvites(state.invites, invite.couple_id);
      writeState(state);
      throw new Error("Love Days này đã có người ghép nối. Lời mời không còn hiệu lực.");
    }

    state.members.push({
      id: uid("member"),
      couple_id: invite.couple_id,
      user_id: user.id,
      role: "partner",
      side: "right",
      joined_at: now(),
    });
    invite.status = "accepted";
    invite.accepted_by = user.id;
    invite.accepted_at = now();
    state.invites = cancelOtherPendingInvites(state.invites, invite);
    writeState(state);

    const couple = state.couples.find((item) => item.id === invite.couple_id);
    if (!couple) throw new Error("Không tìm thấy Love Days.");
    const members = state.members
      .filter((member) => member.couple_id === couple.id)
      .map((member) => ({
        ...member,
        user: state.users.find((item) => item.id === member.user_id),
      }));
    return { couple, members };
  },
};

function acceptExistingCouple(
  existingCouple: CoupleWithMembers,
  invite?: PartnerInvite,
) {
  if (invite && existingCouple.couple.id === invite.couple_id) {
    return existingCouple;
  }
  throw new Error("Bạn đã ghép nối trong một Love Days khác.");
}

function validateInvite(invite?: PartnerInvite): asserts invite is PartnerInvite {
  if (!invite) throw new Error("Lời mời không hợp lệ.");
  if (invite.status === "accepted" || invite.status === "cancelled") {
    throw new Error("Lời mời này đã hết hiệu lực vì Love Days đã ghép nối với người khác.");
  }
  if (invite.status !== "pending") throw new Error("Lời mời không hợp lệ.");
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    throw new Error("Lời mời đã hết hạn.");
  }
}

function cancelPendingInvites(invites: PartnerInvite[], coupleId: string) {
  return invites.map((invite) =>
    invite.couple_id === coupleId && invite.status === "pending"
      ? { ...invite, status: "cancelled" as const }
      : invite,
  );
}

function cancelOtherPendingInvites(invites: PartnerInvite[], accepted: PartnerInvite) {
  return invites.map((invite) =>
    invite.couple_id === accepted.couple_id &&
    invite.id !== accepted.id &&
    invite.status === "pending"
      ? { ...invite, status: "cancelled" as const }
      : invite,
  );
}
