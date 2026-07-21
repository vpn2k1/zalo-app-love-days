import { MAX_MUSIC_FILE_SIZE_MB } from "@/config/music";
import { mockMusicDb } from "@/services/mockMusicDb";
import { isMockMode, supabase } from "@/services/supabaseClient";
import type { Couple } from "@/types/couple";

const MEDIA_BUCKET = "love-days-media";
const MP3_MIME_TYPES = new Set(["audio/mpeg", "audio/mp3"]);

export const musicService = {
  async getMusicUrl(coupleId: string): Promise<string | null> {
    if (isMockMode || !supabase) {
      return getMockMusicUrl(coupleId);
    }

    const { data, error } = await supabase
      .from("couples")
      .select("mp3_url")
      .eq("id", coupleId)
      .single();
    if (error) throw error;

    return normalizeMusicUrl((data as Pick<Couple, "mp3_url">).mp3_url);
  },

  async updateMusic(coupleId: string, file: File | null): Promise<Couple> {
    let mp3Url: string | null = null;
    if (file) mp3Url = await uploadMusicFile(coupleId, file);

    if (isMockMode || !supabase) {
      return mockMusicDb.updateMusicUrl(coupleId, mp3Url);
    }

    const { data, error } = await supabase
      .from("couples")
      .update({ mp3_url: mp3Url, updated_at: new Date().toISOString() })
      .eq("id", coupleId)
      .select("*")
      .single();
    if (error) throw error;

    // ponytail: removing music clears the DB reference; the fixed-path file is
    // overwritten on the next upload and removed when the couple is deleted.
    return data as Couple;
  },
};

async function uploadMusicFile(coupleId: string, file: File) {
  validateMusicFile(file);
  if (!supabase) return URL.createObjectURL(file);

  const storagePath = `${coupleId}/music/background.mp3`;
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: "audio/mpeg",
      upsert: true,
    });
  if (error) {
    console.error(error);
    throw new Error("Không thể tải nhạc lên. Vui lòng thử lại.");
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
  return `${data.publicUrl}?t=${Date.now()}`;
}

function validateMusicFile(file: File) {
  const maxSize = MAX_MUSIC_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`Tệp nhạc vượt quá ${MAX_MUSIC_FILE_SIZE_MB}MB.`);
  }
  if (!file.name.toLowerCase().endsWith(".mp3")) {
    throw new Error("Chỉ hỗ trợ tệp MP3.");
  }
  if (!file.type || MP3_MIME_TYPES.has(file.type)) return;

  throw new Error("Tệp đã chọn không đúng định dạng MP3.");
}

async function getMockMusicUrl(coupleId: string) {
  const musicUrl = normalizeMusicUrl(mockMusicDb.getMusicUrl(coupleId));
  if (!musicUrl?.startsWith("blob:")) return musicUrl;

  // ponytail: mock MP3 blobs are session-only; use IndexedDB if reload
  // persistence is ever required without Supabase.
  try {
    const response = await fetch(musicUrl);
    if (response.ok) return musicUrl;
  } catch {
    return null;
  }

  return null;
}

function normalizeMusicUrl(value?: string | null) {
  const musicUrl = value?.trim();
  if (!musicUrl) return null;

  return musicUrl;
}
