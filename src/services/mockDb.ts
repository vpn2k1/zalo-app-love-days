import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import type { Couple, CoupleMember, CoupleWithMembers, SetupCoupleInput } from "@/types/couple";
import type { PartnerInvite } from "@/types/invite";
import type { AppUser, ZaloUserProfile } from "@/types/user";

type MockState = {
  users: AppUser[];
  couples: Couple[];
  members: CoupleMember[];
  anniversaries: Anniversary[];
  invites: PartnerInvite[];
};

const STORAGE_KEY = "love-days.mock-db";

const now = () => new Date().toISOString();

const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

const emptyState = (): MockState => ({
  users: [],
  couples: [],
  members: [],
  anniversaries: [],
  invites: [],
});

const readState = (): MockState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockState) : emptyState();
  } catch {
    return emptyState();
  }
};

const writeState = (state: MockState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

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
      state.users = state.users.map((user) =>
        user.id === updated.id ? updated : user,
      );
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
    const updatedUser = { ...user, display_name: input.displayName, updated_at: now() };
    state.users = state.users.map((item) =>
      item.id === user.id ? updatedUser : item,
    );

    const couple: Couple = {
      id: uid("couple"),
      start_date: input.startDate,
      title: "Love Days",
      theme: "pastel",
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

  createInvite(coupleId: string, invitedBy: string): PartnerInvite {
    const state = readState();
    const invite: PartnerInvite = {
      id: uid("invite"),
      couple_id: coupleId,
      invite_code: uid("code").replace("code_", ""),
      invited_by: invitedBy,
      status: "pending",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: now(),
    };
    state.invites.push(invite);
    writeState(state);
    return invite;
  },

  acceptInvite(inviteCode: string, user: AppUser): CoupleWithMembers {
    const state = readState();
    const invite = state.invites.find((item) => item.invite_code === inviteCode);
    if (!invite || invite.status !== "pending") {
      throw new Error("Lời mời không hợp lệ hoặc đã hết hiệu lực.");
    }
    if (new Date(invite.expires_at).getTime() < Date.now()) {
      invite.status = "expired";
      writeState(state);
      throw new Error("Lời mời đã hết hạn.");
    }

    const existing = state.members.find(
      (member) => member.couple_id === invite.couple_id && member.user_id === user.id,
    );
    if (!existing) {
      state.members.push({
        id: uid("member"),
        couple_id: invite.couple_id,
        user_id: user.id,
        role: "partner",
        side: "right",
        joined_at: now(),
      });
    }

    invite.status = "accepted";
    invite.accepted_by = user.id;
    invite.accepted_at = now();
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
  created_by: userId,
  created_at: now(),
});
