import { useFormContext } from "react-hook-form";
import {
  AppImageViewer,
  Box,
  Icon,
  Text,
  useAppSnackbar,
} from "@/components/zaui";
import { pickImagePath } from "@/utils/imagePicker";
import type { HomeDisplayFormValues } from "../types/HomePageType";

type Props = {
  backgroundUrl?: string | null;
  onChangeBackground?: (url: string) => Promise<unknown>;
};

export function HomeHero({ backgroundUrl, onChangeBackground }: Props) {
  const snackbar = useAppSnackbar();
  const { setValue } = useFormContext<HomeDisplayFormValues>();

  const changeBackground = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const image = await pickImagePath();
      if (!image) return;

      if (onChangeBackground) {
        await onChangeBackground(image);
      } else {
        setValue("backgroundUrl", image, { shouldDirty: true });
      }
    } catch (error) {
      console.error(error);
      snackbar.showError("Không thể chọn ảnh nền. Vui lòng thử lại.");
    }
  };

  if (backgroundUrl) {
    return (
      <Box
        className="relative mb-3.5 flex min-h-44 cursor-pointer flex-col justify-end overflow-hidden rounded-[18px] px-[22px] pb-[22px] pt-[55px]"
        role="button"
        tabIndex={0}
      >
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          src={backgroundUrl}
        />
        <Box className="absolute inset-0 bg-gradient-to-b from-[#3c2435]/5 to-[#3c2435]/45" />
        <AppImageViewer images={[backgroundUrl]} />
        <Box
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/30 text-white backdrop-blur-md"
          role="button"
          onClick={changeBackground}
        >
          <Icon icon="zi-camera" size={16} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className="mb-3.5 min-h-44 overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_3%_86%,#fff0da_0_15%,transparent_28%),radial-gradient(circle_at_97%_12%,#ffc9df_0_18%,transparent_30%),linear-gradient(132deg,#f2d7ff_0%,#ead9ff_48%,#ffddea_100%)] px-[22px] pb-[22px] pt-[55px]"
      role="button"
      tabIndex={0}
      onClick={changeBackground}
    >
      <Box className="mx-auto mb-2.5 grid size-[50px] place-items-center text-[32px] text-white">
        <Icon icon="zi-user" />
      </Box>
      <Text className="mx-auto max-w-[270px] text-center text-xs font-extrabold text-white/90">
        Thêm tấm ảnh yêu thích của hai bạn
      </Text>
    </Box>
  );
}
