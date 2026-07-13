import { Box, Button } from "@/components/zaui";

type Props = {
  canSubmit: boolean;
  loading: boolean;
  onBack: () => void;
  onSubmit: () => void;
  submitLabel: string;
};

export function MemoryDetailFooter({
  canSubmit,
  loading,
  onBack,
  onSubmit,
  submitLabel,
}: Props) {
  return (
    <Box className="fixed bottom-0 left-0 right-0 z-20 mx-auto w-[min(100%,430px)] bg-[#fff4f8]/80 px-[18px] pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
      <Box className="flex justify-center items-center gap-10">
        <Button
          htmlType="button"
          variant="secondary"
          className="rounded-2xl font-bold"
          onClick={onBack}
        >
          Quay lại
        </Button>
        <Button
          disabled={!canSubmit}
          htmlType="button"
          loading={loading}
          variant="primary"
          className="rounded-2xl border-none font-bold"
          onClick={onSubmit}
        >
          {submitLabel}
        </Button>
      </Box>
    </Box>
  );
}
