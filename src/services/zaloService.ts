import { authorize, getAccessToken, getUserInfo, openShareSheet } from "zmp-sdk";
import { supabase } from "@/services/supabaseClient";
import type { ZaloUserProfile } from "@/types/user";

type ZaloUserInfoResponse = {
  userInfo: {
    id: string;
    name?: string;
    avatar?: string;
  };
};

type ShareInviteInput = {
  title: string;
  description: string;
  thumbnail: string;
  path: string;
};

const isAppSecretProofError = (error: unknown) => {
  const maybeError = error as { code?: number; error?: number; message?: string };
  const message = String(maybeError?.message ?? error).toLowerCase();
  return maybeError?.code === 453 || maybeError?.error === 453 || message.includes("appsecret_proof");
};

const toZaloUserProfile = ({ userInfo }: ZaloUserInfoResponse): ZaloUserProfile => ({
  id: userInfo.id,
  name: userInfo.name ?? "",
  avatar: userInfo.avatar,
});

const getCurrentUserWithProof = async (): Promise<ZaloUserProfile> => {
  if (!supabase) {
    throw new Error(
      "Zalo Graph API yêu cầu appsecret_proof. Hãy tắt yêu cầu appsecret_proof trong Zalo Developer Console hoặc cấu hình Supabase Edge Function zalo-user-info.",
    );
  }

  const accessToken = await getAccessToken();
  const { data, error } = await supabase.functions.invoke<ZaloUserInfoResponse>(
    "zalo-user-info",
    {
      body: {
        accessToken,
        avatarType: "large",
      },
    },
  );

  if (error) throw error;
  if (!data?.userInfo?.id) {
    throw new Error("Không thể lấy thông tin Zalo từ Edge Function.");
  }

  return toZaloUserProfile(data);
};

export const zaloService = {
  async requestUserInfoPermission() {
    await authorize({ scopes: ["scope.userInfo"] });
  },

  async getCurrentUser(): Promise<ZaloUserProfile> {
    try {
      const result = await getUserInfo({
        avatarType: "large",
        autoRequestPermission: false,
      });
      return toZaloUserProfile(result);
    } catch (error) {
      if (isAppSecretProofError(error)) {
        return getCurrentUserWithProof();
      }
      throw error;
    }
  },

  async shareInvite({ title, description, thumbnail, path }: ShareInviteInput) {
    await openShareSheet({
      type: "zmp",
      data: {
        title,
        description,
        thumbnail,
        path,
      },
    });
  },
};
