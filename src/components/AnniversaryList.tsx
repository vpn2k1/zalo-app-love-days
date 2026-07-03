import { Box, Text } from "zmp-ui";
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
        <Box className="anniversary-item" key={`${item.title}-${item.date}-${index}`}>
          {item.image_url && (
            <img className="anniversary-thumb" src={item.image_url} alt="" />
          )}
          <div>
            <Text className="anniversary-title">{item.title}</Text>
            <Text className="subtle">
              {formatDate(item.date)} ·{" "}
              {item.repeat_type === "yearly" ? "Lặp hàng năm" : "Không lặp"}
            </Text>
            {item.note && <Text className="anniversary-note">{item.note}</Text>}
          </div>
          <span className="heart-dot">♥</span>
        </Box>
      ))}
    </Box>
  );
}
