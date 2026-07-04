import type { Control } from "react-hook-form";
import { AppTextInput } from "@/components/forms";
import type { ProfileFormValues } from "../types/EditProfilePageType";

type Props = {
  control: Control<ProfileFormValues>;
};

export function EditProfileFields({ control }: Props) {
  return (
    <section className="app-setup-card">
      <div className="app-setup-form">
        <AppTextInput
          control={control}
          name="display_name"
          label="Tên hiển thị"
        />
      </div>
    </section>
  );
}
