import { saveImageToGallery } from "zmp-sdk/apis";

type SaveImageResult = "download" | "gallery";

export const imageSaveService = {
  async save(imageUrl: string): Promise<SaveImageResult> {
    try {
      await saveToGallery(imageUrl);
      return "gallery";
    } catch (error) {
      console.warn(error);
      downloadImage(imageUrl);
      return "download";
    }
  },
};

async function saveToGallery(imageUrl: string) {
  if (isBase64Image(imageUrl)) {
    await saveImageToGallery({ imageBase64Data: imageUrl });
    return;
  }

  await saveImageToGallery({ imageUrl });
}

function downloadImage(imageUrl: string) {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = getDownloadFileName(imageUrl);
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function getDownloadFileName(imageUrl: string) {
  if (isBase64Image(imageUrl)) return `love-days-${Date.now()}.png`;

  const path = imageUrl.split("?")[0] ?? "";
  const fileName = path.split("/").filter(Boolean).pop();
  if (fileName) return fileName;

  return `love-days-${Date.now()}.jpg`;
}

function isBase64Image(imageUrl: string) {
  return imageUrl.startsWith("data:image/");
}
