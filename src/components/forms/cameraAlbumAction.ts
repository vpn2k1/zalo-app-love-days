type Input = {
  close: () => void;
  onCapture: (imageUrl: string) => void;
  onPickAlbum: () => Promise<string>;
  setError: (error: string) => void;
};

export function getPickAlbumAction({
  close,
  onCapture,
  onPickAlbum,
  setError,
}: Input) {
  return async () => {
    setError("");
    try {
      const image = await onPickAlbum();
      if (!image) return;

      onCapture(image);
      close();
    } catch (pickerError) {
      console.error(pickerError);
      setError("Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };
}
