import { AnniversaryForm } from "@/components/AnniversaryForm";
import { AppSheet, Box, Text } from "@/components/zaui";
import type { AnniversaryDraft } from "@/types/anniversary";

type Props = {
  loading?: boolean;
  visible: boolean;
  onAdd: (draft: AnniversaryDraft) => Promise<void>;
  onClose: () => void;
};

export function AnniversaryComposer({
  loading,
  visible,
  onAdd,
  onClose,
}: Props) {
  return (
    <AppSheet visible={visible} onClose={onClose}>
      <Box
        className="px-5 pb-5 pt-2 overflow-y-auto overflow-x-hidden"
        style={{
          scrollbarWidth: "none",
        }}
      >
        <Box className="mb-4 text-center">
          <Text className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#c45a86]">
            Kỷ niệm mới
          </Text>
          <Text className="mt-2 text-[22px] font-bold leading-tight text-[#2e2530]">
            Lưu một ngày đáng nhớ
          </Text>
        </Box>
        <AnniversaryForm loading={loading} onAdd={onAdd} />
      </Box>
    </AppSheet>
  );
}
