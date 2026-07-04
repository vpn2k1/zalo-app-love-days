import { Box, Button, Icon } from "@/components/zaui";

export function MemoryChips() {
  return (
    <Box className="mb-3 flex gap-2">
      <Button
        htmlType="button"
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border-0 bg-[#3a2232] px-3.5 text-white"
      >
        <Icon icon="zi-edit" /> Love note
      </Button>
      <Button
        htmlType="button"
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border-0 bg-white px-3.5 text-[#d9467e]"
      >
        <Icon icon="zi-notif" /> Reminder
      </Button>
    </Box>
  );
}
