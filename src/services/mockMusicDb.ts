import { now, readState, writeState } from "@/services/mockDbState";
import type { Couple } from "@/types/couple";

export const mockMusicDb = {
  getMusicUrl(coupleId: string) {
    const state = readState();
    const couple = state.couples.find((item) => item.id === coupleId);

    return couple?.mp3_url ?? null;
  },

  updateMusicUrl(coupleId: string, mp3Url: string | null): Couple {
    const state = readState();
    const couple = state.couples.find((item) => item.id === coupleId);
    if (!couple) throw new Error("Không tìm thấy Nhật ký tình yêu.");

    couple.mp3_url = mp3Url;
    couple.updated_at = now();
    writeState(state);
    return couple;
  },
};
