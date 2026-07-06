import type { PartnerInvite } from "@/types/invite";

export const inviteConflictMessages = {
  currentUserMatchedOther: "Bạn đã ghép đôi với người khác trước đó.",
  targetMatchedOther: "Đối tác đã ghép đôi với người khác.",
} as const;

export function getInviteErrorMessage(invite?: PartnerInvite | null) {
  if (!invite) return "Lời mời không hợp lệ.";
  if (invite.status === "accepted" || invite.status === "cancelled") {
    return inviteConflictMessages.targetMatchedOther;
  }
  if (invite.status === "expired") return "Lời mời đã hết hạn.";

  return "Lời mời không hợp lệ.";
}

export function isInviteConflictMessage(message: string) {
  if (message === inviteConflictMessages.currentUserMatchedOther) return true;
  if (message === inviteConflictMessages.targetMatchedOther) return true;

  return false;
}
