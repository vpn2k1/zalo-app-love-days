import { isUploadedMediaUrl, mediaService } from "@/services/mediaService";
import type { AnniversaryDraft } from "@/types/anniversary";

export function getDraftImageUrls(draft: AnniversaryDraft) {
  if (draft.image_urls && draft.image_urls.length > 0) return draft.image_urls;
  if (!draft.image_url) return [];

  return [draft.image_url];
}

export async function uploadAnniversaryImages({
  anniversaryId,
  coupleId,
  imageUrls,
  title,
}: {
  anniversaryId: string;
  coupleId: string;
  imageUrls: string[];
  title: string;
}) {
  try {
    const uploadedImages = await Promise.all(imageUrls.map((imageUrl, index) => {
      if (isSavedImageUrl(imageUrl)) return imageUrl;

      return mediaService.uploadImagePath({
        coupleId,
        fileName: `anniversary-${index + 1}-${title}`,
        folderName: anniversaryId,
        path: imageUrl,
        scope: "anniversaries",
      });
    }));

    return uploadedImages.filter((item): item is string => Boolean(item));
  } catch (error) {
    console.error(error);
    throw new Error("Không thể tải ảnh lên. Kỷ niệm chưa được lưu.");
  }
}

function isSavedImageUrl(imageUrl: string) {
  return isUploadedMediaUrl(imageUrl);
}
