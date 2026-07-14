import { readState, writeState } from "@/services/mockDbState";

export function deleteMockAnniversary(
  coupleId: string,
  anniversaryId: string,
  userId: string,
) {
  const state = readState();
  const anniversary = state.anniversaries.find((item) => {
    if (item.couple_id !== coupleId) return false;

    return item.id === anniversaryId;
  });
  if (!anniversary) throw new Error("Không tìm thấy kỷ niệm.");
  if (anniversary.created_by !== userId) {
    throw new Error("Chỉ người tạo kỷ niệm mới có thể xoá.");
  }

  state.anniversaries = state.anniversaries.filter((item) => {
    return item.id !== anniversaryId;
  });
  writeState(state);
}
