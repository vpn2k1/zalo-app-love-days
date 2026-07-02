export type AppUser = {
  id: string;
  zalo_user_id: string;
  name: string;
  avatar_url?: string | null;
  display_name?: string | null;
  custom_avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ZaloUserProfile = {
  id: string;
  name: string;
  avatar?: string;
};
