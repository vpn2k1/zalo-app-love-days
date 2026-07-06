import { Box, Spinner, Text } from "zmp-ui";
import type { SpinnerProps } from "zmp-ui/spinner";
import logoSrc from "../../../assets/images/logo.png";

type Props = SpinnerProps & {
  label?: string;
};

export function AppSpinner({ label, visible = true, ...spinnerProps }: Props) {
  if (!visible) return null;

  return (
    <Box className="app-spinner">
      <Spinner
        {...spinnerProps}
        logo={<img src={logoSrc} alt="Biểu trưng Yêu" />}
        visible={visible}
      />
      {label && <Text>{label}</Text>}
    </Box>
  );
}
