import { Box, Spinner, Text } from "zmp-ui";
import type { SpinnerProps } from "zmp-ui/spinner";
import logoSrc from "../../../assets/images/logo.png";

type Props = SpinnerProps & {
  className?: string;
  label?: string;
};

export function AppSpinner({
  className,
  label,
  visible = true,
  ...spinnerProps
}: Props) {
  if (!visible) return null;

  return (
    <Box className={getSpinnerClassName(className)}>
      <Spinner
        logo={<img src={logoSrc} alt="Biểu trưng Nhật Ký Yêu" />}
        {...spinnerProps}
        visible={visible}
      />
      {label && <Text>{label}</Text>}
    </Box>
  );
}

function getSpinnerClassName(className: string | undefined) {
  if (!className) return "app-spinner";

  return `app-spinner ${className}`;
}
