import {
  useEffect,
  useState,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  fallback: ReactNode;
  src?: string | null;
};

export function AppSafeImage({ fallback, src, ...imageProps }: Props) {
  const [failed, setFailed] = useState(false);
  const { onError, ...safeImageProps } = imageProps;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src) return fallback;
  if (failed) return fallback;

  return (
    <img
      {...safeImageProps}
      src={src}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
