import type { PermissionCopy } from "../types/PermissionGateType";

export function getPermissionCopy(blocked?: boolean): PermissionCopy {
  if (blocked) {
    return {
      actionLabel: "Thử lại",
      cardCopy:
        "Ứng dụng cần quyền đọc thông tin cơ bản để tạo không gian riêng cho hai bạn.",
      cardTitle: "Cần quyền Zalo để tiếp tục",
      dayTitle: "thử lại",
    };
  }

  return {
    actionLabel: "Thiết lập",
    cardCopy: "Đếm ngày bên nhau, kỷ niệm và ghi chú trong Zalo",
    cardTitle: "Lưu lại hành trình",
    dayTitle: "1 chạm",
  };
}
