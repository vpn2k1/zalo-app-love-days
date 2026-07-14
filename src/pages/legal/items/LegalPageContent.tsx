import { Box, Text } from "@/components/zaui";
import type {
  LegalBlock,
  LegalPageContent as LegalPageContentType,
} from "../types/LegalPageType";

type Props = {
  page: LegalPageContentType;
};

export function LegalPageContent({ page }: Props) {
  return (
    <Box className="app-legal-tab-body px-4 py-4">
      <Text.Title size="large" className="font-serif text-[#2f1d2a]">
        {page.subtitle}
      </Text.Title>
      <Text className="mt-1 text-xs font-bold text-[#9b6f86]">
        Cập nhật lần cuối: {page.updatedAt}
      </Text>
      <Text className="mt-4 text-sm leading-6 text-[#4a3141]">{page.intro}</Text>

      {page.sections.map((section) => (
        <Box key={section.title} className="mt-5">
          <Text.Title size="small" className="font-serif text-[#2f1d2a]">
            {section.title}
          </Text.Title>
          <Box className="mt-2 grid gap-3">
            {section.blocks.map((block, index) => (
              <LegalContentBlock block={block} index={index} key={index} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function LegalContentBlock({
  block,
  index,
}: {
  block: LegalBlock;
  index: number;
}) {
  if (block.type === "paragraph") {
    return <Text className="text-sm leading-6 text-[#4a3141]">{block.text}</Text>;
  }

  if (block.type === "notice") {
    return (
      <Box className="rounded-2xl border-l-4 border-[#d9467e] bg-[#fff5f8] px-3 py-2">
        <Text className="text-sm font-bold leading-6 text-[#6f4059]">
          {block.text}
        </Text>
      </Box>
    );
  }

  if (block.type === "table") {
    return <LegalTable block={block} />;
  }

  if (block.type === "steps") {
    return (
      <ol className="m-0 pl-5 text-sm leading-6 text-[#4a3141]">
        {block.items.map((item) => (
          <li className="mb-1" key={`${index}-${item}`}>
            {item}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className="m-0 pl-5 text-sm leading-6 text-[#4a3141]">
      {block.items.map((item) => (
        <li className="mb-1" key={`${index}-${item}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function LegalTable({ block }: { block: Extract<LegalBlock, { type: "table" }> }) {
  return (
    <Box className="overflow-x-auto rounded-2xl border border-pink-100">
      <table className="w-full min-w-[640px] border-collapse bg-white text-left text-xs text-[#4a3141]">
        <thead>
          <tr className="bg-[#fff0f6] text-[#c92f67]">
            {block.headers.map((header) => (
              <th className="border-b border-pink-100 px-3 py-2" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell) => (
                <td className="border-b border-pink-50 px-3 py-2 align-top" key={cell}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
