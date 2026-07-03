import { supabase } from "@/services/supabaseClient";

const MEDIA_BUCKET = "love-days-media";

type UploadImageInput = {
  coupleId: string;
  fileName: string;
  path: string | null | undefined;
  scope: "avatars" | "anniversaries";
};

export const mediaService = {
  async uploadImagePath({
    coupleId,
    fileName,
    path,
    scope,
  }: UploadImageInput): Promise<string | null> {
    if (!path) return null;
    if (!supabase || !isLocalImagePath(path)) return path;

    const blob = await imagePathToBlob(path);
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
    return data.publicUrl;
  },
};

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
