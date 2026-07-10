import { useForm } from "react-hook-form";
import { BlockingLoadingOverlay } from "@/components/BlockingLoadingOverlay";
import { AppCalendarPicker } from "@/components/forms";
import { AppModal } from "@/components/zaui";

type Props = {
  currentStartDate: string;
  loading?: boolean;
  visible: boolean;
  onClose: () => void;
  onSave: (startDate: string) => Promise<unknown>;
};

type StartDateFormValues = {
  startDate: string;
};

export function StartDateModal({
  currentStartDate,
  loading,
  visible,
  onClose,
  onSave,
}: Props) {
  const { control, handleSubmit, reset, watch } = useForm<StartDateFormValues>({
    defaultValues: {
      startDate: currentStartDate,
    },
  });
  const startDateDraft = watch("startDate");

  const close = () => {
    reset({ startDate: currentStartDate });
    onClose();
  };

  const submit = async (values: StartDateFormValues) => {
    if (!values.startDate) return;
    await onSave(values.startDate);
    close();
  };

  return (
    <AppModal
      visible={visible}
      title="Chọn lại ngày kỷ niệm"
      maskClosable={!loading}
      onClose={close}
      actions={[
        {
          key: "cancel",
          text: "Huỷ",
          close: true,
        },
        {
          key: "save",
          text: "Lưu",
          highLight: true,
          disabled: !startDateDraft || loading,
          onClick: handleSubmit(submit),
        },
      ]}
    >
      <BlockingLoadingOverlay
        show={Boolean(loading)}
        message="Đang lưu ngày kỷ niệm..."
      />
      <AppCalendarPicker
        control={control}
        name="startDate"
        label="Ngày bắt đầu"
        endDate={new Date()}
        required
      />
    </AppModal>
  );
}
