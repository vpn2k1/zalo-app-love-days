import { Box, Text } from "zmp-ui";
import { useGetMemory } from "../modules/useGetMemory";

export function CalendarMemory() {
  const data = useGetMemory();
  console.log(data);
  
  const renderBody = () => {};
  return (
    <Box className="rounded-[24px] border border-[var(--love-border)] bg-white/85 p-3.5 shadow-[0_14px_30px_rgba(201,47,103,0.08)]">
      <Text className="text-xs font-bold uppercase text-[#c45a86]">
        Chi tiết kỷ niệm
      </Text>
      <Text.Title size="small" className="mt-1 font-serif text-[#2f1d2a]">
        {/* {title} */}
      </Text.Title>
      <Text className="mt-1 text-xs font-bold text-[#8b6b7d]">
        {/* {formatDate(date)} */}
      </Text>
      {/* {renderButton()} */}
    </Box>
  );
}
