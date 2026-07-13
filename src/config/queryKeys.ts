export const queryKeys = {
  allAnniversaries: (coupleId?: string) => ["allAnniversaries", coupleId] as const,
  infiniteAnniversaries: (coupleId?: string) =>
    ["infiniteAnniversaries", coupleId] as const,
  couple: (userId?: string) => ["couple", userId] as const,
  currentUser: () => ["currentUser"] as const,
};

export const allAnniversariesQueryKey = queryKeys.allAnniversaries;
export const infiniteAnniversariesQueryKey = queryKeys.infiniteAnniversaries;
export const coupleQueryKey = queryKeys.couple;
export const currentUserQueryKey = queryKeys.currentUser;
