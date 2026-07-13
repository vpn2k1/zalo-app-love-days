import { Controller, type Control } from "react-hook-form";
import { Input } from "zmp-ui";

import { AppCalendarPicker } from "@/components/forms";
import { Box } from "@/components/zaui";
import { keepDigits } from "./albumFilterHelpers";
import type {
  AlbumFilterMode,
  AlbumPageFormValues,
} from "../types/AlbumPageType";

type Props = {
  control: Control<AlbumPageFormValues>;
  mode: AlbumFilterMode;
};

export function AlbumFilterFields({ control, mode }: Props) {
  if (mode === "day") {
    return (
      <Box className="mt-3">
        <AppCalendarPicker
          control={control}
          name="draftFilters.date"
          label="Ngày"
          placeholder="Chọn ngày"
        />
      </Box>
    );
  }

  if (mode === "range") {
    return (
      <Box className="mt-3 gap-2">
        <AppCalendarPicker
          control={control}
          name="draftFilters.startDate"
          label="Từ ngày"
          placeholder="Bắt đầu"
        />
        <AppCalendarPicker
          control={control}
          name="draftFilters.endDate"
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
          name="draftFilters.year"
          placeholder="YYYY"
        />
      </Box>
    );
  }

  return null;
}

type NumberFieldProps = {
  control: Control<AlbumPageFormValues>;
  label: string;
  maxLength: number;
  name: "draftFilters.year";
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
          onChange={(event) =>
            field.onChange(keepDigits(event.currentTarget.value))
          }
        />
      )}
    />
  );
}
