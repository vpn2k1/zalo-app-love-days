import type { ReactNode } from "react";

import { Box, Button, Icon, Text } from "@/components/zaui";

type Props = {
  action?: ReactNode;
  subtitle?: ReactNode;
  title: string;
  onBack?: () => void;
};

export function AppPageHeader({ action, subtitle, title, onBack }: Props) {
  return (
    <Box className="mb-3 rounded-[22px] border border-pink-100 bg-white/80 px-3 py-2.5 shadow-[0_12px_28px_rgba(201,47,103,0.08)] backdrop-blur">
      <Box className="flex min-h-11 items-center gap-2">
        {onBack && (
          <Button
            className="!size-10 !min-h-10 !min-w-10 flex-none rounded-full bg-[#fff0f6] p-0 text-[#d9467e]"
            htmlType="button"
            icon={<Icon icon="zi-chevron-left" />}
            variant="tertiary"
            onClick={onBack}
          />
        )}

        <Box className="min-w-0 flex-1">
          <Text.Title
            size="small"
            className="overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[#2f1d2a]"
          >
            {title}
          </Text.Title>
          {subtitle && (
            <Text className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold text-[#9b6f86]">
              {subtitle}
            </Text>
          )}
        </Box>

        {action && <Box className="flex-none">{action}</Box>}
      </Box>
    </Box>
  );
}
