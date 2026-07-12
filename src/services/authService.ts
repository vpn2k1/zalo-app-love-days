import { isMockMode, supabase } from "@/services/supabaseClient";
import { mockDb } from "@/services/mockDb";
import type { AppUser, ZaloUserProfile } from "@/types/user";

export const authService = {
  async findUserByZaloId(zaloUserId: string): Promise<AppUser | null> {
    if (isMockMode || !supabase) {
      return mockDb.findUserByZaloId(zaloUserId);
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("zalo_user_id", zaloUserId)
      .maybeSingle();

    return data ?? null;
  },

  async upsertZaloUser(profile: ZaloUserProfile): Promise<AppUser> {
    if (isMockMode || !supabase) {
      return mockDb.upsertUser(profile);
    }

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          zalo_user_id: profile.id,
          name: profile.name,
          avatar_url: profile.avatar,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "zalo_user_id" },
      )
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(
    userId: string,
    payload: Pick<AppUser, "display_name" | "custom_avatar_url">,
  ): Promise<AppUser> {
    if (isMockMode || !supabase) {
      return mockDb.updateUserProfile(userId, payload);
    }

    const { data, error } = await supabase
      .from("users")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async deleteUser(user: Pick<AppUser, "id" | "zalo_user_id">): Promise<void> {
    if (isMockMode || !supabase) {
      mockDb.deleteUser(user.id);
      return;
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("zalo_user_id", user.zalo_user_id);

    if (error) throw error;
  },
};
