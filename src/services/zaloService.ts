import { authorize, getUserInfo, openShareSheet } from "zmp-sdk";
import type { ZaloUserProfile } from "@/types/user";

export const zaloService = {
  async requestUserInfoPermission() {
    await authorize({ scopes: ["scope.userInfo"] });
  },

  async getCurrentUser(): Promise<ZaloUserProfile> {
    const result = await getUserInfo({
      avatarType: "large",
      autoRequestPermission: false,
    });
    const userInfo = result.userInfo;
    return {
      id: userInfo.id,
      name: userInfo.name,
      avatar: userInfo.avatar,
    };
  },

  async shareInvite(title: string, path: string) {
    await openShareSheet({
      type: "zmp",
      data: {
        title,
        description: "Tham gia Love Days cùng mình nhé ❤️",
        thumbnail: "https://h5.zdn.vn/static/images/avatar.png",
        path,
      },
    });
  },
};
