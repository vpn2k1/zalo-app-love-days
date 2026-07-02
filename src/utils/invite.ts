export const getInviteCodeFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("inviteCode") ?? params.get("invite_code");
};

export const buildInvitePath = (inviteCode: string) =>
  `/?inviteCode=${encodeURIComponent(inviteCode)}`;

export const buildInviteUrl = (inviteCode: string) => {
  const origin = window.location.origin || "https://zalo.me";
  return `${origin}${buildInvitePath(inviteCode)}`;
};
