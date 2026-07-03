import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import { inviteConfig } from "@/config/invite";
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
    const existingCouple = this.getCoupleByUser(user.id);
    if (existingCouple) {
      return existingCouple;
    }

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

  updateCoupleStartDate(coupleId: string, startDate: string): Couple {
    const state = readState();
    const couple = state.couples.find((item) => item.id === coupleId);
    if (!couple) throw new Error("Không tìm thấy Love Days.");
    couple.start_date = startDate;
    couple.updated_at = now();
    writeState(state);
    return couple;
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
    const members = state.members.filter((member) => member.couple_id === coupleId);
    const hasPartner = members.some(
      (member) => member.role === "partner" || member.side === "right",
    );
    if (hasPartner || members.length >= 2) {
      state.invites = state.invites.map((invite) =>
        invite.couple_id === coupleId && invite.status === "pending"
          ? { ...invite, status: "cancelled" }
          : invite,
      );
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

  acceptInvite(inviteCode: string, user: AppUser): CoupleWithMembers {
    const state = readState();
    const invite = state.invites.find((item) => item.invite_code === inviteCode);
    const existingCouple = this.getCoupleByUser(user.id);
    if (existingCouple) {
      if (invite && existingCouple.couple.id === invite.couple_id) {
        return existingCouple;
      }
      throw new Error("Bạn đã ghép nối trong một Love Days khác.");
    }

    if (!invite) {
      throw new Error("Lời mời không hợp lệ.");
    }
    if (invite.status === "accepted" || invite.status === "cancelled") {
      throw new Error("Lời mời này đã hết hiệu lực vì Love Days đã ghép nối với người khác.");
    }
    if (invite.status !== "pending") {
      throw new Error("Lời mời không hợp lệ.");
    }
    if (new Date(invite.expires_at).getTime() < Date.now()) {
      invite.status = "expired";
      writeState(state);
      throw new Error("Lời mời đã hết hạn.");
    }

    const roomMembers = state.members.filter((member) => member.couple_id === invite.couple_id);
    const hasPartner = roomMembers.some(
      (member) => member.role === "partner" || member.side === "right",
    );
    if (hasPartner || roomMembers.length >= 2) {
      state.invites = state.invites.map((item) =>
        item.couple_id === invite.couple_id && item.status === "pending"
          ? { ...item, status: "cancelled" }
          : item,
      );
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
    state.invites = state.invites.map((item) =>
      item.couple_id === invite.couple_id &&
      item.id !== invite.id &&
      item.status === "pending"
        ? { ...item, status: "cancelled" }
        : item,
    );
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
