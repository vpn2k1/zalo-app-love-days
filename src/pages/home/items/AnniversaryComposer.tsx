import { AnniversaryForm } from "@/components/AnniversaryForm";
import { Box } from "@/components/zaui";
import type { AnniversaryDraft } from "@/types/anniversary";

type Props = {
  loading?: boolean;
  visible: boolean;
  onAdd: (draft: AnniversaryDraft) => Promise<void>;
};

export function AnniversaryComposer({ loading, visible, onAdd }: Props) {
  if (!visible) return null;

  return (
    <Box className="mb-3 rounded-[18px] bg-white/90 p-3.5">
      <AnniversaryForm loading={loading} onAdd={onAdd} />
    </Box>
  );
}
