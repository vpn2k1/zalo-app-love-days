export type RepeatType = "yearly" | "none";

export type Anniversary = {
  id: string;
  couple_id: string;
  title: string;
  date: string;
  repeat_type: RepeatType;
  note?: string | null;
  created_by: string;
  created_at?: string;
};

export type AnniversaryDraft = {
  title: string;
  date: string;
  repeat_type: RepeatType;
  note?: string;
};

export type UpcomingAnniversary = {
  title: string;
  date: string;
  originalDate: string;
  daysLeft: number;
  repeat_type: RepeatType;
  note?: string | null;
};
