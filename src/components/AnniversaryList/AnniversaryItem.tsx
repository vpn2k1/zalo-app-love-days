import { AppSafeImage } from "@/components/AppSafeImage";
import { Box, Icon, Text } from "@/components/zaui";
import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

import { AnniversaryThumbFallback } from "./AnniversaryThumbFallback";

type Props = {
  item: Anniversary | AnniversaryDraft;
  onRemove: () => void;
};

export function AnniversaryItem({ item, onRemove }: Props) {
  return (
    <Box className="anniversary-item">
      {item.image_url && (
        <AppSafeImage
          alt=""
          className="anniversary-thumb"
          fallback={<AnniversaryThumbFallback />}
          src={item.image_url}
        />
      )}
      <Box>
        <Text className="anniversary-title">{item.title}</Text>
        <Text className="subtle">
          {formatDate(item.date)} · {getRepeatLabel(item.repeat_type)}
        </Text>
        {item.note && <Text className="anniversary-note">{item.note}</Text>}
      </Box>
      <Box onClick={onRemove} className="anniversary-remove">
        <Icon icon="zi-delete" size={30} className="text-red-500" />
      </Box>
    </Box>
  );
}

function getRepeatLabel(repeatType: Anniversary["repeat_type"]) {
  if (repeatType === "yearly") return "Lặp hàng năm";

  return "Không lặp";
}
