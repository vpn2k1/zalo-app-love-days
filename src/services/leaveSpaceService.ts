import {
  deleteAnniversaries,
  deleteCouple,
  deleteInvites,
  deleteMembers,
  deleteUser,
  reassignPairedData,
  removeMember,
} from "@/services/leaveSpaceCleanup";
import { mediaService } from "@/services/mediaService";
import type { CoupleMember, CoupleWithMembers } from "@/types/couple";
import type { AppUser } from "@/types/user";

type LeaveSpaceInput = {
  coupleData: CoupleWithMembers;
  user: AppUser;
};

export const leaveSpaceService = {
  async leave({ coupleData, user }: LeaveSpaceInput): Promise<void> {
    if (coupleData.members.length <= 1) {
      await leaveSolo(coupleData, user);
      return;
    }

    await leavePaired(coupleData, user);
  },
};

async function leavePaired(coupleData: CoupleWithMembers, user: AppUser) {
  const remainingMember = getRemainingMember(coupleData.members, user.id);
  await reassignPairedData(coupleData.couple.id, user.id, remainingMember.user_id);
  await mediaService.removeUserAvatar(coupleData.couple.id, user.id);
  await removeMember(coupleData.couple.id, user.id);
  await deleteUser(user);
}

async function leaveSolo(coupleData: CoupleWithMembers, user: AppUser) {
  await mediaService.removeCoupleMedia(coupleData.couple.id);
  await deleteAnniversaries(coupleData.couple.id);
  await deleteInvites(coupleData.couple.id);
  await deleteMembers(coupleData.couple.id);
  await deleteCouple(coupleData.couple.id);
  await deleteUser(user);
}

function getRemainingMember(members: CoupleMember[], userId: string) {
  const remainingMember = members.find((member) => member.user_id !== userId);
  if (!remainingMember) throw new Error("Không tìm thấy người còn lại.");

  return remainingMember;
}
