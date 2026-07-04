import { Spinner, Text } from "zmp-ui";
import type { SpinnerProps } from "zmp-ui/spinner";

type Props = SpinnerProps & {
  label?: string;
};

export function AppSpinner({ label, visible = true, ...spinnerProps }: Props) {
  if (!visible) return null;

  return (
    <div className="app-spinner">
      <Spinner {...spinnerProps} visible={visible} />
      {label && <Text>{label}</Text>}
    </div>
  );
}
