import { Box, Icon, Text } from "@/components/zaui";
import type { ZmpIconName } from "../types/HomePageType";

type Props = {
  icon: ZmpIconName;
  title: string;
  label: string;
  value: string;
};

export function MilestoneCard({ icon, title, label, value }: Props) {
  return (
    <Box className="h-[92px] rounded-[18px] bg-white/90 p-3">
      <Box className="mb-2 grid size-[30px] place-items-center rounded-[11px] bg-[#fff0f6] text-[#e14d86]">
        <Icon icon={icon} />
      </Box>
      <Text className="text-xs leading-[1.35] text-[#8b6b7d]">{title}</Text>
      <Text className="mt-0.5 text-xl font-[850] text-[#3a2232]">{value}</Text>
      <Text className="text-xs leading-[1.35] text-[#8b6b7d]">{label}</Text>
    </Box>
  );
}
