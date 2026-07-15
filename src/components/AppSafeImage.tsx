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
  const {
    decoding = "async",
    loading = "lazy",
    onError,
    ...safeImageProps
  } = imageProps;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src) return fallback;
  if (failed) return fallback;

  return (
    <img
      {...safeImageProps}
      decoding={decoding}
      loading={loading}
      src={src}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
