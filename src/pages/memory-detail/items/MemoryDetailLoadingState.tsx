import { AppSpinner, Box } from "@/components/zaui";

export function MemoryDetailLoadingState() {
  return (
    <Box className="boot-screen">
      <AppSpinner />
    </Box>
  );
}
