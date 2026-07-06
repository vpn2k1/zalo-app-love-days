import { chooseImage } from "zmp-sdk";

export type ImageSourceType = "album" | "camera";

export async function pickImagePath(sourceType?: ImageSourceType) {
  const sources = getImageSources(sourceType);
  const result = await chooseImage({
    count: 1,
    sourceType: sources,
    cameraType: "back",
  });
  return result.filePaths[0] || result.tempFiles[0]?.path || "";
}

function getImageSources(sourceType?: ImageSourceType): ImageSourceType[] {
  if (!sourceType) return ["album", "camera"];

  return [sourceType];
}
