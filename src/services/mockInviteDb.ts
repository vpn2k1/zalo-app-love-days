import { inviteConfig } from "@/config/invite";
import {
  getInviteErrorMessage,
  inviteConflictMessages,
} from "@/services/inviteErrors";
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
      throw new Error("Yêu này đã có đối tác, không thể tạo thêm lời mời.");
    }

    const pendingInvite = state.invites.find((invite) => {
      if (invite.couple_id !== coupleId) return false;
      if (invite.status !== "pending") return false;

      return new Date(invite.expires_at).getTime() >= Date.now();
    });
    if (pendingInvite) return pendingInvite;

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
    validateInvite(invite);

    const existingCouple = getCoupleByUser(user.id);
    if (existingCouple?.couple.id === invite.couple_id) return existingCouple;

    const roomMembers = state.members.filter((member) => member.couple_id === invite.couple_id);
    const hasPartner = roomMembers.some(
      (member) => member.role === "partner" || member.side === "right",
    );
    if (hasPartner || roomMembers.length >= 2) {
      state.invites = cancelPendingInvites(state.invites, invite.couple_id);
      writeState(state);
      throw new Error(inviteConflictMessages.targetMatchedOther);
    }

    if (existingCouple) {
      removeSingleMemberCouple(state, existingCouple);
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
    if (!couple) throw new Error("Không tìm thấy Yêu.");
    const members = state.members
      .filter((member) => member.couple_id === couple.id)
      .map((member) => ({
        ...member,
        user: state.users.find((item) => item.id === member.user_id),
      }));
    return { couple, members };
  },
};

function removeSingleMemberCouple(
  state: ReturnType<typeof readState>,
  existingCouple: CoupleWithMembers,
) {
  if (existingCouple.members.length >= 2) {
    throw new Error(inviteConflictMessages.currentUserMatchedOther);
  }

  const coupleId = existingCouple.couple.id;
  state.anniversaries = state.anniversaries.filter((item) => item.couple_id !== coupleId);
  state.invites = state.invites.filter((item) => item.couple_id !== coupleId);
  state.members = state.members.filter((item) => item.couple_id !== coupleId);
  state.couples = state.couples.filter((item) => item.id !== coupleId);
}

function validateInvite(invite?: PartnerInvite): asserts invite is PartnerInvite {
  if (!invite || invite.status !== "pending") {
    throw new Error(getInviteErrorMessage(invite));
  }
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    throw new Error("Lời mời đã hết hạn.");
  }
}

function cancelPendingInvites(invites: PartnerInvite[], coupleId: string) {
  return invites.map((invite) => {
    if (invite.couple_id === coupleId && invite.status === "pending") {
      return { ...invite, status: "cancelled" as const };
    }
    return invite;
  });
}

function cancelOtherPendingInvites(invites: PartnerInvite[], accepted: PartnerInvite) {
  return invites.map((invite) => {
    const sameCouple = invite.couple_id === accepted.couple_id;
    const isDifferentInvite = invite.id !== accepted.id;
    if (sameCouple && isDifferentInvite && invite.status === "pending") {
      return { ...invite, status: "cancelled" as const };
    }
    return invite;
  });
}
