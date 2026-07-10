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
    <Box className="fixed bottom-0 left-0 right-0 z-20 mx-auto w-[min(100%,430px)] bg-[#fff4f8]/80 px-[18px] pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
      <Box className="grid grid-cols-2 gap-2 rounded-[24px] border border-pink-100 bg-white/95 p-2 shadow-[0_16px_34px_rgba(134,45,83,0.16)]">
        <Button
          htmlType="button"
          variant="secondary"
          className="rounded-2xl font-bold"
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Button
          disabled={!canUpdate}
          htmlType="button"
          loading={loading}
          variant="primary"
          className="rounded-2xl border-none font-bold"
          onClick={onSubmit}
        >
          Cập nhật
        </Button>
      </Box>
    </Box>
  );
}
