import { chooseImage } from "zmp-sdk";

export type ImageSourceType = "album" | "camera";
export type ImageCameraType = "back" | "front";

export async function pickImagePath(
  sourceType?: ImageSourceType,
  cameraType: ImageCameraType = "back",
) {
  const sources = getImageSources(sourceType);
  const result = await chooseImage({
    count: 1,
    sourceType: sources,
    cameraType,
  });
  return result.filePaths[0] || result.tempFiles[0]?.path || "";
}

function getImageSources(sourceType?: ImageSourceType): ImageSourceType[] {
  if (!sourceType) return ["album", "camera"];

  return [sourceType];
}
