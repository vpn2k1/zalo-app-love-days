import type { CSSProperties } from "react";

const card: CSSProperties = {
  background: "rgba(255, 255, 255, 0.92)",
  border: 0,
  borderRadius: 18,
  boxShadow: "none",
};

export const homeStyles = {
  action: { ...card, color: "#d9467e", height: 66, minWidth: 0, padding: "10px 5px 8px" },
  actionLabel: {
    color: "#684e5f", display: "block", fontSize: 11, fontWeight: 800,
    marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  actions: { display: "grid", gap: 6, gridTemplateColumns: "repeat(4, minmax(0, 1fr))", marginBottom: 16 },
  avatar: { borderRadius: 999, objectFit: "cover" },
  chip: { alignItems: "center", border: 0, borderRadius: 999, display: "inline-flex", gap: 6, minHeight: 36, padding: "0 14px" },
  chipDark: { background: "#3a2232", color: "#fff" },
  chipLight: { background: "#fff", color: "#d9467e" },
  chipRow: { display: "flex", gap: 8, marginBottom: 12 },
  coupleCard: {
    ...card, alignItems: "center", display: "flex", gap: 14, height: 74,
    justifyContent: "space-between", margin: "16px 0 12px", padding: "10px 12px",
  },
  daysButton: { ...card, display: "block", marginBottom: 12, minHeight: 116, padding: "13px 18px 14px", textAlign: "center", width: "100%" },
  daysLabel: { color: "#7f6072", fontSize: 12, fontWeight: 700 },
  daysNumber: { color: "#d9467e", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 39, fontWeight: 500, lineHeight: 1.32 },
  eventGrid: { display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr", marginBottom: 12 },
  feedback: { ...card, color: "#7b5f70", display: "grid", gap: 4, marginBottom: 12, padding: "10px 12px", textAlign: "center" },
  header: { alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 13 },
  headerSubtitle: { color: "#8f7485", fontSize: 12, fontWeight: 600 },
  headerTitle: { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 18, fontWeight: 500 },
  hero: {
    minHeight: 176, marginBottom: 14, overflow: "hidden", padding: "55px 22px 22px",
    borderRadius: 18,
    background: "radial-gradient(circle at 3% 86%, #fff0da 0 15%, transparent 28%), radial-gradient(circle at 97% 12%, #ffc9df 0 18%, transparent 30%), linear-gradient(132deg, #f2d7ff 0%, #ead9ff 48%, #ffddea 100%)",
  },
  heroCopy: { color: "rgba(255, 255, 255, 0.92)", fontSize: 12, fontWeight: 800, margin: "0 auto", maxWidth: 270, textAlign: "center" },
  heroIcon: { color: "#fff", display: "grid", fontSize: 32, height: 50, margin: "0 auto 10px", placeItems: "center", width: 50 },
  iconButton: { background: "#fff", color: "#d9467e" },
  linkButton: { background: "transparent", borderRadius: 999, color: "#e14d86", fontWeight: 850, minHeight: 32, padding: "0 10px" },
  milestone: { ...card, height: 92, padding: 12 },
  milestoneIcon: { alignItems: "center", background: "#fff0f6", borderRadius: 11, color: "#e14d86", display: "grid", height: 30, marginBottom: 8, placeItems: "center", width: 30 },
  milestoneValue: { color: "#3a2232", fontSize: 20, fontWeight: 850, marginTop: 2 },
  muted: { color: "#8b6b7d", fontSize: 12, lineHeight: 1.35 },
  page: { background: "#fff4f8", color: "#3c2435", margin: "0 auto", minHeight: "100vh", padding: "16px 18px 34px", width: "min(100%, 430px)" },
  panel: { ...card, marginBottom: 12, padding: 14 },
  person: { alignItems: "center", display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" },
  personName: { color: "#2f1d2a", fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 21, fontWeight: 500 },
  sectionTitle: { alignItems: "center", display: "flex", gap: 12, justifyContent: "space-between", margin: "4px 0 8px" },
  sectionTitleText: { color: "#2f1d2a", fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500 },
  status: { alignItems: "center", display: "flex", justifyContent: "space-between", margin: "0 6px 17px" },
  statusIcons: { display: "flex", fontSize: 14, gap: 5 },
  timeline: { ...card, marginBottom: 12, padding: "10px 14px 14px" },
  timelineHead: { alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 10 },
  timelineIcon: { background: "#fff0f6", borderRadius: 11, color: "#e14d86", display: "grid", flex: "0 0 30px", height: 30, placeItems: "center", width: 30 },
  timelineItem: { alignItems: "center", display: "flex", gap: 12, minHeight: 40 },
  timelineTitle: { color: "#3a2232", fontWeight: 850 },
} satisfies Record<string, CSSProperties>;

export function actionStyle(index: number): CSSProperties {
  const style: CSSProperties = { ...homeStyles.action };
  if (index === 1 || index === 3) {
    style.background = "#efe6ff";
    style.color = "#7d62d8";
  }
  if (index === 2) {
    style.background = "#fff7eb";
    style.color = "#d77a32";
  }
  return style;
}
