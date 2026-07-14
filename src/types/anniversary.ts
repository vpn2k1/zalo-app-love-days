export type RepeatType = "yearly" | "none";

export type Anniversary = {
  id: string;
  couple_id: string;
  title: string;
  date: string;
  repeat_type: RepeatType;
  note?: string | null;
  image_url?: string | null;
  image_urls?: string[] | null;
  created_by: string;
  created_at?: string;
};

export type AnniversaryDraft = {
  title: string;
  date: string;
  repeat_type: RepeatType;
  note?: string;
  image_url?: string;
  image_urls?: string[];
};

export type AnniversaryUpdateInput = AnniversaryDraft;

export type AnniversaryPage = {
  hasMore: boolean;
  items: Anniversary[];
  limit: number;
  page: number;
};

export type UpcomingAnniversary = {
  title: string;
  date: string;
  originalDate: string;
  daysLeft: number;
  repeat_type: RepeatType;
  note?: string | null;
  image_url?: string | null;
};
