import type { AppUser } from "@/types/user";

export type CurrentUserUpdater = (current: AppUser) => AppUser;

let currentUser: AppUser | null = null;

export const currentUserStore = {
  get() {
    return currentUser;
  },
  set(user: AppUser | null) {
    currentUser = user;
  },
  update(updater: CurrentUserUpdater) {
    if (!currentUser) return null;

    currentUser = updater(currentUser);
    return currentUser;
  },
};
