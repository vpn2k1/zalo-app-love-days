import type { PermissionCopy } from "../types/PermissionGateType";

export function getPermissionCopy(blocked?: boolean): PermissionCopy {
  if (blocked) {
    return {
      actionLabel: "Tạo không gian yêu",
      cardCopy:
        "Đếm ngày bên nhau, kỷ niệm và ghi chú trong Zalo",
      cardTitle: "Lưu lại hành trình",
      dayTitle: "0",
      heroTitle: "Bắt đầu câu chuyện của hai bạn",
      note: "Love Days chỉ dùng thông tin Zalo cơ bản để tạo hồ sơ cho bạn.",
    };
  }

  return {
    actionLabel: "Tạo không gian yêu",
    cardCopy:
      "Đếm ngày bên nhau, kỷ niệm và ghi chú trong Zalo",
    cardTitle: "Lưu lại hành trình",
    dayTitle: "1,234",
    heroTitle: "Bắt đầu câu chuyện của hai bạn",
    note: "Đếm ngày yêu, lưu kỷ niệm và nhắc những dịp quan trọng trong một mini app thật nhẹ.",
  };
}
