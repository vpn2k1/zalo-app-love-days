import { Box, Text } from "@/components/zaui";
import vcb from "../qr/vcb.jpg";
import acb from "../qr/acb.jpg";

export function LegalPageDonate() {
  return (
    <Box className="app-legal-tab-body px-4 py-4">
      <Text className="text-center text-[var(--love-primary)] font-bold text-2xl">
        Ủng hộ cafe
      </Text>
      <Text className="text-center text-[var(--love-primary)] font-bold text-xl">
        Cảm ơn mọi người rất nhiều
      </Text>
      <Box className="grid grid-cols-1">
        <img src={acb} alt="acb" />
        <img src={vcb} alt="vcb" />
      </Box>
    </Box>
  );
}
