export const queryKeys = {
  anniversaries: (coupleId?: string) => ["anniversaries", coupleId] as const,
  couple: (userId?: string) => ["couple", userId] as const,
  currentUser: () => ["currentUser"] as const,
};

export const anniversariesQueryKey = queryKeys.anniversaries;
export const coupleQueryKey = queryKeys.couple;
export const currentUserQueryKey = queryKeys.currentUser;
