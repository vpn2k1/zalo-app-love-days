import { Box, Text } from "@/components/zaui";
import logoSrc from "../../../../assets/images/logo.png";

export function PermissionHeader() {
  return (
    <Box className="app-opening-header flex flex-col items-center">
      <img src={logoSrc} alt="Logo" className="max-h-[50px]" />
      <Text className="text-center">Ứng dụng nhỏ lưu giữ hành trình yêu</Text>
    </Box>
  );
}
