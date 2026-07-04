export type PermissionGateProps = {
  blocked?: boolean;
  loading?: boolean;
  onAllow: () => void;
};

export type PermissionCopy = {
  actionLabel: string;
  cardCopy: string;
  cardTitle: string;
  dayTitle: string;
};
