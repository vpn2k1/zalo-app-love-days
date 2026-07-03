import type { Anniversary } from "@/types/anniversary";
import type { Couple, CoupleMember } from "@/types/couple";
import type { PartnerInvite } from "@/types/invite";
import type { AppUser } from "@/types/user";

export type MockState = {
  users: AppUser[];
  couples: Couple[];
  members: CoupleMember[];
  anniversaries: Anniversary[];
  invites: PartnerInvite[];
};

const STORAGE_KEY = "love-days.mock-db";

export const now = () => new Date().toISOString();

export const uid = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

const emptyState = (): MockState => ({
  users: [],
  couples: [],
  members: [],
  anniversaries: [],
  invites: [],
});

export const readState = (): MockState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockState) : emptyState();
  } catch {
    return emptyState();
  }
};

export const writeState = (state: MockState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
