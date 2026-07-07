import type {
  Anniversary,
  AnniversaryDraft,
  AnniversaryUpdateInput,
} from "@/types/anniversary";
import type { Couple, CoupleMember, CoupleWithMembers, SetupCoupleInput } from "@/types/couple";
import type { AppUser, ZaloUserProfile } from "@/types/user";
import { mockInviteDb } from "./mockInviteDb";
import { now, readState, uid, writeState } from "./mockDbState";

export const mockDb = {
  upsertUser(profile: ZaloUserProfile): AppUser {
    const state = readState();
    const existing = state.users.find((user) => user.zalo_user_id === profile.id);
    if (existing) {
      const updated = {
        ...existing,
        name: profile.name,
        avatar_url: profile.avatar,
        updated_at: now(),
      };
      state.users = state.users.map((user) => {
        if (user.id === updated.id) return updated;
        return user;
      });
      writeState(state);
      return updated;
    }

    const user: AppUser = {
      id: uid("user"),
      zalo_user_id: profile.id,
      name: profile.name,
      avatar_url: profile.avatar,
      display_name: profile.name,
      created_at: now(),
      updated_at: now(),
    };
    state.users.push(user);
    writeState(state);
    return user;
  },

  updateUserProfile(
    userId: string,
    payload: Pick<AppUser, "display_name" | "custom_avatar_url">,
  ): AppUser {
    const state = readState();
    let updated: AppUser | undefined;
    state.users = state.users.map((user) => {
      if (user.id !== userId) return user;
      updated = { ...user, ...payload, updated_at: now() };
      return updated;
    });
    writeState(state);
    if (!updated) throw new Error("Không tìm thấy user.");
    return updated;
  },

  getCoupleByUser(userId: string): CoupleWithMembers | null {
    const state = readState();
    const membership = state.members.find((member) => member.user_id === userId);
    if (!membership) return null;
    const couple = state.couples.find((item) => item.id === membership.couple_id);
    if (!couple) return null;
    const members = state.members
      .filter((member) => member.couple_id === couple.id)
      .map((member) => ({
        ...member,
        user: state.users.find((user) => user.id === member.user_id),
      }));
    return { couple, members };
  },

  createCouple(user: AppUser, input: SetupCoupleInput): CoupleWithMembers {
    const state = readState();
    const existingCouple = this.getCoupleByUser(user.id);
    if (existingCouple) {
      return existingCouple;
    }

    const updatedUser = {
      ...user,
      display_name: input.displayName,
      custom_avatar_url: input.customAvatarUrl,
      updated_at: now(),
    };
    state.users = state.users.map((item) => {
      if (item.id === user.id) return updatedUser;
      return item;
    });

    const couple: Couple = {
      id: uid("couple"),
      start_date: input.startDate,
      title: "Yêu",
      theme: "pastel",
      background_url: input.backgroundUrl,
      created_by: user.id,
      created_at: now(),
      updated_at: now(),
    };
    const member: CoupleMember = {
      id: uid("member"),
      couple_id: couple.id,
      user_id: user.id,
      role: "owner",
      side: "left",
      joined_at: now(),
      user: updatedUser,
    };
    const anniversaries = input.anniversaries.map((draft) =>
      createAnniversary(couple.id, user.id, draft),
    );
    state.couples.push(couple);
    state.members.push(member);
    state.anniversaries.push(...anniversaries);
    writeState(state);
    return { couple, members: [member] };
  },

  updateCoupleStartDate(coupleId: string, startDate: string): Couple {
    const state = readState();
    const couple = state.couples.find((item) => item.id === coupleId);
    if (!couple) throw new Error("Không tìm thấy Yêu.");
    couple.start_date = startDate;
    couple.updated_at = now();
    writeState(state);
    return couple;
  },

  updateCoupleBackground(coupleId: string, backgroundUrl: string | null): Couple {
    const state = readState();
    const couple = state.couples.find((item) => item.id === coupleId);
    if (!couple) throw new Error("Không tìm thấy Yêu.");
    couple.background_url = backgroundUrl;
    couple.updated_at = now();
    writeState(state);
    return couple;
  },

  leaveCouple(coupleId: string): void {
    const state = readState();
    state.anniversaries = state.anniversaries.filter(
      (item) => item.couple_id !== coupleId,
    );
    state.invites = state.invites.filter((item) => item.couple_id !== coupleId);
    state.members = state.members.filter((item) => item.couple_id !== coupleId);
    state.couples = state.couples.filter((item) => item.id !== coupleId);
    writeState(state);
  },

  getAnniversaries(coupleId: string): Anniversary[] {
    return readState().anniversaries.filter((item) => item.couple_id === coupleId);
  },

  addAnniversary(
    coupleId: string,
    userId: string,
    draft: AnniversaryDraft,
  ): Anniversary {
    const state = readState();
    const anniversary = createAnniversary(coupleId, userId, draft);
    state.anniversaries.push(anniversary);
    writeState(state);
    return anniversary;
  },

  updateAnniversary(
    anniversaryId: string,
    input: AnniversaryUpdateInput,
  ): Anniversary {
    const state = readState();
    let updated: Anniversary | undefined;
    state.anniversaries = state.anniversaries.map((anniversary) => {
      if (anniversary.id !== anniversaryId) return anniversary;

      updated = {
        ...anniversary,
        date: input.date,
        image_url: input.image_url,
        note: input.note,
        repeat_type: input.repeat_type,
        title: input.title,
      };
      return updated;
    });
    writeState(state);
    if (!updated) throw new Error("Không tìm thấy kỷ niệm.");

    return updated;
  },

  createInvite(coupleId: string, invitedBy: string) {
    return mockInviteDb.createInvite(coupleId, invitedBy);
  },

  acceptInvite(inviteCode: string, user: AppUser): CoupleWithMembers {
    return mockInviteDb.acceptInvite(inviteCode, user, (id) => this.getCoupleByUser(id));
  },
};

const createAnniversary = (
  coupleId: string,
  userId: string,
  draft: AnniversaryDraft,
): Anniversary => ({
  id: uid("anni"),
  couple_id: coupleId,
  title: draft.title,
  date: draft.date,
  repeat_type: draft.repeat_type,
  note: draft.note,
  image_url: draft.image_url,
  created_by: userId,
  created_at: now(),
});
