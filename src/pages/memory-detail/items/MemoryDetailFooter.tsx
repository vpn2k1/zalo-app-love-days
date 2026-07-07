import { Box, Button } from "@/components/zaui";

type Props = {
  canUpdate: boolean;
  loading: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

export function MemoryDetailFooter({
  canUpdate,
  loading,
  onBack,
  onSubmit,
}: Props) {
  return (
    <Box className="fixed bottom-0 left-0 right-0 z-20 mx-auto grid w-[min(100%,430px)] grid-cols-2 gap-2 bg-[#fff4f8]/95 px-[18px] pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
      <Button htmlType="button" variant="secondary" onClick={onBack}>
        Quay lại
      </Button>
      <Button
        disabled={!canUpdate}
        htmlType="button"
        loading={loading}
        variant="primary"
        onClick={onSubmit}
      >
        Cập nhật
      </Button>
    </Box>
  );
}
