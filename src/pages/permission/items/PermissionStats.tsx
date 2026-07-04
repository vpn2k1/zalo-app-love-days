import { Text } from "@/components/zaui";

type Props = {
  dayTitle: string;
};

export function PermissionStats({ dayTitle }: Props) {
  return (
    <section className="app-opening-days">
      <Text.Title size="large">{dayTitle}</Text.Title>
      <Text>thiết lập rồi vào app</Text>
    </section>
  );
}
