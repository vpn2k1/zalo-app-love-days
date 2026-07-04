import { Box, Icon, Text } from "@/components/zaui";

type Props = {
  copy: string;
  title: string;
};

export function PermissionCard({ copy, title }: Props) {
  return (
    <section className="app-opening-card">
      <div>
        <Text.Title size="small">{title}</Text.Title>
        <Text className="app-card-copy">{copy}</Text>
      </div>
      <Box className="app-small-heart">
        <Icon icon="zi-heart" />
      </Box>
    </section>
  );
}
