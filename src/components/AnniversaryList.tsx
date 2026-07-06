import { Box, Icon, Text } from "@/components/zaui";
import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  anniversaries: Array<Anniversary | AnniversaryDraft>;
  onRemove: (index: number) => void;
};

export function AnniversaryList({ anniversaries, onRemove }: Props) {
  if (anniversaries.length === 0) {
    return (
      <Box className="empty-state">
        <Text>Chưa có ngày kỷ niệm riêng.</Text>
        <Text className="subtle">Bạn có thể thêm sau khi tạo.</Text>
      </Box>
    );
  }

  return (
    <Box className="anniversary-list">
      {anniversaries.map((item, index) => (
        <AnniversaryItem
          item={item}
          onRemove={() => onRemove(index)}
          key={`${item.title}-${item.date}-${index}`}
        />
      ))}
    </Box>
  );
}

function AnniversaryItem({
  item,
  onRemove,
}: {
  item: Anniversary | AnniversaryDraft;
  onRemove: () => void;
}) {
  let repeatLabel = "Không lặp";
  if (item.repeat_type === "yearly") {
    repeatLabel = "Lặp hàng năm";
  }

  return (
    <Box className="anniversary-item">
      {item.image_url && (
        <img className="anniversary-thumb" src={item.image_url} alt="" />
      )}
      <Box>
        <Text className="anniversary-title">{item.title}</Text>
        <Text className="subtle">
          {formatDate(item.date)} · {repeatLabel}
        </Text>
        {item.note && <Text className="anniversary-note">{item.note}</Text>}
      </Box>
      <Box onClick={onRemove} className="anniversary-remove">
        <Icon icon="zi-delete" size={30} className="text-red-500" />
      </Box>
    </Box>
  );
}
