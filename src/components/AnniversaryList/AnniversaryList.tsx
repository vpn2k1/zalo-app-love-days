import type { Anniversary, AnniversaryDraft } from "@/types/anniversary";
import { Box } from "@/components/zaui";

import { AnniversaryEmptyState } from "./AnniversaryEmptyState";
import { AnniversaryItem } from "./AnniversaryItem";

type Props = {
  anniversaries: Array<Anniversary | AnniversaryDraft>;
  onRemove: (index: number) => void;
};

export function AnniversaryList({ anniversaries, onRemove }: Props) {
  if (anniversaries.length === 0) return <AnniversaryEmptyState />;

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
