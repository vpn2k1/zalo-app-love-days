import { supabase } from "@/services/supabaseClient";

const MEDIA_BUCKET = "love-days-media";

type UploadImageInput = {
  coupleId: string;
  fileName: string;
  path: string | null | undefined;
  scope: "avatars" | "anniversaries" | "backgrounds";
};

export const mediaService = {
  async removeCoupleMedia(coupleId: string): Promise<void> {
    if (!supabase) return;

    const paths = await listCoupleMediaPaths(coupleId);
    if (paths.length === 0) return;

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove(paths);

    if (error) throw error;
  },

  async removeUserAvatar(coupleId: string, userId: string): Promise<void> {
    if (!supabase) return;

    const paths = await listMatchingScopePaths(coupleId, "avatars", `avatar-${userId}`);
    if (paths.length === 0) return;

    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove(paths);

    if (error) throw error;
  },

  async uploadImagePath({
    coupleId,
    fileName,
    path,
    scope,
  }: UploadImageInput): Promise<string | null> {
    if (!path) return null;
    if (!supabase || !isLocalImagePath(path)) return path;

    const blob = await imagePathToBlob(path);
    if (blob.size > 50 * 1024 * 1024) {
      throw new Error("Kích thước ảnh vượt quá giới hạn cho phép (tối đa 50MB).");
    }
    const storagePath = `${coupleId}/${scope}/${safeFileName(fileName)}.${extensionFor(blob)}`;
    const { error } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(storagePath, blob, {
        cacheControl: "31536000",
        contentType: blob.type || "image/jpeg",
        upsert: true,
      });
    if (error) throw error;

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(storagePath);
    return `${data.publicUrl}?t=${Date.now()}`;
  },
};

async function listCoupleMediaPaths(coupleId: string) {
  const scopes = ["avatars", "anniversaries", "backgrounds"];
  const paths = await Promise.all(scopes.map((scope) => listScopePaths(coupleId, scope)));

  return paths.reduce<string[]>((allPaths, scopePaths) => {
    return allPaths.concat(scopePaths);
  }, []);
}

async function listScopePaths(coupleId: string, scope: string) {
  return listMatchingScopePaths(coupleId, scope);
}

async function listMatchingScopePaths(coupleId: string, scope: string, startsWith?: string) {
  if (!supabase) return [];

  const prefix = `${coupleId}/${scope}`;
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(prefix, { limit: 1000 });

  if (error) throw error;
  if (!data) return [];

  return data
    .filter((item) => {
      if (!startsWith) return true;

      return item.name.startsWith(startsWith);
    })
    .map((item) => `${prefix}/${item.name}`);
}

function isLocalImagePath(path: string) {
  return path.startsWith("blob:") || path.startsWith("data:") || !/^https?:\/\//.test(path);
}

async function imagePathToBlob(path: string) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error("Không thể đọc ảnh đã chọn.");
  }
  return response.blob();
}

function safeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "image";
}

function extensionFor(blob: Blob) {
  const subtype = blob.type.split("/")[1]?.replace("jpeg", "jpg");
  return subtype || "jpg";
}
