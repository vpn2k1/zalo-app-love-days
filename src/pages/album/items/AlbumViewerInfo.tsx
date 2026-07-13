import { Box, Button, Text, type AppImageViewerImage } from "@/components/zaui";

type Props = {
  expanded: boolean;
  image: AppImageViewerImage;
  onToggle: () => void;
};

export function AlbumViewerInfo({ expanded, image, onToggle }: Props) {
  const hasDescription = Boolean(image.description);

  return (
    <Box className="pointer-events-none absolute bottom-[max(18px,env(safe-area-inset-bottom))] left-4 z-30 max-w-[min(78vw,320px)] pr-12 text-left">
      <Text className="text-[15px] font-[850] leading-tight text-white">
        {image.title}
      </Text>
      <Text className="mt-1 text-xs font-bold text-white/70">
        {image.date}
      </Text>
      {hasDescription && (
        <Text className={getDescriptionClassName(expanded)}>
          {image.description}
        </Text>
      )}
      {hasDescription && (
        <Button
          htmlType="button"
          size="small"
          variant="tertiary"
          className="pointer-events-auto mt-1 !min-h-7 rounded-full bg-white/15 px-2.5 text-xs font-bold text-white backdrop-blur-md"
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
        >
          {getToggleLabel(expanded)}
        </Button>
      )}
    </Box>
  );
}

function getToggleLabel(expanded: boolean) {
  if (expanded) return "Thu gọn";

  return "Xem thêm";
}

function getDescriptionClassName(expanded: boolean) {
  const className = "mt-1 text-xs leading-[1.35] text-white/85";
  if (expanded) return className;

  return `${className} line-clamp-2`;
}
