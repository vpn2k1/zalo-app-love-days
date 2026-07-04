import { AnniversaryForm } from "@/components/AnniversaryForm";
import { Box } from "@/components/zaui";
import type { AnniversaryDraft } from "@/types/anniversary";
import { homeStyles } from "../modules/inlineStyles";

type Props = {
  loading?: boolean;
  visible: boolean;
  onAdd: (draft: AnniversaryDraft) => Promise<void>;
};

export function AnniversaryComposer({ loading, visible, onAdd }: Props) {
  if (!visible) return null;

  return (
    <Box style={homeStyles.panel}>
      <AnniversaryForm loading={loading} onAdd={onAdd} />
    </Box>
  );
}
