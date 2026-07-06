import { Box, Icon, Text } from "@/components/zaui";
import type { ZmpIconName } from "../types/HomePageType";

type Props = {
  onOpenCalendar: () => void;
  onViewAlbums: () => void;
  onViewMemories: () => void;
};

export function QuickActionGrid({
  onOpenCalendar,
  onViewAlbums,
  onViewMemories,
}: Props) {
  const actions: Array<{
    icon: ZmpIconName;
    label: string;
    onClick: () => void | Promise<unknown>;
  }> = [
    { icon: "zi-note", label: "Kỷ niệm", onClick: onViewMemories },
    { icon: "zi-calendar", label: "Lịch", onClick: onOpenCalendar },
    { icon: "zi-camera", label: "Bộ ảnh", onClick: onViewAlbums },
  ];

  return (
    <Box className="mb-4 grid grid-cols-3 gap-2.5">
      {actions.map((action, index) => (
        <Box
          key={action.label}
          role="button"
          tabIndex={0}
          onClick={() => void action.onClick()}
          className={getActionClassName(index)}
        >
          <Box className="grid size-9 place-items-center rounded-2xl bg-white/70 shadow-sm">
            <Icon icon={action.icon} />
          </Box>
          <Text className="mt-2 block overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-extrabold text-[#3a2232]">
            {action.label}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

function getActionClassName(index: number) {
  if (index === 1) {
    return "grid h-[88px] min-w-0 place-items-center rounded-[22px] border border-white/70 bg-[radial-gradient(circle_at_3%_86%,#fff0da_0_15%,transparent_28%)] bg-[#efe6ff] px-2 py-3 text-[#7d62d8] shadow-[0_12px_28px_rgba(84,49,72,0.08)]";
  }

  if (index === 2) {
    return "grid h-[88px] min-w-0 place-items-center rounded-[22px] border border-white/70 bg-[radial-gradient(circle_at_3%_86%,#fff0da_0_15%,transparent_28%)] bg-[#fff7eb] px-2 py-3 text-[#d77a32] shadow-[0_12px_28px_rgba(84,49,72,0.08)]";
  }

  return "grid h-[88px] min-w-0 place-items-center rounded-[22px] border border-white/70 bg-[radial-gradient(circle_at_3%_86%,#fff0da_0_15%,transparent_28%)] bg-white/90 px-2 py-3 text-[#d9467e] shadow-[0_12px_28px_rgba(84,49,72,0.08)]";
}
