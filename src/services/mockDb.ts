import type {
  Anniversary,
  AnniversaryDraft,
  AnniversaryUpdateInput,
} from "@/types/anniversary";
import type { Couple, CoupleMember, CoupleWithMembers, SetupCoupleInput } from "@/types/couple";
import type { AppUser, ZaloUserProfile } from "@/types/user";
import { mockInviteDb } from "./mockInviteDb";
import { ensureMockAnniversaryFixtures } from "./mockAnniversaryFixtures";
import { now, readState, uid, writeState } from "./mockDbState";
import {
  createStartDateAnniversaryDraft,
  isStartDateAnniversary,
  isStartDateAnniversaryDraft,
  START_DATE_ANNIVERSARY_NOTE,
} from "./startDateAnniversary";

export const mockDb = {
  findUserByZaloId(zaloUserId: string): AppUser | null {
    const state = readState();
    return state.users.find((user) => user.zalo_user_id === zaloUserId) ?? null;
  },

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

  deleteUser(userId: string): void {
    const state = readState();
    state.users = state.users.filter((user) => user.id !== userId);
    writeState(state);
  },

  getCoupleByUser(userId: string): CoupleWithMembers | null {
    const state = readState();
    const membership = state.members.find((member) => member.user_id === userId);
    if (!membership) return null;
    const couple = state.couples.find((item) => item.id === membership.couple_id);
    if (!couple) return null;
    syncStartDateAnniversary(state.anniversaries, couple);
    ensureMockAnniversaryFixtures(state, couple);
    writeState(state);
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
      title: "Nhật ký tình yêu",
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
    const anniversaries = [
      createStartDateAnniversaryDraft(input.startDate),
      ...input.anniversaries.filter((draft) => {
        return !isStartDateAnniversaryDraft(draft);
      }),
    ].map((draft) =>
      createAnniversary(couple.id, user.id, draft),
    );
    state.couples.push(couple);
    state.members.push(member);
    state.anniversaries.push(...anniversaries);
    ensureMockAnniversaryFixtures(state, couple);
    writeState(state);
    return { couple, members: [member] };
  },

  updateCoupleStartDate(coupleId: string, startDate: string): Couple {
    const state = readState();
    const couple = state.couples.find((item) => item.id === coupleId);
    if (!couple) throw new Error("Không tìm thấy Nhật ký tình yêu.");
    couple.start_date = startDate;
    couple.updated_at = now();
    syncStartDateAnniversary(state.anniversaries, couple);
    writeState(state);
    return couple;
  },

  updateCoupleBackground(coupleId: string, backgroundUrl: string | null): Couple {
    const state = readState();
    const couple = state.couples.find((item) => item.id === coupleId);
    if (!couple) throw new Error("Không tìm thấy Nhật ký tình yêu.");
    couple.background_url = backgroundUrl;
    couple.updated_at = now();
    writeState(state);
    return couple;
  },

  updateCouple(
    coupleId: string,
    payload: { startDate?: string; backgroundUrl?: string | null },
  ): Couple {
    const state = readState();
    const couple = state.couples.find((item) => item.id === coupleId);
    if (!couple) throw new Error("Không tìm thấy Nhật ký tình yêu.");

    if (payload.startDate !== undefined) {
      couple.start_date = payload.startDate;
      syncStartDateAnniversary(state.anniversaries, couple);
    }
    if (payload.backgroundUrl !== undefined) {
      couple.background_url = payload.backgroundUrl;
    }
    couple.updated_at = now();
    writeState(state);
    return couple;
  },


  removeMember(coupleId: string, userId: string): void {
    const state = readState();
    state.members = state.members.filter(
      (item) => !(item.couple_id === coupleId && item.user_id === userId),
    );
    writeState(state);
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
    const state = readState();
    const couple = state.couples.find((item) => item.id === coupleId);
    if (couple && ensureMockAnniversaryFixtures(state, couple)) {
      writeState(state);
    }

    return state.anniversaries.filter((item) => item.couple_id === coupleId);
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
        image_url: getDraftImageUrls(input)[0],
        image_urls: getDraftImageUrls(input),
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
  image_url: getDraftImageUrls(draft)[0],
  image_urls: getDraftImageUrls(draft),
  created_by: userId,
  created_at: now(),
});

function getDraftImageUrls(draft: AnniversaryDraft) {
  if (draft.image_urls && draft.image_urls.length > 0) return draft.image_urls;
  if (!draft.image_url) return [];

  return [draft.image_url];
}

function syncStartDateAnniversary(
  anniversaries: Anniversary[],
  couple: Couple,
) {
  const existing = anniversaries.find((item) => {
    return isStartDateAnniversary(item, couple.id);
  });

  if (existing) {
    existing.date = couple.start_date;
    existing.repeat_type = "yearly";
    existing.note = existing.note || START_DATE_ANNIVERSARY_NOTE;
    return;
  }

  anniversaries.push(
    createAnniversary(
      couple.id,
      couple.created_by,
      createStartDateAnniversaryDraft(couple.start_date),
    ),
  );
}
