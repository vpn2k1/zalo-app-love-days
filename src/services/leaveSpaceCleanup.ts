import { now, readState, writeState } from "@/services/mockDbState";
import { isMockMode, supabase } from "@/services/supabaseClient";
import type { AppUser } from "@/types/user";

export async function reassignPairedData(coupleId: string, fromUserId: string, toUserId: string) {
  if (isMockMode || !supabase) {
    reassignMockPairedData(coupleId, fromUserId, toUserId);
    return;
  }

  const timestamp = new Date().toISOString();
  await updateCoupleOwner(coupleId, fromUserId, toUserId, timestamp);
  await updateRemainingMember(coupleId, toUserId);
  await updateAnniversaryCreator(coupleId, fromUserId, toUserId);
  await updateInviteOwner(coupleId, fromUserId, toUserId);
}

export async function removeMember(coupleId: string, userId: string) {
  if (isMockMode || !supabase) {
    const state = readState();
    state.members = state.members.filter((member) => {
      if (member.couple_id !== coupleId) return true;

      return member.user_id !== userId;
    });
    writeState(state);
    return;
  }

  const { error } = await supabase
    .from("couple_members")
    .delete()
    .eq("couple_id", coupleId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteUser(user: AppUser) {
  if (isMockMode || !supabase) {
    const state = readState();
    state.users = state.users.filter((item) => item.id !== user.id);
    writeState(state);
    return;
  }

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("zalo_user_id", user.zalo_user_id);

  if (error) throw error;
}

export async function deleteAnniversaries(coupleId: string) {
  if (isMockMode || !supabase) {
    const state = readState();
    state.anniversaries = state.anniversaries.filter((item) => item.couple_id !== coupleId);
    writeState(state);
    return;
  }

  const { error } = await supabase
    .from("anniversaries")
    .delete()
    .eq("couple_id", coupleId);

  if (error) throw error;
}

export async function deleteInvites(coupleId: string) {
  if (isMockMode || !supabase) {
    const state = readState();
    state.invites = state.invites.filter((item) => item.couple_id !== coupleId);
    writeState(state);
    return;
  }

  const { error } = await supabase
    .from("partner_invites")
    .delete()
    .eq("couple_id", coupleId);

  if (error) throw error;
}

export async function deleteMembers(coupleId: string) {
  if (isMockMode || !supabase) {
    const state = readState();
    state.members = state.members.filter((item) => item.couple_id !== coupleId);
    writeState(state);
    return;
  }

  const { error } = await supabase
    .from("couple_members")
    .delete()
    .eq("couple_id", coupleId);

  if (error) throw error;
}

export async function deleteCouple(coupleId: string) {
  if (isMockMode || !supabase) {
    const state = readState();
    state.couples = state.couples.filter((item) => item.id !== coupleId);
    writeState(state);
    return;
  }

  const { error } = await supabase
    .from("couples")
    .delete()
    .eq("id", coupleId);

  if (error) throw error;
}

function reassignMockPairedData(coupleId: string, fromUserId: string, toUserId: string) {
  const state = readState();
  state.couples = state.couples.map((couple) => {
    if (couple.id !== coupleId) return couple;
    if (couple.created_by !== fromUserId) return couple;

    return { ...couple, created_by: toUserId, updated_at: now() };
  });
  state.members = state.members.map((member) => {
    if (member.couple_id !== coupleId) return member;
    if (member.user_id !== toUserId) return member;

    return { ...member, role: "owner", side: "left" };
  });
  state.anniversaries = state.anniversaries.map((anniversary) => {
    if (anniversary.couple_id !== coupleId) return anniversary;
    if (anniversary.created_by !== fromUserId) return anniversary;

    return { ...anniversary, created_by: toUserId };
  });
  state.invites = state.invites.map((invite) => {
    if (invite.couple_id !== coupleId) return invite;
    if (invite.invited_by !== fromUserId) return invite;

    return { ...invite, invited_by: toUserId };
  });
  writeState(state);
}

async function updateCoupleOwner(coupleId: string, fromUserId: string, toUserId: string, timestamp: string) {
  if (!supabase) return;

  const { error } = await supabase
    .from("couples")
    .update({ created_by: toUserId, updated_at: timestamp })
    .eq("id", coupleId)
    .eq("created_by", fromUserId);

  if (error) throw error;
}

async function updateRemainingMember(coupleId: string, userId: string) {
  if (!supabase) return;

  const { error } = await supabase
    .from("couple_members")
    .update({ role: "owner", side: "left" })
    .eq("couple_id", coupleId)
    .eq("user_id", userId);

  if (error) throw error;
}

async function updateAnniversaryCreator(coupleId: string, fromUserId: string, toUserId: string) {
  if (!supabase) return;

  const { error } = await supabase
    .from("anniversaries")
    .update({ created_by: toUserId })
    .eq("couple_id", coupleId)
    .eq("created_by", fromUserId);

  if (error) throw error;
}

async function updateInviteOwner(coupleId: string, fromUserId: string, toUserId: string) {
  if (!supabase) return;

  const { error } = await supabase
    .from("partner_invites")
    .update({ invited_by: toUserId })
    .eq("couple_id", coupleId)
    .eq("invited_by", fromUserId);

  if (error) throw error;
}
