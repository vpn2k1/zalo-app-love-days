import { Controller, type Control } from "react-hook-form";
import { Input } from "zmp-ui";

import { AppDatePicker } from "@/components/forms";
import { Box } from "@/components/zaui";
import { keepDigits } from "./albumFilterHelpers";
import type {
  AlbumFilterMode,
  AlbumFilters,
} from "../types/AlbumPageType";

type Props = {
  control: Control<AlbumFilters>;
  mode: AlbumFilterMode;
};

export function AlbumFilterFields({ control, mode }: Props) {
  if (mode === "day") {
    return (
      <Box className="mt-3">
        <AppDatePicker
          control={control}
          name="date"
          label="Ngày"
          placeholder="Chọn ngày"
        />
      </Box>
    );
  }

  if (mode === "range") {
    return (
      <Box className="mt-3 grid grid-cols-2 gap-2">
        <AppDatePicker
          control={control}
          name="startDate"
          label="Từ ngày"
          placeholder="Bắt đầu"
        />
        <AppDatePicker
          control={control}
          name="endDate"
          label="Đến ngày"
          placeholder="Kết thúc"
        />
      </Box>
    );
  }

  if (mode === "year") {
    return (
      <Box className="mt-3">
        <NumberField
          control={control}
          label="Năm"
          maxLength={4}
          name="year"
          placeholder="YYYY"
        />
      </Box>
    );
  }

  return null;
}

type NumberFieldProps = {
  control: Control<AlbumFilters>;
  label: string;
  maxLength: number;
  name: "year";
  placeholder: string;
};

function NumberField({
  control,
  label,
  maxLength,
  name,
  placeholder,
}: NumberFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Input
          label={label}
          inputMode="numeric"
          maxLength={maxLength}
          placeholder={placeholder}
          value={field.value}
          onChange={(event) => field.onChange(keepDigits(event.currentTarget.value))}
        />
      )}
    />
  );
}
