export const queryKeys = {
  allAnniversaries: (coupleId?: string) => ["allAnniversaries", coupleId] as const,
  anniversariesByDate: (coupleId?: string, date?: string) =>
    ["anniversariesByDate", coupleId, date] as const,
  infiniteAnniversaries: (coupleId?: string) =>
    ["infiniteAnniversaries", coupleId] as const,
  couple: (userId?: string) => ["couple", userId] as const,
  currentUser: () => ["currentUser"] as const,
  music: (coupleId?: string) => ["music", coupleId] as const,
};

export const allAnniversariesQueryKey = queryKeys.allAnniversaries;
export const anniversariesByDateQueryKey = queryKeys.anniversariesByDate;
export const infiniteAnniversariesQueryKey = queryKeys.infiniteAnniversaries;
export const coupleQueryKey = queryKeys.couple;
export const currentUserQueryKey = queryKeys.currentUser;
export const musicQueryKey = queryKeys.music;
