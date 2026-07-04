import { useState } from "react";
import { AppImageViewer, Box, Icon, Text } from "@/components/zaui";

type Props = {
  backgroundUrl?: string | null;
};

export function HomeHero({ backgroundUrl }: Props) {
  const [viewerVisible, setViewerVisible] = useState(false);

  if (backgroundUrl) {
    return (
      <Box>
        <Box
          className="relative mb-3.5 flex min-h-44 cursor-pointer flex-col justify-end overflow-hidden rounded-[18px] px-[22px] pb-[22px] pt-[55px]"
          role="button"
          tabIndex={0}
          onClick={() => setViewerVisible(true)}
        >
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={backgroundUrl}
          />
          <Box className="absolute inset-0 bg-gradient-to-b from-[#3c2435]/5 to-[#3c2435]/45" />
        </Box>
        <AppImageViewer
          images={[{ src: backgroundUrl, alt: "Ảnh cặp đôi" }]}
          visible={viewerVisible}
          onClose={() => setViewerVisible(false)}
        />
      </Box>
    );
  }

  return (
    <Box className="mb-3.5 min-h-44 overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_3%_86%,#fff0da_0_15%,transparent_28%),radial-gradient(circle_at_97%_12%,#ffc9df_0_18%,transparent_30%),linear-gradient(132deg,#f2d7ff_0%,#ead9ff_48%,#ffddea_100%)] px-[22px] pb-[22px] pt-[55px]">
      <Box className="mx-auto mb-2.5 grid size-[50px] place-items-center text-[32px] text-white">
        <Icon icon="zi-user" />
      </Box>
      <Text className="mx-auto max-w-[270px] text-center text-xs font-extrabold text-white/90">
        Add your favorite couple photo
      </Text>
    </Box>
  );
}
