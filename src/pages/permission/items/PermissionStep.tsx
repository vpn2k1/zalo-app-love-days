import { Box, Icon, Text } from "@/components/zaui";

const steps = [
  { icon: "zi-user", label: "Tạo hồ sơ của bạn" },
  { icon: "zi-calendar", label: "Đặt ngày bắt đầu" },
  { icon: "zi-heart", label: "Chia sẻ cùng người ấy" },
] as const;

export function PermissionStep() {
  return (
    <Box className="app-opening-card app-permission-card">
      <Box className="app-permission-steps">
        {steps.map((step) => (
          <Box className="app-permission-step" key={step.label}>
            <Box className="app-small-heart">
              <Icon icon={step.icon} />
            </Box>
            <Text>{step.label}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
