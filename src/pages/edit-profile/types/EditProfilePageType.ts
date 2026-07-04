import type { AppUser } from "@/types/user";

export type EditProfilePageProps = {
  user: AppUser;
};

export type ProfileFormValues = {
  display_name: string;
  custom_avatar_url: string;
};
