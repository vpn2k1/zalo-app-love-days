import type { ReactNode } from "react";
import { Icon, Text } from "zmp-ui";
import type { DatePickerProps } from "zmp-ui/date-picker";

type Props = {
  disabled?: boolean;
  displayValue: string;
  errorText?: string;
  hasError: boolean;
  helperText?: string;
  inputClass?: string;
  label: string;
  name: string;
  placeholder?: string;
  prefix?: ReactNode;
  status: DatePickerProps["status"];
  suffix?: ReactNode;
  onOpen: (event: React.PointerEvent<HTMLElement>) => void;
};

export function AppDatePickerTrigger({
  disabled,
  displayValue,
  errorText,
  hasError,
  helperText,
  inputClass,
  label,
  name,
  placeholder,
  prefix,
  status,
  suffix,
  onOpen,
}: Props) {
  return (
    <div className="">
      <Text className="form-label">{label}</Text>
      <button
        type="button"
        aria-invalid={status === "error"}
        className={getTriggerClassName(hasError, inputClass)}
        disabled={disabled}
        name={name}
        onPointerDown={onOpen}
      >
        {prefix && <span className="app-date-picker-icon">{prefix}</span>}
        <span className="app-date-picker-value">
          {getDisplayText(displayValue, placeholder)}
        </span>
        <span className="app-date-picker-icon">
          {suffix ?? <Icon icon="zi-calendar" />}
        </span>
      </button>
      {helperText && <Text className="app-helper-text">{helperText}</Text>}
      {errorText && <Text className="app-error-text">{errorText}</Text>}
    </div>
  );
}

function getTriggerClassName(hasError: boolean, inputClass: string | undefined) {
  let className = "app-date-picker-trigger";
  if (hasError) {
    className = `${className} app-date-picker-trigger-error`;
  }
  if (inputClass) {
    className = `${className} ${inputClass}`;
  }

  return className;
}

function getDisplayText(value: string, placeholder: string | undefined) {
  if (value) return value;
  if (placeholder) return placeholder;

  return "Chọn ngày";
}
