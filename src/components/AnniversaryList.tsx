import { Box, Text } from "@/components/zaui";
import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import { formatDate } from "@/utils/date";

type Props = {
  anniversaries: Array<Anniversary | AnniversaryDraft>;
};

export function AnniversaryList({ anniversaries }: Props) {
  if (anniversaries.length === 0) {
    return (
      <Box className="empty-state">
        <Text>Chưa có ngày kỷ niệm riêng.</Text>
        <Text className="subtle">Bạn có thể thêm sau khi tạo Love Days.</Text>
      </Box>
    );
  }

  return (
    <Box className="anniversary-list">
      {anniversaries.map((item, index) => (
        <AnniversaryItem item={item} key={`${item.title}-${item.date}-${index}`} />
      ))}
    </Box>
  );
}

function AnniversaryItem({
  item,
}: {
  item: Anniversary | AnniversaryDraft;
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
      <Text className="heart-dot">♥</Text>
    </Box>
  );
}
