import { chooseImage } from "zmp-sdk";

export async function pickImagePath() {
  const result = await chooseImage({
    count: 1,
    sourceType: ["album", "camera"],
    cameraType: "back",
  });
  return result.filePaths[0] || result.tempFiles[0]?.path || "";
}
