export type PartnerInviteStatus =
  | "pending"
  | "accepted"
  | "expired"
  | "cancelled";

export type PartnerInvite = {
  id: string;
  couple_id: string;
  invite_code: string;
  invited_by: string;
  accepted_by?: string | null;
  status: PartnerInviteStatus;
  expires_at: string;
  created_at?: string;
  accepted_at?: string | null;
};
