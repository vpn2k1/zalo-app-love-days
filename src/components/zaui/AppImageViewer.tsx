import { ImageViewer } from "zmp-ui";
import type { ImageType, ImageViewerProps } from "zmp-ui/image-viewer";

type Props = Omit<ImageViewerProps, "images"> & {
  images: ImageType[] | string[];
};

function normalizeImages(images: Props["images"]): ImageType[] {
  return images.map((image) => (
    typeof image === "string" ? { src: image } : image
  ));
}

export function AppImageViewer({ images, ...imageViewerProps }: Props) {
  return (
    <ImageViewer
      {...imageViewerProps}
      images={normalizeImages(images)}
    />
  );
}
