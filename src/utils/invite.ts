export const getInviteCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const inviteCode = params.get("inviteCode") ?? params.get("invite_code");
  return inviteCode?.trim() || null;
};

export const buildInvitePath = (inviteCode: string) =>
  `/invite?inviteCode=${encodeURIComponent(inviteCode)}`;

export const buildInviteUrl = (inviteCode: string) => {
  const origin = window.location.origin || "https://zalo.me";
  return `${origin}${buildInvitePath(inviteCode)}`;
};
