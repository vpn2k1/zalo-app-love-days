import { chooseImage, openMediaPicker } from "zmp-sdk/apis";

export type ImageSourceType = "album" | "camera";
export type ImageCameraType = "back" | "front";

export async function pickImagePath(
  sourceType?: ImageSourceType,
  cameraType: ImageCameraType = "back",
) {
  const images = await pickMediaImagePaths({
    cameraType,
    count: 1,
    sourceType,
  });
  return images[0] ?? "";
}

export async function pickImagePaths(
  sourceType?: ImageSourceType,
  count = 10,
  cameraType: ImageCameraType = "back",
) {
  return pickMediaImagePaths({
    cameraType,
    count,
    sourceType,
  });
}

async function pickMediaImagePaths({
  cameraType,
  count,
  sourceType,
}: {
  cameraType: ImageCameraType;
  count: number;
  sourceType?: ImageSourceType;
}) {
  if (count < 1) return [];

  const images = await pickWithOpenMediaPicker({
    cameraType,
    count,
    sourceType,
  });
  if (images.length > 0) return images.slice(0, count);

  return pickWithChooseImage({
    cameraType,
    count,
    sourceType,
  });
}

async function pickWithOpenMediaPicker({
  cameraType,
  count,
  sourceType,
}: {
  cameraType: ImageCameraType;
  count: number;
  sourceType?: ImageSourceType;
}) {
  const result = await openMediaPicker({
    type: getMediaPickerType(sourceType, cameraType),
    maxSelectItem: count,
    compressLevel: 1,
    editView: {
      enable: false,
    },
  });

  return normalizeMediaPickerData(result.data);
}

async function pickWithChooseImage({
  cameraType,
  count,
  sourceType,
}: {
  cameraType: ImageCameraType;
  count: number;
  sourceType?: ImageSourceType;
}) {
  const result = await chooseImage({
    count,
    sourceType: getChooseImageSources(sourceType),
    cameraType,
  });

  return normalizeChooseImagePaths(result).slice(0, count);
}

function getMediaPickerType(
  sourceType: ImageSourceType | undefined,
  cameraType: ImageCameraType,
) {
  if (sourceType !== "camera") return "photo";
  // ponytail: openMediaPicker has no front/back option; use AppCameraCapture if that choice matters.
  if (cameraType !== "front") return "zcamera_photo";

  return "zcamera_photo";
}

function getChooseImageSources(sourceType?: ImageSourceType): ImageSourceType[] {
  if (!sourceType) return ["album", "camera"];

  return [sourceType];
}

function normalizeMediaPickerData(data: unknown) {
  if (!data) return [];
  if (Array.isArray(data)) return uniqueImagePaths(extractMediaPaths(data));
  if (typeof data !== "string") return uniqueImagePaths(extractMediaPaths(data));

  const parsedData = parseMediaPickerJson(data);
  if (parsedData !== data) return uniqueImagePaths(extractMediaPaths(parsedData));

  return uniqueImagePaths([data]);
}

function parseMediaPickerJson(data: string) {
  try {
    return JSON.parse(data) as unknown;
  } catch {
    return data;
  }
}

function extractMediaPaths(data: unknown): unknown[] {
  if (typeof data === "string") return [data];
  if (Array.isArray(data)) return data.reduce<unknown[]>((paths, item) => {
    return paths.concat(extractMediaPaths(item));
  }, []);
  if (!isRecord(data)) return [];

  const directPaths = extractDirectPaths(data);
  if (directPaths.length > 0) return directPaths;

  return extractNestedPaths(data);
}

function extractDirectPaths(data: Record<string, unknown>) {
  const candidateKeys = ["path", "paths", "filePath", "filePaths", "url", "urls"];
  return candidateKeys.reduce<unknown[]>((paths, key) => {
    const value = data[key];
    if (Array.isArray(value)) return paths.concat(value);
    if (typeof value === "string") return paths.concat(value);

    return paths;
  }, []);
}

function extractNestedPaths(data: Record<string, unknown>) {
  const candidateKeys = ["data", "result", "result_content"];
  return candidateKeys.reduce<unknown[]>((paths, key) => {
    return paths.concat(extractMediaPaths(data[key]));
  }, []);
}

function normalizeChooseImagePaths(result: {
  filePaths?: string[];
  tempFiles?: { path: string }[];
}) {
  if (result.filePaths && result.filePaths.length > 0) {
    return uniqueImagePaths(result.filePaths);
  }

  return uniqueImagePaths((result.tempFiles ?? []).map((file) => file.path));
}

function uniqueImagePaths(paths: unknown[]) {
  return paths.filter(isStringPath).filter((path, index, allPaths) => {
    return allPaths.indexOf(path) === index;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (!value) return false;
  if (typeof value !== "object") return false;

  return true;
}

function isStringPath(path: unknown): path is string {
  if (typeof path !== "string") return false;

  return path.length > 0;
}
