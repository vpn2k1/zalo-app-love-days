import { Box, Button, Page, Text } from "@/components/zaui";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export function MemoryDetailMissingState() {
  const navigation = useAppNavigation();

  return (
    <Page className="mx-auto grid min-h-screen w-[min(100%,430px)] place-items-center bg-[#fff4f8] px-[18px] text-center text-[#3c2435]">
      <Box className="rounded-[22px] bg-white/90 p-4">
        <Text className="font-[850] text-[#3a2232]">
          Không tìm thấy kỷ niệm
        </Text>
        <Button className="mt-3" htmlType="button" onClick={navigation.goBack}>
          Quay lại
        </Button>
      </Box>
    </Page>
  );
}
